import {BadRequestError, Body, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {CodeKataProgress} from '../models/CodeKataProgress';
import {JsonController} from 'routing-controllers';
import {ProgressController} from './ProgressController';
import {ICodeKataProgress} from '../../../shared/models/ICodeKataProgress';


@JsonController('/progress/code-katas')
@UseBefore(passportJwtMiddleware)
export class CodeKataProgressController {
  @Post('/')
  createProgress(@Body() data: any) {
    // discard invalid requests
    if (!data.course || !data.user || !data.unit) {
      throw new BadRequestError('progress need fields course, user and unit');
    }

    return new CodeKataProgress(data).save();
  }

  @Put('/:id')
  updateCodeKataUnit(@Param('id') id: string, @Body() unit: ICodeKataProgress) {
    return CodeKataProgress.findByIdAndUpdate(id, unit)
      .then(u => u.toObject());
  }
}
