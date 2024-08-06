import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPermissionDetailsComponent } from './group-permission-details.component';

describe('GroupPermissionDetailsComponent', () => {
  let component: GroupPermissionDetailsComponent;
  let fixture: ComponentFixture<GroupPermissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupPermissionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupPermissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
