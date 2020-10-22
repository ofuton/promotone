import "../styles/options.scss"
import PromotoneSettings from "./promotone-settings"

console.log("options")

document.addEventListener("DOMContentLoaded", () => {
  let appIdInputEl = document.querySelector("#app-id-input") as HTMLInputElement
  let promotionIntervalInputEl = document.querySelector(
    "#promotion-interval-input"
  ) as HTMLInputElement
  console.log(appIdInputEl, promotionIntervalInputEl)
  if (!appIdInputEl || !promotionIntervalInputEl) {
    return
  }

  const appIdMessageEl = document.querySelector(
    "#app-id-saved-message"
  ) as HTMLElement
  const promotionIntervalMessageEl = document.querySelector(
    "#promotion-interval-saved-message"
  ) as HTMLElement
  if (!appIdMessageEl || !promotionIntervalMessageEl) {
    return
  }

  PromotoneSettings.loadAppId((appId) => {
    appIdInputEl.value = appId
  })

  appIdInputEl.addEventListener("focus", (e) => {
    appIdMessageEl.classList.remove("__success")
  })

  appIdInputEl.addEventListener("change", (e) => {
    const targetEl = e.target as HTMLInputElement
    PromotoneSettings.saveAppId(targetEl.value, () => {
      appIdMessageEl.classList.add("__success")
    })
  })

  PromotoneSettings.loadPromotionInterval((promotionInterval) => {
    promotionIntervalInputEl.value = promotionInterval
  })

  promotionIntervalInputEl.addEventListener("focus", (e) => {
    promotionIntervalMessageEl.classList.remove("__success")
  })

  promotionIntervalInputEl.addEventListener("change", (e) => {
    const targetEl = e.target as HTMLInputElement
    PromotoneSettings.savePromotionInterval(targetEl.value, () => {
      promotionIntervalMessageEl.classList.add("__success")
    })
  })
})
