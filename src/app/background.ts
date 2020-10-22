console.log("background")
import PromotoneSettings from "./promotone-settings"

const setBrowserActionIcon = (enabled: boolean) => {
  chrome.browserAction.setIcon({
    path: enabled ? "icons/icon48.png" : "icons/icon48-off.png",
  })
}

PromotoneSettings.loadEnabled((enabled) => {
  setBrowserActionIcon(enabled)
})

chrome.browserAction.onClicked.addListener(() => {
  PromotoneSettings.loadEnabled((enabled) => {
    const newEnabled = !enabled
    setBrowserActionIcon(newEnabled)
    PromotoneSettings.saveEnabled(newEnabled)
  })
})
