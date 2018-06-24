import {
  UseBefore, Controller,
  Get, Param, Res,
  ForbiddenError, NotFoundError
} from 'routing-controllers';
import {Response} from 'express';
import {promisify} from 'util';
import passportJwtMiddlewareMedia from '../security/passportJwtMiddlewareMedia';
import config from '../config/main';
import {errorCodes} from '../config/errorCodes';
import * as fs from 'fs';
import * as path from 'path';

// Note that this isn't meant for uploading files, but for downloads from the '/api/uploads' route.
// That route was previously handled by an unsecured (public) static route in server.ts.
// TODO: Perhaps this functionality could be merged with another controller?
@Controller('/uploads')
@UseBefore(passportJwtMiddlewareMedia)
export class UploadsController {

  /**
   * @api {get} /api/uploads/:filename Request a file in the config.uploadFolder.
   * @apiName GetUploadsFile
   * @apiGroup Uploads
   *
   * @apiParam {String} filename The file path of the requested file in the config.uploadFolder.
   * @apiParam {Response} response Response.
   *
   * @apiSuccess {Response} response File download.
   *
   * @apiError NotFoundError File could not be found.
   * @apiError ForbiddenError Invalid filename (e.g. '..').
   */
  @Get('/:filename')
  async getUploadsFile(@Param('filename') filename: string, @Res() response: Response) {
    return this.download(config.uploadFolder, filename, response);
  }

  /**
   * @api {get} /api/uploads/users/:filename Request a file in the user-uploads directory, such as profile pictures.
   * @apiName GetUploadsUserFile
   * @apiGroup Uploads
   *
   * @apiParam {String} filename The file path of the requested file in the user-uploads directory.
   * @apiParam {Response} response Response.
   *
   * @apiSuccess {Response} response File download.
   *
   * @apiError NotFoundError File could not be found.
   * @apiError ForbiddenError Invalid filename (e.g. '..').
   */
  @Get('/users/:filename')
  async getUploadsUserFile(@Param('filename') filename: string, @Res() response: Response) {
    const prePath = path.join(config.uploadFolder, 'users');
    return this.download(prePath, filename, response);
  }

  /**
   * Request a file download.
   *
   * @param prePath Directory path that is prepended to the fileSubPath.
   * @param fileSubPath File sub-path requested by - presumably - a user. Could just be a filename.
   * @param response Response object that is to be modified for the actual file download.
   */
  async download(prePath: string, fileSubPath: string, response: Response) {
    fileSubPath = path.normalize(fileSubPath);
    const filePath = path.join(prePath, fileSubPath);

    // Assure that the filePath actually points to a file within prePath.
    if (fileSubPath !== path.relative(prePath, filePath)) {
      throw new ForbiddenError(errorCodes.file.forbiddenPath.code);
    }

    // Assure that the file that filePath points to exists.
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError(errorCodes.file.fileNotFound.code);
    }

    // The filePath seems to be valid by this point, so prepare and return the response.
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    await promisify<string, void>(response.download.bind(response))(filePath);
    return response;
  }

}
