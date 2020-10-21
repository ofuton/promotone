import "../manifest.json"
import "../styles/content.scss"
import { html, render } from "lit-html"
import DomObserver, { EventType } from "./kintone/dom-observer"

const sayHello = (name: String) => {
  return html`<h1>Hello, ${name}!!</h1>`
}

render(sayHello('ofuton'), document.body);

const domObserver = new DomObserver()
domObserver.startCommentComponentObserver()

document.addEventListener(EventType.COMMENT_COMPONENT_LOADED, (e) => {
  const targetEl = (e as CustomEvent).detail.element
  console.log("comment component loaded", targetEl)
})

