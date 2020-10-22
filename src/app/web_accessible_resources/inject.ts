import { getPromotions } from "../kintone/promotion"

getPromotions().then((resp: { records: any }) => {
  const customEvent = new CustomEvent("promotionLoaded", {
    detail: { records: resp.records },
  })
  document.dispatchEvent(customEvent)
}) // TODO: AppIdをオプションから渡せるようにする
