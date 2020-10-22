export default class PromotoneSettings {
  static loadEnabled(callback: (enabled: boolean) => void) {
    chrome.storage.sync.get(["promotoneEnabled"], (result) => {
      let enabled = result.promotoneEnabled
      // 設定が入っていないときはtrue判定
      if (enabled === undefined) {
        enabled = true
      }
      callback(enabled)
    })
  }

  static saveEnabled(enabled: boolean): void {
    chrome.storage.sync.set({ promotoneEnabled: enabled })
  }

  static loadAppId(callback: (appId: string) => void) {
    chrome.storage.sync.get(["promotoneAppId"], (result) => {
      callback(result.promotoneAppId)
    })
  }

  static saveAppId(appId: string, callback: () => void) {
    chrome.storage.sync.set({ promotoneAppId: appId }, callback)
  }
}
