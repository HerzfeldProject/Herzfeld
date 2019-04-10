import { TestBed } from '@angular/core/testing';

import { FollowUpDashboardService } from './follow-up-dashboard.service';

describe('FollowUpDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FollowUpDashboardService = TestBed.get(FollowUpDashboardService);
    expect(service).toBeTruthy();
  });
});
