import sut from "../app/promotion-helper"

test("sanitizeHtml_", () => {
  expect(sut.sanitizeHtml_("<img src='https://example.com'></img>")).toBe(
    "<img src='https://example.com'></img>"
  )
})
