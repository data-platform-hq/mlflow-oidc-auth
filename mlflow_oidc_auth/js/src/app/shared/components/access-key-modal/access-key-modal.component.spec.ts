import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessKeyModalComponent } from './access-key-modal.component';

describe('AccessKeyModalComponent', () => {
  let component: AccessKeyModalComponent;
  let fixture: ComponentFixture<AccessKeyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessKeyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
