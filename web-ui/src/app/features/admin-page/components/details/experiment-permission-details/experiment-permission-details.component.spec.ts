import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentPermissionDetailsComponent } from './experiment-permission-details.component';

describe('ExperimentPermissionDetailsComponent', () => {
  let component: ExperimentPermissionDetailsComponent;
  let fixture: ComponentFixture<ExperimentPermissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentPermissionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentPermissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
