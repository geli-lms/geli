import {IResponsiveImageData} from "../IResponsiveImageData";
import {IBreakpoint} from "../IBreakpoint";

export interface IPicture {
  mimeType: string;

  breakpoints?: IBreakpoint[];
}
