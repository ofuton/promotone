import "../manifest.json"
import "../styles/content.scss"
import DomObserver, {
  CommentComponentChangedDetail,
  CommentComponentLoadedDetail,
  EventType,
} from "./kintone/dom-observer"
import PromotionHelper from "./promotion-helper"
import { injectScript } from "./inject-helper"
import PromotoneSettings from "./promotone-settings"

const promotionHelper = new PromotionHelper()
const domObserver = new DomObserver()

// injectしたファイルからイベントが飛んでくるのでenable/disableに限らず受け取れるようにしておく必要がある
document.addEventListener("promotionLoaded", (e) => {
  const eventDetail = (e as CustomEvent).detail
  const records = eventDetail.records
  promotionHelper.setPromotionsFromRecords(records)
  PromotoneSettings.loadAppId((appId) => {
    if (!parseInt(appId)) {
      return
    }
    promotionHelper.setAppId(parseInt(appId))
  })
})

document.addEventListener(EventType.COMMENT_COMPONENT_LOADED, (e) => {
  const customEvent = e as CustomEvent
  const customEventDetail = customEvent.detail as CommentComponentLoadedDetail
  const commentComponentEl = customEventDetail.element
  PromotoneSettings.loadPromotionInterval((promotionInterval) => {
    promotionHelper.insertPromotion(
      commentComponentEl,
      parseInt(promotionInterval)
    )
  })
})

document.addEventListener(EventType.COMMENT_COMPONENT_CHANGED, (e) => {
  const customEvent = e as CustomEvent
  const customEventDetail = customEvent.detail as CommentComponentChangedDetail
  const targetEl = customEventDetail.element
  PromotoneSettings.loadPromotionInterval((promotionInterval) => {
    promotionHelper.insertPromotion(targetEl, parseInt(promotionInterval))
  })
})

const enablePromotone_ = () => {
  domObserver.startPostsObserver()
}

const disablePromotone_ = () => {
  domObserver.disconnect()
  PromotionHelper.removeAllPromotionCard()
}

// injectした側からchrome.storage.syncを叩くことが出来ないので
// localStorage経由で値の受け渡しを行う
PromotoneSettings.loadAppId((appId) => {
  if (appId === undefined) {
    return
  }
  document.addEventListener("promotone:getLoginUser", (e) => {
    promotionHelper.loginUser = (e as CustomEvent).detail.loginUser
  })
  window.localStorage.setItem("promotone:AppId", appId)
  injectScript()
})

PromotoneSettings.onEnabledChanged((enable) => {
  if (enable) {
    enablePromotone_()
  } else {
    disablePromotone_()
  }
})

PromotoneSettings.loadEnabled((enabled) => {
  if (!enabled) {
    return
  }
  enablePromotone_()
})
