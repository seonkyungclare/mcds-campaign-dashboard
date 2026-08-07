/**
 * MCDS (MUSINSA Design System) Design Tokens
 * Figma: MCDS (lAbzqUQAovN15n5n6g6Zxl)
 */

export const color = {
  // Foreground
  fgDefault: '#1a1a1a',
  fgLow: '#666666', // semantic/fg-low
  fgSubtle: '#666666', // alias of fgLow (kept for existing usages)
  fgLower: '#808080', // semantic/fg-lower
  fgDisabled: '#b3b3b3',
  fgOnAccent: '#ffffff',

  // Fill
  fillLight: '#ffffff',
  fillLightLow: '#fafafa', // semantic/fill-light-low
  fillLightLower: '#f2f2f2', // semantic/fill-light-lower
  fillLightLowerHovered: '#e6e6e6', // semantic/fill-light-lower-hovered
  fillLightHovered: '#f2f2f2', // semantic/fill-light-hovered
  fillLightPressed: '#e6e6e6', // semantic/fill-light-pressed
  fillSubtle: '#f7f7f7',
  fillDisabled: '#f2f2f2',

  // Accent
  fillAccent: '#2b52f0',
  fillAccentHovered: '#1a40d9',
  fillAccentPressed: '#1e34b3',
  fillAccentDisabled: '#bacbff',
  fgAccent: '#2b52f0',
  fgAccentHovered: '#1a40d9',
  fgAccentPressed: '#1e34b3',
  fillAccentLightLow: '#edf3ff', // semantic/fill-accent-light-low
  fillAccentLightHovered: '#dbe6ff', // semantic/fill-accent-light-hovered
  fillAccentLightPressed: '#bacbff', // semantic/fill-accent-light-pressed
  borderAccent: '#2b52f0',
  borderAccentHovered: '#1a40d9',
  borderAccentPressed: '#1e34b3',
  borderAccentLight: '#bacbff', // semantic/border-accent-light

  // Switch container (OFF)
  fillSwitchContainer: '#cccccc',
  fillSwitchContainerHovered: '#b3b3b3',
  fillSwitchContainerPressed: '#999999',
  fillSwitchContainerDisabled: '#d9d9d9',

  // Border
  borderDefault: '#d9d9d9', // semantic/border-light-lower
  borderLightLower: '#d9d9d9',
  borderLightLowerHovered: '#cccccc',
  borderLightLowerPressed: '#cccccc',
  borderStrong: '#999999',
  borderDisabled: '#e6e6e6',

  // Status — critical (Button "warning" type maps to critical)
  fgCritical: '#fc3f45', // semantic/fg-critical
  fgCriticalHovered: '#cc0414',
  fgCriticalPressed: '#ab1215',
  borderCritical: '#eb0517',
  borderCriticalHovered: '#cc0414',
  borderCriticalPressed: '#ab1215',
  fillCriticalLightHovered: '#ffe2df',
  fillCriticalLightPressed: '#ffc5c0',
  fillCriticalSubtle: '#fdecec',
  fgSuccess: '#00875a',
  fillSuccessSubtle: '#e8f5f0',
  fgWarning: '#b25e00',
  fillWarningSubtle: '#fff4e5',
} as const;

export const typography = {
  fontFamily:
    "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: { 12: '12px', 14: '14px', 16: '16px', 18: '18px', 20: '20px', 24: '24px' },
  lineHeight: { 16: '16px', 20: '20px', 24: '24px', 26: '26px', 28: '28px', 32: '32px' },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

/** 8px base grid */
export const spacing = {
  2: '2px',
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  24: '24px',
  32: '32px',
  40: '40px',
} as const;

export const radius = { sm: '4px', md: '8px', lg: '12px', full: '16px' } as const;

export const shadow = {
  switchHandle: '0px 2px 4px 0px rgba(0,0,0,0.12)',
  switchHandleDisabled: '0px 2px 4px 0px rgba(0,35,11,0.12)',
  card: '0px 1px 2px 0px rgba(0,0,0,0.06)',
  overlay: '0px 4px 16px 0px rgba(0,0,0,0.12)',
} as const;
