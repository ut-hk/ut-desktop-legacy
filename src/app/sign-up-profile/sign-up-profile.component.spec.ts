import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProfileComponent } from './sign-up-profile.component';

describe('SignUpProfileComponent', () => {
  let component: SignUpProfileComponent;
  let fixture: ComponentFixture<SignUpProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
