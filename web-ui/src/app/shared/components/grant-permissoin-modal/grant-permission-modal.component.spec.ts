import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantPermissionModalComponent } from './grant-permission-modal.component';

describe('GrantPermissinModalComponent', () => {
  let component: GrantPermissionModalComponent;
  let fixture: ComponentFixture<GrantPermissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantPermissionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantPermissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
