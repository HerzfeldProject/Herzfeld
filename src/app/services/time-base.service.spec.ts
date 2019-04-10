import { TestBed } from '@angular/core/testing';

import { TimeBaseService } from './time-base.service';

describe('TimeBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeBaseService = TestBed.get(TimeBaseService);
    expect(service).toBeTruthy();
  });
});
