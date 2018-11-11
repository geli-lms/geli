import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  Get,
  JsonController, NotFoundError,
  Param,
  UseBefore
} from 'routing-controllers';
import {errorCodes} from '../config/errorCodes';
import {ChatRoom} from '../models/ChatRoom';

@JsonController('/chatRoom')
@UseBefore(passportJwtMiddleware)
export default class ChatRoomController {

  /**
   * @api {get} /api/chatRoom get a chat room
   * @apiName getChatRoom
   * @apiGroup ChatRoom
   *
   * @apiParam {string} id: chatRoom ID.
   *
   * @apiSuccess {IChatRoom} a ChatRoom Object.
   *
   * @apiSuccessExample {json} Success-Response:
   *   {
   *         "_id": "5a037e6b60f72236d8e7c857",
   *         "updatedAt": "2017-11-08T22:00:11.693Z",
   *         "createdAt": "2017-11-08T22:00:11.693Z",
   *         "name": "ChatRoom Name",
   *         "description": "ChatRoom Description",
   *         "__v": 0,
   *  }
   *
   */
  @Get('/:id([a-fA-F0-9]{24})')
  async getChatRoom(@Param('id') id: string) {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      throw new NotFoundError(errorCodes.chat.roomNotFound.text);
    }
    return chatRoom.toObject();
  }
}
