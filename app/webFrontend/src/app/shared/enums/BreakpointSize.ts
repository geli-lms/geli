/**
 * Note: If you modify this enum, please modify the corresponding enum
 * in the backend.
 *
 * api/src/models/BreakpointSize.ts
 */
export enum BreakpointSize {
  MOBILE = 0, // screen larger than 0 px
  TABLET = 768, // screen larger than 768px
  DESKTOP = 1024, // screen larger than 1024px
  DESKTOP_XL = 1920, // screen larger han 1920px
  ORIGINAL = -1
}
