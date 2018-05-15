import {
  BreakpointSize, IBreakpoint, IImageSize,
  IResponsiveImage
} from "../../../../../shared/models/mediaManager/IResponsiveImage";

class Breakpoint implements IBreakpoint {
  screenSize: BreakpointSize;
  imageSize: IImageSize;

  constructor(screenSize: BreakpointSize, imageSize: IImageSize) {
    this.screenSize = screenSize;
    this.imageSize = imageSize;
  }
}


export default class ResponsiveImage implements IResponsiveImage {
  breakpoints: IBreakpoint[];

  constructor() {
    this.breakpoints = [ ];
  }

  breakpoint(screenSize: BreakpointSize, imageSize: IImageSize) {
    this.breakpoints.push(new Breakpoint(screenSize, imageSize));
    return this;
  }

  static create() {
    return new ResponsiveImage();
  }
}
