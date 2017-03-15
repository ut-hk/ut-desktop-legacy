import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationOfActivityPlanComponent } from './creation-of-activity-plan.component';

describe('CreationOfActivityPlanComponent', () => {
  let component: CreationOfActivityPlanComponent;
  let fixture: ComponentFixture<CreationOfActivityPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationOfActivityPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationOfActivityPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
