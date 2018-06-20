import {IBreakpoint} from '../../../../../shared/models/IBreakpoint';
import {IImageSize} from '../../../../../shared/models/IImageSize';
import {IResponsiveImageData} from '../../../../../shared/models/IResponsiveImageData';
import {BreakpointSize} from '../shared/enums/BreakpointSize';

class Breakpoint implements IBreakpoint {
  screenSize: BreakpointSize;
  imageSize: IImageSize;
  pathToImage: string;

  constructor(screenSize: BreakpointSize, imageSize: IImageSize, pathToImage) {
    this.screenSize = screenSize;
    this.imageSize = imageSize;
    this.pathToImage = pathToImage;
  }
}


export default class ResponsiveImage implements IResponsiveImageData {
  breakpoints: IBreakpoint[];
  pathToImage: string;


  /**
   * Creates a new responsive image with the specified path.
   *
   * If we have no path specified, it means that this is being created
   * to upload a new image and we don't know where it will saved, yet.
   *
   * @param {string} pathToImage
   *
   * @returns {ResponsiveImage}
   */
  static create(pathToImage: string = null) {
    return new ResponsiveImage(pathToImage);
  }

  constructor(pathToImage: string) {
    this.breakpoints = [ ];
    this.pathToImage = pathToImage;
  }

  private getBreakpointPath(screenSize: BreakpointSize) {
    const filename = this.pathToImage.split('/').pop();

    // Has a trailing slash
    const directoryURI = this.pathToImage.substring(0, this.pathToImage.length - filename.length);
    const extension = filename.split('.').pop();
    const filenameWithoutExtension = filename.substring(0, filename.length - extension.length - 1);

    return directoryURI + filename + '_' + screenSize + '.' + extension;
  }

  /**
   * Creates a breakpoint for this responsive image.
   * This method can be chained.
   *
   * The breakpoint is mobile first.
   *
   * E.g.
   *
   * ResponsiveImage.create(<path>)
 *                  .breakpoint(<breakpointSize>, { width: <width>, height: <height> })
 *                  .breakpoint(<breakpointSize>, { width: <width>, height: <height> })
   *
   * @param {BreakpointSize} screenSize The screen size for which this image breakpoint should be generated.
   * @param {IImageSize} imageSize      The size of the image for the specific breakpoint.
   *
   * @returns {ResponsiveImage}
   */
  breakpoint(screenSize: BreakpointSize, imageSize: IImageSize) {
    const breakpointPath = this.pathToImage ? this.getBreakpointPath(screenSize) : null;
    this.breakpoints.push(new Breakpoint(screenSize, imageSize, breakpointPath));
    return this;
  }
}
