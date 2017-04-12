import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateActivityTemplateComponent } from './update-activity-template.component';

describe('UpdateActivityTemplateComponent', () => {
  let component: UpdateActivityTemplateComponent;
  let fixture: ComponentFixture<UpdateActivityTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateActivityTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateActivityTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
