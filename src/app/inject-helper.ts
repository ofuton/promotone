export const injectScript = () => {
  const resources = chrome.runtime.getManifest().web_accessible_resources
  const next = () => {
    if (!resources) {
      return
    }
    const resource = resources.shift()
    if (!resource) {
      return
    }
    if (resource.match(/\.js$/)) {
      const script = document.createElement("script")
      script.setAttribute("src", chrome.extension.getURL(resource))
      script.addEventListener("load", next)
      document.documentElement.appendChild(script)
    }
  }
  next()
}
