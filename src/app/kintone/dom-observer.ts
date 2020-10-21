export default class DomObserver {
  postsObserver: MutationObserver | null = null

  /**
   * spacelayout-body にDOM追加が行われたときに spacecontent-body の変更を監視する
   * スレッド間の移動をしたときに変更が行われる
   */
  spaceLayoutObserver_ = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      if (this.isAddedNodes_(mutations[i])) {
        const spaceContent = document.querySelector(
          ".gaia-argoui-space-spacecontent-body"
        )
        if (!spaceContent) {
          return
        }
        this.spaceLayoutObserver_.disconnect()
        this.spaceContentInnerObserver_.observe(
          document.querySelector(".gaia-argoui-space-spacecontent-body")!,
          {
            childList: true,
            subtree: true,
          }
        )
        this.spaceContentObserver_.observe(
          document.querySelector(".gaia-argoui-space-spacecontent-body")!,
          {
            childList: true,
          }
        )
      }
    }
  })

  /**
   * 最初の読み込みではspacecontent-bodyが読み込まれたときにspacecontent-body > divの監視を始める
   * コメントコンポーネントの読み込み検知は{@link DomObserver#spaceContentInnerObserver}で行う
   */
  spaceContentObserver_ = new MutationObserver((mutations) => {
    const spaceContent = document.querySelector(
      ".gaia-argoui-space-spacecontent-body"
    )
    if (!spaceContent) {
      return
    }
    this.spaceContentInnerObserver_.observe(spaceContent, {
      childList: true,
      subtree: true,
    })
  })

  commentComponentObserver_ = new MutationObserver((mutations) => {
    const addedPosts: Node[] = []
    mutations.forEach((mutation) => {
      if (this.isAddedNodes_(mutation)) {
        addedPosts.push(
          ...Array.from(mutation.addedNodes).filter((node) => {
            const element = node as Element
            return element.classList.contains("ocean-ui-comments-post")
          })
        )
      }
    })
    if (addedPosts.length <= 0) {
      return
    }
    const commentComponentEl = document.querySelector(
      ".ocean-ui-comments-commentcomponent"
    )!
    const detail: CommentComponentChangedDetail = {
      addedElements: addedPosts as HTMLElement[],
      element: commentComponentEl as HTMLElement,
    }
    this.dispatchEvent_(EventType.COMMENT_COMPONENT_CHANGED, detail)
  })

  /**
   * コメントコンポーネントが読み込まれたときにイベントを投げる
   */
  spaceContentInnerObserver_ = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      if (this.isAddedNodes_(mutations[i])) {
        const commentComponentEl = document.querySelector(
          ".ocean-ui-comments-commentcomponent"
        )
        if (!commentComponentEl) {
          continue
        }

        this.dispatchEvent_(EventType.COMMENT_COMPONENT_LOADED, {
          element: commentComponentEl,
        })

        this.commentComponentObserver_.observe(commentComponentEl, {
          childList: true,
        })
        // subtreeまで監視し続けると負荷がヤバそうなのでcommentcomponentが見つかったらdisconnectする
        this.spaceContentInnerObserver_.disconnect()
        break
      }
    }
  })

  /**
   * スレッド画面の中身(#contents-ocean-body)が描画されることを監視する
   * 以下のタイミングでイベントを返す
   * コメントコンポーネントを読み込み終わったとき: `PROMOTONE:COMMENTCOMPONENT_LOADED`
   */
  startPostsObserver() {
    /** 以下の順で描画される
     * 1. #contents-body-ocean
     * 2. .gaia-argoui-space-spacelayout-body
     * 3. .gaia-argoui-space-spacecontent-body + div
     * 4. .ocean-ui-comments-commentcomponent
     */
    // 既にobserveしているときは何もしない
    if (this.postsObserver) {
      console.log("already started")
      return
    }
    const bodyOceanEl = document.querySelector("#contents-body-ocean")
    if (!bodyOceanEl) {
      return
    }
    this.postsObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          const spaceLayoutEl = document.querySelector(
            ".gaia-argoui-space-spacelayout-body"
          )
          if (spaceLayoutEl) {
            this.spaceLayoutObserver_.observe(spaceLayoutEl, {
              childList: true,
              subtree: true,
            })
          }
        }
        // TODO: 通知欄の対応が必要
        // 1. document.querySelector(".gaia-argoui-ntf-twopane-contents div")
        // 2. 通常の描画フローの2.からになる
      })
    })
    this.postsObserver.observe(bodyOceanEl, {
      childList: true,
    })
  }

  private dispatchEvent_(
    eventType: EventType,
    detail: { [key: string]: Object }
  ) {
    document.dispatchEvent(
      new CustomEvent(eventType, {
        detail,
      })
    )
  }

  private isAddedNodes_(node: MutationRecord): boolean {
    return node.addedNodes && node.addedNodes.length > 0
  }
}

export enum EventType {
  COMMENT_COMPONENT_LOADED = "PROMOTONE:COMMENT_COMPONENT_LOADED",
  COMMENT_COMPONENT_CHANGED = "PROMOTONE:COMMENT_COMPONENT_CHANGED",
}

export type CommentComponentChangedDetail = {
  element: HTMLElement
  addedElements: HTMLElement[]
}

export type CommentComponentLoadedDetail = {
  element: HTMLElement
}
