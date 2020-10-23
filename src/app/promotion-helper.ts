import "../styles/promotion-helper.scss"
import { html, render } from "lit-html"
import { unsafeHTML } from "lit-html/directives/unsafe-html"
import sanitizeHtml from "sanitize-html"
import { likePromotion } from "./kintone/requests-for-inject"

export default class PromotionHelper {
  appId: number | null = null
  loginUser: { code: string; name: string } | null = null
  promotions: Promotion[] = []
  /**
   *
   * @param postInterval 投稿を差し込む間隔。1だった場合は投稿1つ置きに広告を差し込む
   */
  insertPromotion = (container: HTMLElement, postInterval: number) => {
    if (this.promotions.length <= 0) {
      return
    }
    const posts = Array.from(
      container.querySelectorAll(
        ".ocean-ui-comments-post:not(.promotone-visited)"
      )
    )
    posts.forEach((post, index) => {
      if (index % postInterval !== 0) {
        return
      }
      const promotion = this.pickUpPromotion_()
      if (promotion === null) {
        return
      }
      const el = document.createElement("div")
      post.insertAdjacentElement("afterend", el)
      this.renderPromotionElement_(promotion, el) // insertが重複する可能性があるので一度見た投稿は次回以降無視する
      post.classList.add("promotone-visited")
    })
  }

  setAppId(appId: number) {
    this.appId = appId
  }

  setPromotionsFromRecords(records: promotone.types.SavedPromotionFields[]) {
    this.promotions = records.map((record) => {
      const likeCount = parseInt(record.likeCount.value)
      const recordId = this.extractRecordId_(record.$id.value)
      const promotion: Promotion = {
        recordId: recordId,
        content: record.content.value,
        sender: record.作成者.value,
        likeCount: likeCount ? likeCount : 0,
        likedUserCodes: record.likedUsers.value.map((user) => user.code),
      }
      return promotion
    })
  }

  extractRecordId_(recordIdMayHaveAppCode: string): number {
    const result = recordIdMayHaveAppCode.match(/.-(?<appId>\d+)/)
    if (result && result.groups) {
      return parseInt(result.groups["appId"])
    }
    const recordId = parseInt(recordIdMayHaveAppCode)
    if (recordId) {
      return recordId
    }
    return 0
  }

  renderPromotionElement_(promotion: Promotion, targetElement: HTMLElement) {
    const sanitizedHtml = sanitizeHtml(promotion.content)
    const className = `promotone-promotion-${promotion.recordId}`
    const template = html`<div class="promotone-card ${className}">
      <div class="promotone-card-left">
        <div class="promotone-card-user-icon">
          <img />
        </div>
      </div>
      <div class="promotone-card-right">
        <div class="promotone-card-user-name">${promotion.sender.name}</div>
        <div class="promotone-card-content">${unsafeHTML(sanitizedHtml)}</div>
        <div
          class="
        promotone-card-footer"
        >
          <div class="promotone-card-footer-actions">
            <div
              class="promotone-card-like ${promotion.likedUserCodes.some(
                (userCode) => userCode === this.loginUser?.code
              )
                ? "promotone-card-like__liked"
                : ""}"
            >
              <label
                for="promotone-card-like-button"
                class="promotone-card-like-count-text"
                >${promotion.likeCount}</label
              >
              <button id="promotone-card-like-button">いいね！</button>
            </div>
          </div>
        </div>
      </div>

      <div class="promotone-card-not-displayed">
        <button class="promotone-card-not-displayed-button">
          この広告を今後表示しない
        </button>
      </div>
      
      <div class="promotone-card-message">
        <span>プロモーション</span>
      </span>
    </div>`
    render(template, targetElement)
    this.listenLikeButtonClick_(targetElement, promotion)
    this.listenNotDisplayedButtonClick_(targetElement, promotion, className)
  }

  static removeAllPromotionCard() {
    Array.from(document.querySelectorAll(".promotone-card")).forEach((card) => {
      card.remove()
    })
  }

  pickUpPromotion_(): Promotion | null {
    if (this.promotions.length <= 0) {
      return null
    }
    return this.promotions[Math.floor(Math.random() * this.promotions.length)]
  }

  listenLikeButtonClick_(element: HTMLElement, promotion: Promotion) {
    const el = element.querySelector("#promotone-card-like-button")
    if (!el) {
      return
    }
    const likeButtonEl = el as HTMLInputElement
    likeButtonEl.addEventListener("click", () => {
      if (!this.appId) {
        return
      }
      if (this.isLiked_(element)) {
        this.decrementLikeCountText_(element)
        document.dispatchEvent(
          new CustomEvent("promotone:unliked", {
            detail: {
              appId: this.appId,
              recordId: promotion.recordId,
            },
          })
        )
      } else {
        this.incrementLikeCountText_(element)
        document.dispatchEvent(
          new CustomEvent("promotone:liked", {
            detail: {
              appId: this.appId,
              recordId: promotion.recordId,
            },
          })
        )
      }
      this.setLikedClassName_(element, !this.isLiked_(element))
    })
  }

  isLiked_(element: HTMLElement): boolean {
    const likeWrapperEl = element.querySelector(
      ".promotone-card-like"
    ) as HTMLElement
    return likeWrapperEl.classList.contains("promotone-card-like__liked")
  }

  incrementLikeCountText_(element: HTMLElement) {
    const likeCountTextEl = element.querySelector(
      ".promotone-card-like-count-text"
    ) as HTMLElement
    likeCountTextEl.innerText = (
      parseInt(likeCountTextEl.innerText) + 1
    ).toString()
  }

  decrementLikeCountText_(element: HTMLElement) {
    const likeCountTextEl = element.querySelector(
      ".promotone-card-like-count-text"
    ) as HTMLElement
    likeCountTextEl.innerText = (
      parseInt(likeCountTextEl.innerText) - 1
    ).toString()
  }

  setLikedClassName_(element: HTMLElement, toggledIsLiked: boolean) {
    const wrapperEl = element.querySelector(
      ".promotone-card-like"
    ) as HTMLElement
    if (toggledIsLiked) {
      wrapperEl.classList.add("promotone-card-like__liked")
    } else {
      wrapperEl.classList.remove("promotone-card-like__liked")
    }
  }

  listenNotDisplayedButtonClick_(
    element: HTMLElement,
    promotion: Promotion,
    className: string
  ) {
    const el = element.querySelector(".promotone-card-not-displayed")
    if (!el) {
      return
    }
    const notDisplayedEl = el as HTMLInputElement
    notDisplayedEl.addEventListener("click", () => {
      if (
        !window.confirm(
          "一度非表示にすると、この広告は二度と表示されなくなりますが、よろしいですか？"
        )
      ) {
        return
      }
      if (!this.appId) {
        return
      }
      this.promotions = this.promotions.filter(
        (p) => p.recordId === promotion.recordId
      )
      document.dispatchEvent(
        new CustomEvent("promotone:notDisplayed", {
          detail: {
            appId: this.appId,
            recordId: promotion.recordId,
            identifyClassName: className,
          },
        })
      )
    })
  }
}

export type Promotion = {
  recordId: number
  content: string
  sender: {
    code: string
    name: string
  }
  likeCount: number
  likedUserCodes: string[]
  startDatetime?: Date
  endDatetime?: Date
}
