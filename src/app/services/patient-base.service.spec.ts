import { TestBed } from '@angular/core/testing';

import { PatientBaseService } from './patient-base.service';

describe('PatientBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PatientBaseService = TestBed.get(PatientBaseService);
    expect(service).toBeTruthy();
  });
});
