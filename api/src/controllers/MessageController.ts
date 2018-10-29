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
import {IMessage} from '../../../shared/models/messaging/IMessage';

@JsonController('/message')
@UseBefore(passportJwtMiddleware)
export default class MessageController {

  /**
   * @api {post} /api/message create new message
   * @apiName PostMessage
   * @apiGroup Message
   *
   *
   * @apiSuccess {IMessage} created Message.
   *
   */
  @Post('/')
  async postMessage(@Body({required: true}) message: IMessage) {
    const newMessage = new Message(message);
    try {
      const createdMessage = await newMessage.save();
      return createdMessage;
    } catch (err) {
      throw new BadRequestError(err);
    }
  }


  /**
   * @api {get} /api/message get all messages in a given room
   * @apiName getMessage
   * @apiGroup Message
   *
   * @apiParam {string} room: the room to which the messages belong.
   * @apiParam {number} skip: number of messages to skip. default to 0.
   * @apiParam {number} limit: number of messages to return.
   * @apiParam {number} order: the order in which the messages are ordered. possible values: 1(ascending) or -1(descending). default to -1.
   *
   * @apiSuccess {IMessage[]} messages in the given room.
   * @apiSuccessExample {json} Success-Response:
   *     [
   *      {
   *        author: "5b2d66c84daf0700d5afe7bf",
   *        chatName: "student2",
   *        comments: [],
   *        content: "any message",
   *        createdAt: "2018-06-22T21:14:50.924Z",
   *        room : "5b2d66c84daf0700d5afe7d8",
   *        updatedAt: "2018-06-22T21:14:50.924Z",
   *        __v: 0,
   *        _id: "5b2d66ca4daf0700d5aff89c"
   *      }
   *     ]
   *
   */
  @Get('/')
  async getMessages (
    @QueryParam('room') room: string, @QueryParam('skip') skip: number= 0,
    @QueryParam('limit') limit: number, @QueryParam('order') order: number = -1) {
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
   * @api {get} /api/count get number of messages in a given room
   * @apiName getMessage
   * @apiGroup Message
   *
   * @apiParam {string} room: the room to which the messages belong.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *        "count": "45"
   *
   *     }
   *
   */
  @Get('/count')
  async getMessageCount (@QueryParam('room') room: string) {
    if (!room) {
      throw new BadRequestError();
    }
    const count = await Message.countDocuments({room: room});

    return {count: count};
  }


  /**
   * @api {post} /api/message/id/comments  add a comment to a given message.
   * @apiName PostMessage
   * @apiGroup Message
   *
   * @apiParam {string} id: id of the message.
   *
   * @apiSuccess {IMessage} updated Message.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *        author: "5b2d66c84daf0700d5afe7bf",
   *        chatName: "student2",
   *        comments: [],
   *        content: "any message",
   *        createdAt: "2018-06-22T21:14:50.924Z",
   *        room : "5b2d66c84daf0700d5afe7d8",
   *        updatedAt: "2018-06-22T21:14:50.924Z",
   *        __v: 0,
   *        _id: "5b2d66ca4daf0700d5aff89c"
   *     }
   */
  @Post('/:id([a-fA-F0-9]{24})/comments')
  async addComment (@Body() comment: IMessage, @Param('id') id: string) {
     const  message = await Message.findById(id);
     if (!message) {
       throw new NotFoundError('message not found');
     }

     message.comments.push(comment);
     return message.save();
  }

}
