import "../manifest.json"
import "../styles/content.scss"
import { html, render } from "lit-html"
import DomObserver, {
  CommentComponentChangedDetail,
  CommentComponentLoadedDetail,
  EventType,
} from "./kintone/dom-observer"
import PromotionHelper from "./promotion-helper"
import { injectScript } from "./inject-helper"
import PromotoneSettings from "./promotone-settings"

// injectした側からchrome.storage.syncを叩くことが出来ないので
// localStorage経由で値の受け渡しを行う
PromotoneSettings.loadAppId((appId) => {
  if (appId === undefined) {
    return
  }
  window.localStorage.setItem("promotone:AppId", appId)
  injectScript()
})

PromotoneSettings.loadEnabled((enabled) => {
  if (!enabled) {
    return
  }
  const domObserver = new DomObserver()
  domObserver.startPostsObserver()
  const promotionHelper = new PromotionHelper()

  document.addEventListener(EventType.COMMENT_COMPONENT_LOADED, (e) => {
    const customEvent = e as CustomEvent
    const customEventDetail = customEvent.detail as CommentComponentLoadedDetail
    const commentComponentEl = customEventDetail.element
    promotionHelper.insertPromotion(commentComponentEl, 5)
  })

  document.addEventListener(EventType.COMMENT_COMPONENT_CHANGED, (e) => {
    const customEvent = e as CustomEvent
    const customEventDetail = customEvent.detail as CommentComponentChangedDetail
    const targetEl = customEventDetail.element
    promotionHelper.insertPromotion(targetEl, 5)
  })

  document.addEventListener("promotionLoaded", (e) => {
    const eventDetail = (e as CustomEvent).detail
    const records = eventDetail.records
    promotionHelper.setPromotions(records)
    PromotoneSettings.loadAppId((appId) => {
      if (!parseInt(appId)) {
        return
      }
      promotionHelper.setAppId(parseInt(appId))
    })
  })
})
