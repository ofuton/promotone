import { getPromotions } from "../kintone/promotion"

const savedValue = window.localStorage.getItem("promotone:AppId")
if (savedValue && !!parseInt(savedValue)) {
  getPromotions(parseInt(savedValue)).then((resp: { records: any }) => {
    const customEvent = new CustomEvent("promotionLoaded", {
      detail: { records: resp.records },
    })
    document.dispatchEvent(customEvent)
  }) // TODO: AppIdをオプションから渡せるようにする
}
