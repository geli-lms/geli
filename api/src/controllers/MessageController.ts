import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  BadRequestError,
  Body,
  Get,
  JsonController,
  Post, QueryParam,
  UseBefore
} from 'routing-controllers';
import {IMessage} from '../../../shared/models/IMessage';
import {Message} from '../models/Message';


@JsonController('/message')
@UseBefore(passportJwtMiddleware)
export default class MessageController {

  @Post('/')
  async post(@Body({required: true}) message: IMessage) {
    const newMessage = new Message(message);
    try {
      const createdMessage = await newMessage.save();
      return createdMessage;
    } catch (err) {
      throw new BadRequestError(err);
    }
  }


  @Get('/')
  async get(@QueryParam("room") room: string) {
    if(!room){
      throw new BadRequestError()
    }
    return await Message.find({room: 'room'});
  }
}
