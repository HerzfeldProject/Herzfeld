import { TestBed } from '@angular/core/testing';

import { BaseServiceService } from './baseService.service';

describe('BaseServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseServiceService = TestBed.get(BaseServiceService);
    expect(service).toBeTruthy();
  });
});
