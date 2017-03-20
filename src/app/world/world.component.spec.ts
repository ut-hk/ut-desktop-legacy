import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPlansComponent } from './activity-plans.component';

describe('ActivityPlansComponent', () => {
  let component: WorldComponent;
  let fixture: ComponentFixture<ActivityPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPlansComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
