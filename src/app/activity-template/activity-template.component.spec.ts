import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTemplateComponent } from './activity-template.component';

describe('ActivityTemplateComponent', () => {
  let component: ActivityTemplateComponent;
  let fixture: ComponentFixture<ActivityTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
