import { TestBed } from '@angular/core/testing';

import { SummaryDashboardService } from './summary-dashboard.service';

describe('SummaryDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SummaryDashboardService = TestBed.get(SummaryDashboardService);
    expect(service).toBeTruthy();
  });
});
