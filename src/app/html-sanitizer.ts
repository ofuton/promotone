import sanitizeHtml from "sanitize-html"

export const sanitizeHTML = (text: string): string => {
  return sanitizeHtml(text, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "font",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "span",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      div: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      h5: ["style"],
      h6: ["style"],
      font: ["color", "style", "size"],
      span: ["style"],
    },
  })
}
