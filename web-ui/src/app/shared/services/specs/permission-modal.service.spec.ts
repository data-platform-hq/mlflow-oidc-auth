import { TestBed } from '@angular/core/testing';

import { PermissionModalService } from '../permission-modal.service';

describe('PermissionModalService', () => {
  let service: PermissionModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
