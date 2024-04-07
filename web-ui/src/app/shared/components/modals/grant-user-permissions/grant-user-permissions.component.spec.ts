import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantUserPermissionsComponent } from './grant-user-permissions.component';

describe('GrantUserPermissionsComponent', () => {
  let component: GrantUserPermissionsComponent;
  let fixture: ComponentFixture<GrantUserPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantUserPermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantUserPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
