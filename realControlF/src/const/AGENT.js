export const isAndroid = (/Android/i.test(navigator.userAgent))

export const isiOS = (/iPhone|iPad|iPod/i.test(navigator.userAgent))

export const isMobile = isAndroid || isiOS
