import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {
  BadRequestError,
  Body,
  Get,
  JsonController, NotFoundError, Param,
  Post, QueryParam,
  UseBefore
} from 'routing-controllers';
import {ChatRoom} from '../models/ChatRoom';

@JsonController('/chatRoom')
@UseBefore(passportJwtMiddleware)
export default class ChatRoomController {


  @Get('/:id([a-fA-F0-9]{24})')
  async get(@QueryParam('id') id: string) {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      throw new NotFoundError('chat room not found');
    }
    return chatRoom;
  }
}
