kintone
  .api("/k/v1/records", "GET", { app: 414, query: "limit 20" })
  .then((resp: { records: any }) => {
    const customEvent = new CustomEvent("promotionLoaded", {
      detail: { records: resp.records },
    })
    document.dispatchEvent(customEvent)
  }) // TODO: AppIdをオプションから渡せるようにする
