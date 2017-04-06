import { Component, OnInit } from '@angular/core';
import { App_chatRoomApi } from '../../abp-http/ut-api-js-services/api/App_chatRoomApi';
import { ChatRoomDto } from '../../abp-http/ut-api-js-services/model/ChatRoomDto';
import { ChatRoomMessageDto } from '../../abp-http/ut-api-js-services/model/ChatRoomMessageDto';
import { App_chatRoomMessageApi } from '../../abp-http/ut-api-js-services/api/App_chatRoomMessageApi';
import { CreateTextChatRoomMessageInput } from '../../abp-http/ut-api-js-services/model/CreateTextChatRoomMessageInput';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { LocalStorageService } from 'angular-2-local-storage';

interface ChatRoom extends ChatRoomDto {
  messages: Array<ChatRoomMessageDto>;
  participantDictionary: object;
}

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  public chatRooms: Array<ChatRoom>;
  public selectedChatRoom: ChatRoom;
  public createTextChatRoomMessageInput: CreateTextChatRoomMessageInput = {
    text: ''
  };
  public myUser: UserDto = null;

  private lastChatMessageId: number;

  constructor(private localStorageService: LocalStorageService,
              private chatRoomApi: App_chatRoomApi,
              private chatRoomMessageApi: App_chatRoomMessageApi) {
    this.myUser = this.localStorageService.get('myUser');
  }

  ngOnInit() {
    this.chatRoomApi
      .appChatRoomGetMyChatRooms({})
      .subscribe((output) => {
        this.chatRooms = <Array<ChatRoom>> output.chatRooms;

        if (this.chatRooms.length > 0) {
          this.onClickChatRoom(this.chatRooms[0]);
        }
      });
  }

  public onClickChatRoom(chatRoom: ChatRoom) {
    this.chatRoomMessageApi
      .appChatRoomMessageGetChatRoomMessages({
        chatRoomId: chatRoom.id,
        startId: 0
      })
      .subscribe((output) => {
        chatRoom.messages = output.chatRoomMessages;

        chatRoom.participantDictionary = {};
        for (let i = 0; i < chatRoom.participants.length; i++) {
          const participant = chatRoom.participants[i];
          chatRoom.participantDictionary[participant.id] = participant;
        }

        this.selectedChatRoom = chatRoom;
        console.log(this.selectedChatRoom);
        this.lastChatMessageId = output.chatRoomMessages[output.chatRoomMessages.length - 1].id;
      });
  }

  public onClickSendMessage() {
    this.createTextChatRoomMessageInput.chatRoomId = this.selectedChatRoom.id;

    this.chatRoomMessageApi
      .appChatRoomMessageCreateTextChatRoomMessage(this.createTextChatRoomMessageInput)
      .subscribe(() => {

        this.createTextChatRoomMessageInput.text = '';

        this.chatRoomMessageApi
          .appChatRoomMessageGetChatRoomMessages({
            chatRoomId: this.selectedChatRoom.id,
            startId: this.lastChatMessageId
          })
          .subscribe((output) => {
            for (let i = 0; i < output.chatRoomMessages.length; i++) {
              this.selectedChatRoom.messages.push(output.chatRoomMessages[i]);
            }
          });
      });
  }

}
