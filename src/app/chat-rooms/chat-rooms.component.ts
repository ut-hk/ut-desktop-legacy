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

interface Friend {
  user: UserListDto;
  isSelected: boolean;
}

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  public pageControls = {
    isChatRoomsSelectorExpanded: true
  };

  public myUser: UserDto = null;

  public chatRooms: ChatRoom[];
  public selectedChatRoom: ChatRoom;

  public users: UserListDto[] = null;
  public friends: Friend[] = [];

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
        this.users = output.friends;

        this.friends = output.friends.map(friend => {
          return {user: friend, isSelected: false};
        });

        getFriendsSubscription.unsubscribe();
      });
  }

  public onSwipe(e) {
    if (e.type === 'swipeleft') {
      this.pageControls.isChatRoomsSelectorExpanded = true;
    }

    if (e.type === 'swiperight') {
      this.pageControls.isChatRoomsSelectorExpanded = false;
    }
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
    const createChatRoomSubscription = this.chatRoomApi
      .appChatRoomCreateChatRoomWithHttpInfo(this.createChatRoomInput)
      .subscribe((output) => {
        this.getMyChatRooms();

        createChatRoomSubscription.unsubscribe();
      });

    this.createChatRoomModal.hide();
  }

  public onClickAddFriendsToChatRoom() {
    this.updateChatRoomInput.id = this.selectedChatRoom.id;
    this.updateChatRoomInput.name = this.selectedChatRoom.name;

    const participantIds = this.selectedChatRoom.participants.map(participant => {
      return participant.id;
    });

    const newParticipantIds = this.friends.filter((friend) => {
      return friend.isSelected;
    });

    for (let i = 0; i < newParticipantIds.length; i++) {
      if (participantIds.indexOf(newParticipantIds[i].user.id) == -1) {
        participantIds.push(newParticipantIds[i].user.id);
      }
    }

    this.updateChatRoomInput.participantIds = participantIds;

    this.chatRoomApi
      .appChatRoomUpdateChatRoom(this.updateChatRoomInput)
      .subscribe((output) => {
        this.getMyChatRooms();
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

        this.lastChatMessageId = output.chatRoomMessages[output.chatRoomMessages.length - 1].id;

        this.scrollChatRoomMessagesContainer();
      });
  }


  private scrollChatRoomMessagesContainer() {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 100);
  }

}
