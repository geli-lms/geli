import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  BadRequestError,
  Get,
  JsonController,
  QueryParam,
  UseBefore
} from 'routing-controllers';
import {IMessageModel, Message} from '../models/Message';

@JsonController('/message')
@UseBefore(passportJwtMiddleware)
export default class MessageController {

  /**
   * @api {get} /api/message get all messages in a given room
   * @apiName getMessages
   * @apiGroup Message
   *
   * @apiParam {string} room: the room to which the messages belong.
   * @apiParam {number} skip: number of messages to skip. default to 0.
   * @apiParam {number} limit: number of messages to return.
   * @apiParam {number} order: the order in which the messages are ordered. possible values: 1(ascending) or -1(descending). default to -1.
   *
   * @apiSuccess {IMessageDisplay[]} messages in the given room.
   * @apiSuccessExample {json} Success-Response:
   *     [
   *      {
   *        chatName: "student2",
   *        comments: [],
   *        content: "any message",
   *        createdAt: "2018-06-22T21:14:50.924Z",
   *        updatedAt: "2018-06-22T21:14:50.924Z",
   *        room : "5b2d66c84daf0700d5afe7d8",
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

    return messages.map((message: IMessageModel) => message.forDisplay());
  }

  /**
   * @api {get} /api/message/count get number of messages in a given room
   * @apiName getMessageCount
   * @apiGroup Message
   *
   * @apiParam {string} room: the room to which the messages belong.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *        "count": "45"
   *     }
   *
   */
  @Get('/count')
  async getMessageCount (@QueryParam('room') room: string) {
    if (!room) {
      throw new BadRequestError();
    }
    const count = await Message.countDocuments({room});
    return {count};
  }

}
