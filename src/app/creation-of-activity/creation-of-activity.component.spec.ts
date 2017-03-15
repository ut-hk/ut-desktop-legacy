import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationOfActivityComponent } from './creation-of-activity.component';

describe('CreationOfActivityComponent', () => {
  let component: CreationOfActivityComponent;
  let fixture: ComponentFixture<CreationOfActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationOfActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationOfActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
