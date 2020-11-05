import { sanitizeHTML } from "../app/html-sanitizer"

test("sanitizeHTML", () => {
  expect(sanitizeHTML('<img src="https://example.com"></img>')).toBe(
    '<img src="https://example.com" />'
  )
  expect(
    sanitizeHTML(
      '<div style="text-align: center; background-color: black"></div>'
    )
  ).toBe('<div style="text-align:center;background-color:black"></div>')

  expect(
    sanitizeHTML(
      '<font style="font-size: large"><font color="#ff9900">熱い</font></font>'
    )
  ).toBe(
    '<font style="font-size:large"><font color="#ff9900">熱い</font></font>'
  )

  expect(
    sanitizeHTML(
      '<h2 class="user-token-slender-heading user-token-red-dash user-token-ghont-font-title" style="font-size:24px;font-weight:700;margin:0px auto;font-family:&#39;ghosttitlefont&#39; , &#39;georgia&#39; , &#39;roboto&#39; , &#39;times&#39;;line-height:1.25em;text-transform:uppercase;letter-spacing:3px;text-align:center;padding-top:0px;max-width:1000px;color:rgb( 193 , 185 , 160 );background-color:rgb( 0 , 0 , 0 )">武士の道から外れ、邪道に落ちた兵</h2>'
    )
  ).toBe(
    "<h2 style=\"font-size:24px;font-weight:700;margin:0px auto;font-family:'ghosttitlefont' , 'georgia' , 'roboto' , 'times';line-height:1.25em;text-transform:uppercase;letter-spacing:3px;text-align:center;padding-top:0px;max-width:1000px;color:rgb( 193 , 185 , 160 );background-color:rgb( 0 , 0 , 0 )\">武士の道から外れ、邪道に落ちた兵</h2>"
  )

  expect(
    sanitizeHTML('<span style="font-weight: 700">GHOST OF TSUSHIMA</span>')
  ).toBe('<span style="font-weight:700">GHOST OF TSUSHIMA</span>')
})
