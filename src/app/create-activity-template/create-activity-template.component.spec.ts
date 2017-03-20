import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityTemplateComponent } from './create-activity-template.component';

describe('CreateActivityTemplateComponent', () => {
  let component: CreateActivityTemplateComponent;
  let fixture: ComponentFixture<CreateActivityTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateActivityTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
