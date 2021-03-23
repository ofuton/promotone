import {
  getPromotions,
  likePromotion,
  notDisplayPromotion,
  unlikePromotion,
} from "../kintone/requests-for-inject"

const loginUser = kintone.getLoginUser()
document.dispatchEvent(
  new CustomEvent("promotone:getLoginUser", {
    detail: {
      loginUser: {
        code: loginUser.code,
        name: loginUser.name,
      },
    },
  })
)

const savedValue = window.localStorage.getItem("promotone:AppId")
if (savedValue && !!parseInt(savedValue)) {
  getPromotions(parseInt(savedValue)).then((resp: { records: any }) => {
    const customEvent = new CustomEvent("promotionLoaded", {
      detail: { records: resp.records },
    })
    document.dispatchEvent(customEvent)
  }).catch(() => {
    console.log("promotone: 広告取得用のアプリが見つかりませんでした")
  })
}

document.addEventListener("promotone:liked", (e) => {
  const customEvent = e as CustomEvent
  if (!customEvent) {
    return
  }
  const eventDetail = customEvent.detail as PromotoneLikedDetail
  const appId = eventDetail.appId
  const recordId = eventDetail.recordId
  const likedUser = kintone.getLoginUser().code
  likePromotion(appId, recordId, likedUser)
})

document.addEventListener("promotone:unliked", (e) => {
  const customEvent = e as CustomEvent
  if (!customEvent) {
    return
  }
  const eventDetail = customEvent.detail as PromotoneLikedDetail
  const appId = eventDetail.appId
  const recordId = eventDetail.recordId
  const unlikedUser = kintone.getLoginUser().code
  unlikePromotion(appId, recordId, unlikedUser)
})

document.addEventListener("promotone:notDisplayed", (e) => {
  const customEvent = e as CustomEvent
  if (!customEvent) {
    return
  }
  const eventDetail = customEvent.detail as PromotoneNotDisplayedDetail
  const appId = eventDetail.appId
  const recordId = eventDetail.recordId
  const identifyClassName = eventDetail.identifyClassName
  const notDisplayedUser = kintone.getLoginUser().code
  notDisplayPromotion(appId, recordId, notDisplayedUser).then(() => {
    const targetEls = document.querySelectorAll(`.${identifyClassName}`)
    if (!targetEls) {
      return
    }
    Array.from(targetEls).forEach((targetEl) => {
      ;(targetEl as HTMLElement).style.display = "none"
    })
  })
})

type PromotoneLikedDetail = {
  appId: number
  recordId: number
}

type PromotoneNotDisplayedDetail = {
  appId: number
  recordId: number
  identifyClassName: string
}
