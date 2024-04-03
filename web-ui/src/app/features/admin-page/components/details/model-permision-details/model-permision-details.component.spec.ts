import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPermisionDetailsComponent } from './model-permision-details.component';

describe('ModelPermisionDetailsComponent', () => {
  let component: ModelPermisionDetailsComponent;
  let fixture: ComponentFixture<ModelPermisionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelPermisionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelPermisionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
