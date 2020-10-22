import PromotoneSettings from "../promotone-settings"

export const getPromotions = async (appId: number): Promise<any> => {
  return kintone.api("/k/v1/records", "GET", { app: appId, query: "limit 20" })
}
