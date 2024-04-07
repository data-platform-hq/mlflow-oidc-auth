import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPermissionDetailsComponent } from './model-permission-details.component';

describe('ModelPermisionDetailsComponent', () => {
  let component: ModelPermissionDetailsComponent;
  let fixture: ComponentFixture<ModelPermissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelPermissionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelPermissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
