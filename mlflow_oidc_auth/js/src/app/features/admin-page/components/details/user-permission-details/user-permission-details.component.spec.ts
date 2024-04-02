import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionDetailsComponent } from './user-permission-details.component';

describe('UserPermissionDetailsComponent', () => {
  let component: UserPermissionDetailsComponent;
  let fixture: ComponentFixture<UserPermissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPermissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
