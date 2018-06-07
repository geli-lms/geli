import { IImageSize } from './IImageSize';
import {BreakpointSize} from '../../api/src/models/BreakpointSize';

export interface IBreakpoint {
  screenSize: BreakpointSize;
  imageSize: IImageSize;

  /**
   * Either the url (on the client side)
   * or the relative/absolute path to the image (on the server side)
   */
  pathToImage: string;
  pathToRetinaImage?: string;
}
