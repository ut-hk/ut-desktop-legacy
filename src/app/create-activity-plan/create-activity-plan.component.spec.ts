import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityPlanComponent } from './create-activity-plan.component';

describe('CreateActivityPlanComponent', () => {
  let component: CreateActivityPlanComponent;
  let fixture: ComponentFixture<CreateActivityPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateActivityPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
