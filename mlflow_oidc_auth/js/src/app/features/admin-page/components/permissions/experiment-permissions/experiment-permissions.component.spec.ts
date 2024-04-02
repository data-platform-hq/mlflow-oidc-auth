import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentPermissionsComponent } from './experiment-permissions.component';

describe('ExperimentPermissionsComponent', () => {
  let component: ExperimentPermissionsComponent;
  let fixture: ComponentFixture<ExperimentPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentPermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
