import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationOfActivityTemplateComponent } from './creation-of-activity-template.component';

describe('CreationOfActivityTemplateComponent', () => {
  let component: CreationOfActivityTemplateComponent;
  let fixture: ComponentFixture<CreationOfActivityTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationOfActivityTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationOfActivityTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
