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

injectScript()
const domObserver = new DomObserver()
domObserver.startPostsObserver()
const promotionHelper = new PromotionHelper()

document.addEventListener(EventType.COMMENT_COMPONENT_LOADED, (e) => {
  const customEvent = e as CustomEvent
  const customEventDetail = customEvent.detail as CommentComponentLoadedDetail
  const commentComponentEl = customEventDetail.element
  console.log("loaded")
  promotionHelper.insertPromotion(commentComponentEl, 5)
})

document.addEventListener(EventType.COMMENT_COMPONENT_CHANGED, (e) => {
  const customEvent = e as CustomEvent
  const customEventDetail = customEvent.detail as CommentComponentChangedDetail
  const targetEl = customEventDetail.element
  const addedEls = customEventDetail.addedElements
  console.log("comment component changed", targetEl)
  console.log("addedEls", addedEls)
})

document.addEventListener("promotionLoaded", (e) => {
  const eventDetail = (e as CustomEvent).detail
  const records = eventDetail.records
  promotionHelper.setPromotions(records)
})
