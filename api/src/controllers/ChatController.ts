import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  BadRequestError,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  UseBefore
} from 'routing-controllers';
import {Chat, IChatModel} from '../models/Chat';
import {IMessage} from '../../../shared/models/IMessage';
import {Message} from '../models/Message';
import {IChat} from '../../../shared/models/IChat';


@JsonController('/chat')
@UseBefore(passportJwtMiddleware)
export default class ChatController {

  /**
   * create new Chat
   */
  @Post('/')
  async postChat(@Body({required: true}) chat: IChat) {
    const newChat = new Chat(chat);
    try {
      const createdChat = await newChat.save();
      return createdChat;
    } catch (err) {
      throw new BadRequestError(err);
    }
  }


  @Get('/:id')
  async getMessages(@Param('id') id: string) {
    const chat: IChatModel = await Chat.findById(id);
    if (!chat) {
      throw new NotFoundError(`Chat not Found`);
    }

    const populateParam: any = {
      path: ' author',
      options: {sort: {'created_at': -1}}
    };

    populateParam.select = chat.anonymous ? 'created_at' : 'created_at profile';
    const forumWithMessages: IChatModel = await chat.populate(populateParam).execPopulate();
    return forumWithMessages;
  }

  /**
   * add new Message
   * @param {string} id
   */
  @Post('/:id/message')
  async postMessage(@Param('id') id: string, @Body({required: true}) message: IMessage) {
    const chat: IChatModel = await Chat.findById(id);

    if (!chat) {
      throw new NotFoundError(`Forum not Found`);
    }
    const newMessage = new Message(message);
    try {
      newMessage.save();
    } catch (err) {
      throw new BadRequestError(err);
    }
  }
}
