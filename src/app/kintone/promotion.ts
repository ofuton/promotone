export const getPromotions = async (): Promise<any> => {
  return kintone.api("/k/v1/records", "GET", { app: 414, query: "limit 20" })
}
