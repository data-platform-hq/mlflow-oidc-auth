import { TestBed } from '@angular/core/testing';

import { PermissionDataService } from '../data/permission-data.service';

describe('PermissionDataService', () => {
  let service: PermissionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
