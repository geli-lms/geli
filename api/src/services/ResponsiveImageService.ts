import sharp = require('sharp');
import config from '../config/main';
import * as fs from 'fs';
import * as path from 'path';

import {BreakpointSize} from '../models/BreakpointSize';
import {IResponsiveImageData} from '../../../shared/models/IResponsiveImageData';

export default class ResponsiveImageService {
  /**
   * Takes an image and generates responsive images in the sizes we want to.
   *
   * The images will be saved in the same directory as the original file and we will
   * append the screen-size for which the responsive image is generated.
   *
   * The original file will be removed if we haven't specified an "original" breakpoint.
   *
   * @param originalFile
   * @param {IResponsiveImageData} responsiveImage
   * @returns {Promise<boolean>}
   */
  static async generateResponsiveImages(originalFile: any, responsiveImage: IResponsiveImageData) {
    if (!responsiveImage.breakpoints) {
      // Cannot generate any responsive images, because there are no breakpoints provided.
      return false;
    }

    const filename = originalFile.filename;
    const directory = originalFile.destination;
    const extension = filename.split('.').pop();
    const filenameWithoutExtension = filename.substring(0, filename.length - extension.length - 1);

    let keepOriginalFile = false;

    for (const breakpoint of responsiveImage.breakpoints) {
      if (breakpoint.screenSize === BreakpointSize.ORIGINAL) {
        keepOriginalFile = false;
        continue;
      }

      const fileNameToSave = filenameWithoutExtension + '_' + breakpoint.screenSize + '.' + extension;

      sharp.cache(false);

      const retinaFileNameToSave = filenameWithoutExtension + '_' + breakpoint.screenSize + '@2x.' + extension;


      let resizeOptions = sharp(originalFile.path)
        .withoutEnlargement(true);
      let retinaResizeOptions = sharp(originalFile.path)
        .withoutEnlargement(true);

      if (breakpoint.imageSize.width && breakpoint.imageSize.height) {
        resizeOptions =
          resizeOptions.resize(breakpoint.imageSize.width, breakpoint.imageSize.height)
          .crop(sharp.gravity.center);

        retinaResizeOptions =
          retinaResizeOptions.resize(breakpoint.imageSize.width * 2, breakpoint.imageSize.height * 2)
          .crop(sharp.gravity.center);

      } else if (!breakpoint.imageSize.width && breakpoint.imageSize.height) {
        resizeOptions = resizeOptions.resize(null, breakpoint.imageSize.height)
          .max();

        retinaResizeOptions = retinaResizeOptions.resize(null, breakpoint.imageSize.height * 2)
          .max();
      } else {
        resizeOptions = resizeOptions.resize(breakpoint.imageSize.width)
          .max();

        retinaResizeOptions = retinaResizeOptions.resize(breakpoint.imageSize.width * 2)
          .max();
      }

      await resizeOptions
        .toFile(path.join(directory, fileNameToSave));

      await retinaResizeOptions
        .toFile(path.join(directory, retinaFileNameToSave));


      const directoryRelative = path.relative(path.dirname(config.uploadFolder), directory).replace(/\\\\?/g, '/');
      breakpoint.pathToImage = path.join(directoryRelative, fileNameToSave);
      breakpoint.pathToRetinaImage = path.join(directoryRelative, retinaFileNameToSave);
    }

    if (!keepOriginalFile) {
      fs.unlinkSync(originalFile.path);
      responsiveImage.pathToImage = '-';
    }
  }

}
