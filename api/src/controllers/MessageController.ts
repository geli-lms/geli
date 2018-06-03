import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  BadRequestError,
  Body,
  Get,
  JsonController, NotFoundError, Param,
  Post, QueryParam,
  UseBefore
} from 'routing-controllers';
import {IMessageModel, Message} from '../models/Message';
import {IMessage} from '../../../shared/models/Messaging/IMessage';

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
  async get(@QueryParam('room') room: string, @QueryParam('skip') skip: number= 0, @QueryParam('limit') limit: number,@QueryParam('order') order: number = -1) {
    if (!room) {
      throw new BadRequestError();
    }

    const messages: IMessageModel[] = await Message.find({room: room}).sort({createdAt: order}).skip(skip).limit(limit);

    return messages.map((message: IMessageModel) => {
      message = message.toObject();
      return message;
    });
  }

  /**
   * return number of messages in a given room
   */
  @Get('/count')
  async getCount (@QueryParam('room') room: string) {
    if (!room) {
      throw new BadRequestError();
    }
    const count = await Message.count({room: room});

    return {count: count};
  }

  @Post('/:id([a-fA-F0-9]{24})/comments')
  async addComment(@Body() comment: IMessage, @Param('id') id: string){
     let message = await Message.findById(id);
     if(!message) {
       throw new NotFoundError('message not found');
     }

     message.comments.push(comment);
     return message.save();
  }

}
