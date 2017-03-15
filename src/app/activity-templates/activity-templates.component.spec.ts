import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTemplatesComponent } from './activity-templates.component';

describe('ActivityTemplatesComponent', () => {
  let component: ActivityTemplatesComponent;
  let fixture: ComponentFixture<ActivityTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
