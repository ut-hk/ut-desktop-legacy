import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { App_chatRoomApi } from '../../abp-http/ut-api-js-services/api/App_chatRoomApi';
import { ChatRoomDto } from '../../abp-http/ut-api-js-services/model/ChatRoomDto';
import { ChatRoomMessageDto } from '../../abp-http/ut-api-js-services/model/ChatRoomMessageDto';
import { App_chatRoomMessageApi } from '../../abp-http/ut-api-js-services/api/App_chatRoomMessageApi';
import { CreateTextChatRoomMessageInput } from '../../abp-http/ut-api-js-services/model/CreateTextChatRoomMessageInput';
import { UserDto } from '../../abp-http/ut-api-js-services/model/UserDto';
import { LocalStorageService } from 'ng2-webstorage';
import { App_relationshipApi } from '../../abp-http/ut-api-js-services/api/App_relationshipApi';
import { UserListDto } from '../../abp-http/ut-api-js-services/model/UserListDto';
import { UpdateChatRoomInput } from '../../abp-http/ut-api-js-services/model/UpdateChatRoomInput';
import { CreateChatRoomInput } from 'abp-http/ut-api-js-services';

interface ChatRoom extends ChatRoomDto {
  messages: Array<ChatRoomMessageDto>;
  participantDictionary: object;
}

interface ParticipantIdInput {
  user: UserListDto;
  isSelected: boolean;
}

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {


  public myUser: UserDto = null;
  public chatRooms: ChatRoom[];
  public selectedChatRoom: ChatRoom;
  public friends: UserListDto[] = null;
  public participantIdInputs: ParticipantIdInput[] = [];
  public updateChatRoomInput: UpdateChatRoomInput = {
    name: null,
    id: '',
    participantIds: []
  };
  public createTextChatRoomMessageInput: CreateTextChatRoomMessageInput = {
    text: ''
  };

  @ViewChild('chatMessagesContainer') private chatMessagesContainer: ElementRef;

  @ViewChild('inviteFriendsModal') public inviteFriendsModal;
  @ViewChild('createChatRoomModal') public createChatRoomModal;

  public createChatRoomInput: CreateChatRoomInput = {
    name: 'Chat Room Name'
  };

  private lastChatMessageId: number;

  constructor(private localStorageService: LocalStorageService,
              private relationshipApi: App_relationshipApi,
              private chatRoomApi: App_chatRoomApi,
              private chatRoomMessageApi: App_chatRoomMessageApi) {
    this.myUser = this.localStorageService.retrieve('myUser');
  }

  ngOnInit() {
    this.getMyChatRooms();
    this.getMyFriends();
  }

  private getMyChatRooms() {
    const getMyChatRoomsSubscription = this.chatRoomApi
      .appChatRoomGetMyChatRooms({})
      .subscribe((output) => {
        this.chatRooms = <ChatRoom[]> output.chatRooms;

        if (this.chatRooms.length > 0) {
          this.onClickChatRoom(this.chatRooms[0]);
          this.updateChatRoomInput.name = this.chatRooms[0].name;
        }

        getMyChatRoomsSubscription.unsubscribe();
      });
  }

  private getMyFriends() {
    const getFriendsSubscription = this.relationshipApi
      .appRelationshipGetFriends({
        targetUserId: this.myUser.id
      })
      .subscribe((output) => {
        this.friends = output.friends;
        for (let i = 0; i < this.friends.length; i++) {
          const friendInput: ParticipantIdInput = {user: this.friends[i], isSelected: false};

          this.participantIdInputs.push(friendInput);
        }

        getFriendsSubscription.unsubscribe();
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

        this.scrollChatRoomMessagesContainer();
      });
  }

  public onClickCreateChatRoom() {
    this.chatRoomApi
      .appChatRoomCreateChatRoomWithHttpInfo(this.createChatRoomInput)
      .subscribe((output) => {
        console.log(output);
      });

    this.createChatRoomModal.hide();
  }

  public onClickAddFriendToChatRoom() {
    this.updateChatRoomInput.id = this.selectedChatRoom.id;
    this.updateChatRoomInput.name = this.selectedChatRoom.name;

    for (let i = 0; i < this.participantIdInputs.length; i++) {
      if (this.participantIdInputs[i].isSelected == true) {
        this.updateChatRoomInput.participantIds.push(this.participantIdInputs[i].user.id);
      }
    }

    this.chatRoomApi
      .appChatRoomUpdateChatRoom(this.updateChatRoomInput)
      .subscribe((output) => {
        console.log(output);
      });

    this.inviteFriendsModal.hide();
  }

  public onClickSendMessage() {
    this.createTextChatRoomMessageInput.chatRoomId = this.selectedChatRoom.id;

    this.chatRoomMessageApi
      .appChatRoomMessageCreateTextChatRoomMessage(this.createTextChatRoomMessageInput)
      .flatMap((output) => {
        this.createTextChatRoomMessageInput.text = '';

        return this.chatRoomMessageApi
          .appChatRoomMessageGetChatRoomMessages({
            chatRoomId: this.selectedChatRoom.id,
            startId: this.lastChatMessageId
          });
      })
      .subscribe((output) => {
        for (let i = 0; i < output.chatRoomMessages.length; i++) {
          this.selectedChatRoom.messages.push(output.chatRoomMessages[i]);
        }

        this.scrollChatRoomMessagesContainer();
      });
  }

  private scrollChatRoomMessagesContainer() {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 100);
  }

}
