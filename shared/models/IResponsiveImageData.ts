import {IBreakpoint} from './IBreakpoint';

/**
 * A really simple shared interface for responsive images.
 *
 * The idea is that client and server can exchange the required image sizes for a subset of screen sizes.
 * The server should always try to take the smallest image possible.
 *
 * i.E. if we only specified a breakpoint for mobile and no other, the server will return the image
 * with the size of the mobile breakpoint.
 */
export interface IResponsiveImageData {
  breakpoints: IBreakpoint[];
  pathToImage: string;
}
