import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPermissionsComponent } from './group-permissions.component';

describe('GroupPermissionsComponent', () => {
  let component: GroupPermissionsComponent;
  let fixture: ComponentFixture<GroupPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupPermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
