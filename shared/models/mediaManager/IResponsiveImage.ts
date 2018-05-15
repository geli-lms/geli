enum BreakpointSize {
  MOBILE = 480, // <= 480
  TABLET = 768, // 481 <=> 768
  DESKTOP = 1024, // 769 <=> 1024
  DESKTOP_XL = 1920, // 1025 <= 1920
  ORIGINAL = 0
}

interface IImageSize {
  width: number;
  height: number;
}

interface IBreakpoint {
  screenSize: BreakpointSize;
  imageSize: IImageSize;
}

/**
 * A really simple shared interface for responsive images.
 *
 * The idea is that client and server can exchange the required image sizes for a subset of screen sizes.
 * The server should always try to take the smallest image possible.
 *
 * i.E. if we only specified a breakpoint for mobile and no other, the server will return the image
 * with the size of the mobile breakpoint.
 */
interface IResponsiveImage {
  breakpoints: IBreakpoint[];
}


export { BreakpointSize, IImageSize, IBreakpoint, IResponsiveImage };
