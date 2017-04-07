import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendInvitationsComponent } from './friend-invitations.component';

describe('FriendInvitationsComponent', () => {
  let component: FriendInvitationsComponent;
  let fixture: ComponentFixture<FriendInvitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendInvitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
