(() => {
  const root = document.documentElement
  const read = (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }
  const matches = (query) => typeof window.matchMedia === 'function' && window.matchMedia(query).matches
  const appearanceValue = read('political-judgment-appearance-v1') || read('political-judgment-theme-v1')
  const appearance = ['system', 'light', 'dark'].includes(appearanceValue) ? appearanceValue : 'system'
  const densityValue = read('political-judgment-density-v1')
  const density = ['automatic', 'compact', 'comfortable'].includes(densityValue) ? densityValue : 'automatic'
  const contrastValue = read('political-judgment-contrast-v1')
  const contrast = ['automatic', 'standard', 'more'].includes(contrastValue) ? contrastValue : 'automatic'
  const theme = appearance === 'system' ? matches('(prefers-color-scheme: dark)') ? 'dark' : 'light' : appearance
  const automaticComfortable = window.innerWidth < 720
    || (!(matches('(any-pointer: fine)') || matches('(any-hover: hover)'))
      && (matches('(pointer: coarse)') || matches('(hover: none)')))
  const resolvedDensity = density === 'automatic' ? automaticComfortable ? 'comfortable' : 'compact' : density
  const resolvedContrast = contrast === 'automatic'
    ? matches('(prefers-contrast: more)') ? 'more' : 'standard'
    : contrast

  root.dataset.appearance = appearance
  root.dataset.theme = theme
  root.dataset.densityPreference = density
  root.dataset.density = resolvedDensity
  root.dataset.contrastPreference = contrast
  root.dataset.contrast = resolvedContrast
  window.__ECW_PREPAINT__ = {
    appearance,
    theme,
    density,
    resolvedDensity,
    contrast,
    resolvedContrast,
    appliedAt: typeof performance === 'undefined' ? 0 : performance.now(),
  }
})()
