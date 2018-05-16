import sharp = require("sharp");
import * as fs from "fs";
import {IResponsiveImage} from "../../../shared/models/IResponsiveImage";
import {BreakpointSize} from "../models/BreakpointSize";

export default class ResponsiveImageService {
  /**
   * Takes an image and generates responsive images in the sizes we want to.
   *
   * The images will be saved in the same directory as the original file and we will
   * append the screen-size for which the responsive image is generated.
   *
   * The original file will be removed if we haven't specified an "original" breakpoint.
   *
   * e.g.
   *
   * @param originalFile
   * @param {IResponsiveImage} responsiveImage
   * @returns {Promise<boolean>}
   */
  static async generateResponsiveImages(originalFile: any, responsiveImage: IResponsiveImage) {
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

      let resizeOptions = sharp(originalFile.path);
      if (breakpoint.imageSize.width && breakpoint.imageSize.height) {
        resizeOptions = resizeOptions.resize(breakpoint.imageSize.width, breakpoint.imageSize.height);
      }
      resizeOptions = resizeOptions.resize(breakpoint.imageSize.width);

      await resizeOptions
        .resize(breakpoint.imageSize.width,)
        .withoutEnlargement(true)
        .max()
        .toFile(directory + '/' + fileNameToSave);
    }

    if (!keepOriginalFile) {
      fs.unlinkSync(originalFile.path);
    }
  }

}
