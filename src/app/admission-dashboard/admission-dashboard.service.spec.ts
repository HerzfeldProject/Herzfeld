import { TestBed } from '@angular/core/testing';

import { AdmissionDashboardService } from './admission-dashboard.service';

describe('AdmissionDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmissionDashboardService = TestBed.get(AdmissionDashboardService);
    expect(service).toBeTruthy();
  });
});
