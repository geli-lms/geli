import { IImageSize } from './IImageSize';
import {BreakpointSize} from "../../api/src/models/BreakpointSize";

export interface IBreakpoint {
  screenSize: BreakpointSize;
  imageSize: IImageSize;
}
