import { TestBed } from '@angular/core/testing';

import { SharedRequestService } from './shared-request.service';

describe('SharedRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedRequestService = TestBed.get(SharedRequestService);
    expect(service).toBeTruthy();
  });
});
