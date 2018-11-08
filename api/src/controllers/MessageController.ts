import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  BadRequestError,
  Get,
  JsonController,
  QueryParam,
  UseBefore,
  CurrentUser,
  NotFoundError,
  ForbiddenError
} from 'routing-controllers';
import {errorCodes} from '../config/errorCodes';
import {IMessageModel, Message} from '../models/Message';
import {IUser} from '../../../shared/models/IUser';
import {ChatRoom} from '../models/ChatRoom';

@JsonController('/message')
@UseBefore(passportJwtMiddleware)
export default class MessageController {

  private async assertUserViewAuthForRoomId(currentUser: IUser, roomId: string) {
    if (!roomId) {
      throw new BadRequestError();
    }
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      throw new NotFoundError(errorCodes.chat.roomNotFound.text);
    }
    if (!(await room.checkPrivileges(currentUser)).userCanViewMessages) {
      throw new ForbiddenError();
    }
  }

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
   * @apiError BadRequestError
   * @apiError NotFoundError
   * @apiError ForbiddenError
   */
  @Get('/')
  async getMessages (
    @QueryParam('room') roomId: string, @QueryParam('skip') skip: number= 0,
    @QueryParam('limit') limit: number, @QueryParam('order') order: number = -1,
    @CurrentUser() currentUser: IUser) {
    await this.assertUserViewAuthForRoomId(currentUser, roomId);
    const messages: IMessageModel[] = await Message.find({room: roomId}).sort({createdAt: order}).skip(skip).limit(limit);
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
   * @apiError BadRequestError
   * @apiError NotFoundError
   * @apiError ForbiddenError
   */
  @Get('/count')
  async getMessageCount (@QueryParam('room') roomId: string, @CurrentUser() currentUser: IUser) {
    await this.assertUserViewAuthForRoomId(currentUser, roomId);
    const count = await Message.countDocuments({room: roomId});
    return {count};
  }

}
