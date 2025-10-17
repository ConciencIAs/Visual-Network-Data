import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRegisterMessages } from './load-register-messages';

describe('LoadRegisterMessages', () => {
  let component: LoadRegisterMessages;
  let fixture: ComponentFixture<LoadRegisterMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadRegisterMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadRegisterMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
