import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantPermissinModalComponent } from './grant-permissin-modal.component';

describe('GrantPermissinModalComponent', () => {
  let component: GrantPermissinModalComponent;
  let fixture: ComponentFixture<GrantPermissinModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantPermissinModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantPermissinModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
