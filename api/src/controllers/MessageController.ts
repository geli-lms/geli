import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  BadRequestError,
  Body,
  Get,
  JsonController, NotFoundError,
  Post, QueryParam,
  UseBefore
} from 'routing-controllers';
import {IMessage} from '../../../shared/models/IMessage';
import {IMessageModel, Message} from '../models/Message';
import {Course} from '../models/Course';


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
  async get(@QueryParam('room') room: string) {
    if (!room) {
      throw new BadRequestError();
    }

    const course = await Course.findById(room);

    if (!course) {
      throw new NotFoundError('Course not Found.');
    }

    const messages: IMessageModel[] = await Message.find({room: room}).populate({path: 'author', select: 'profile'});

    return messages.map((message: IMessageModel) => {
      message = message.toObject();
      if (message.chatName) {
        delete  message.author.profile
      }
      return message
    });
  }
}
