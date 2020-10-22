export const getPromotions = async (appId: number): Promise<any> => {
  return kintone.api("/k/v1/records", "GET", {
    app: appId,
    query:
      'startDatetime <= TODAY() and endDatetime >= TODAY() and notWantToSeeUser not in (" USER", LOGINUSER()) limit 20',
  })
}

export const likePromotion = async (
  appId: number,
  recordId: number,
  likeUserCode: string
): Promise<any> => {
  return kintone
    .api("/k/v1/record", "GET", { app: appId, id: recordId })
    .then((resp) => {
      const record: promotone.types.SavedPromotionFields = resp.record
      const likedUsers: { code: string; name?: string }[] =
        record.likedUsers.value
      // 本当は配列のeveryがlikeUserCodeではないにしたいが、こっちのほうが処理が早い気がする
      if (!likedUsers.some((user) => user.code === likeUserCode)) {
        likedUsers.push({ code: likeUserCode })
      }
      return kintone.api("/k/v1/record", "PUT", {
        app: appId,
        id: recordId,
        record: {
          likedUsers: {
            value: likedUsers,
          },
          likeCount: {
            value: likedUsers.length,
          },
        },
      })
    })
}

export const notDisplayPromotion = async (
  appId: number,
  recordId: number,
  notDisplayedUserCode: string
): Promise<any> => {
  return kintone
    .api("/k/v1/record", "GET", { app: appId, id: recordId })
    .then((resp) => {
      const record: promotone.types.SavedPromotionFields = resp.record
      const notDisplayedUsers: { code: string; name?: string }[] =
        record.likedUsers.value
      // 本当は配列のeveryがlikeUserCodeではないの方がわかりやすい気がするが、打ち切りが出来るのでこっちのほうが処理が早い気がする
      if (
        !notDisplayedUsers.some((user) => user.code === notDisplayedUserCode)
      ) {
        notDisplayedUsers.push({ code: notDisplayedUserCode })
      }
      return kintone.api("/k/v1/record", "PUT", {
        app: appId,
        id: recordId,
        record: {
          notWantToSeeUser: {
            value: notDisplayedUsers,
          },
        },
      })
    })
}
