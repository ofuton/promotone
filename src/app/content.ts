import "../manifest.json"
import "../styles/content.scss"
import { html, render } from "lit-html"
import DomObserver, {
  CommentComponentChangedDetail,
  EventType,
} from "./kintone/dom-observer"

const domObserver = new DomObserver()
domObserver.startPostsObserver()

document.addEventListener(EventType.COMMENT_COMPONENT_CHANGED, (e) => {
  const customEvent = e as CustomEvent
  const customEventDetail = customEvent.detail as CommentComponentChangedDetail
  const targetEl = customEventDetail.element
  const addedEls = customEventDetail.addedElements
  console.log("comment component changed", targetEl)
  console.log("addedEls", addedEls)
})
