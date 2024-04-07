import { TestBed } from '@angular/core/testing';

import { ExperimentsDataService } from './experiments-data.service';

describe('ExperimentsDataService', () => {
  let service: ExperimentsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExperimentsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
