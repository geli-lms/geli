import {IResponsiveImage} from "../../../shared/models/mediaManager/IResponsiveImage";

export default class ResponsiveImageService {


  async generateResponsiveImages(originalFile: File, responsiveImage: IResponsiveImage) {
    if (!responsiveImage.breakpoints) {
      // Cannot generate any responsive images, because there are no breakpoints provided.
      return false;
    }

    for (const breakpoint of responsiveImage.breakpoints) {



    }
  }

}
