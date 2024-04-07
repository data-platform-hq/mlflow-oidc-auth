import { TestBed } from '@angular/core/testing';

import { ModelsDataService } from './models-data.service';

describe('ModelsDataService', () => {
  let service: ModelsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
