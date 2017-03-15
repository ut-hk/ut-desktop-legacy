import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPlanComponent } from './activity-plan.component';

describe('ActivityPlanComponent', () => {
  let component: ActivityPlanComponent;
  let fixture: ComponentFixture<ActivityPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
