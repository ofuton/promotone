export default class PromotionHelper {
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
      container.querySelectorAll(".ocean-ui-comments-post")
    )
    const numberOfInsert = Math.floor(posts.length / postInterval)
    for (let i = 0; i < numberOfInsert; i++) {
      const targetElement = posts[i * numberOfInsert] as HTMLElement
      const promotion = this.pickUpPromotion_()
      if (promotion === null) {
        return
      }
      targetElement.insertAdjacentElement(
        "afterend",
        this.makePromotionElement_(promotion)
      )
    }
  }

  setPromotions(records: promotone.types.SavedPromotionFields[]) {
    this.promotions = records.map((record) => {
      const promotion: Promotion = {
        content: record.content.value,
        sender: record.作成者.value,
      }
      return promotion
    })
  }

  makePromotionElement_(promotion: Promotion): HTMLElement {
    const el = document.createElement("div")
    el.innerHTML = promotion.content
    return el
  }

  pickUpPromotion_(): Promotion | null {
    if (this.promotions.length <= 0) {
      return null
    }
    return this.promotions[Math.floor(Math.random() * this.promotions.length)]
  }
}

export type Promotion = {
  content: string
  sender: {
    code: string
    name: string
  }
  startDatetime?: Date
  endDatetime?: Date
}
