import {IResponsiveImageData} from '../IResponsiveImageData';
import {IBreakpoint} from '../IBreakpoint';
import {IFile} from './IFile';

export interface IPicture extends IFile {
  mimeType: string;

  breakpoints?: IBreakpoint[];
}
