import "../styles/options.scss"
import PromotoneSettings from "./promotone-settings"

console.log("options")

document.addEventListener("DOMContentLoaded", () => {
  let el = document.querySelector("#app-id-input")
  if (!el) {
    return
  }
  const inputEl = el as HTMLInputElement

  el = document.querySelector("#input-saved-message")
  if (!el) {
    return
  }
  const messageEl = el as HTMLInputElement

  PromotoneSettings.loadAppId((appId) => {
    inputEl.value = appId
  })

  inputEl.addEventListener("focus", (e) => {
    messageEl.classList.remove("__success")
  })

  inputEl.addEventListener("change", (e) => {
    const targetEl = e.target as HTMLInputElement
    PromotoneSettings.saveAppId(targetEl.value, () => {
      messageEl.classList.add("__success")
    })
  })
})
