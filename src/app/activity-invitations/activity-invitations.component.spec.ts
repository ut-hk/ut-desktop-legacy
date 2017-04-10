import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInvitationsComponent } from './activity-invitations.component';

describe('ActivityInvitationsComponent', () => {
  let component: ActivityInvitationsComponent;
  let fixture: ComponentFixture<ActivityInvitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityInvitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
