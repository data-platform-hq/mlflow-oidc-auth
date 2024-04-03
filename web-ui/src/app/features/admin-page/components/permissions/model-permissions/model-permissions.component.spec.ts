import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPermissionsComponent } from './model-permissions.component';

describe('ModelPermissionsComponent', () => {
  let component: ModelPermissionsComponent;
  let fixture: ComponentFixture<ModelPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelPermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
