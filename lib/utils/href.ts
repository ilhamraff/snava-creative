export function resolveSiteHref(href: string) {
  const normalizedHref = href.trim()

  if (normalizedHref.startsWith('#') && normalizedHref.length > 1) {
    return `/${normalizedHref}`
  }

  return normalizedHref || '/'
}

export function isExternalHref(href: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)
}
