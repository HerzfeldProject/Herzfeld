import { TestBed } from '@angular/core/testing';

import { ObjectToChartService } from './object-to-chart.service';

describe('ObjectToChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectToChartService = TestBed.get(ObjectToChartService);
    expect(service).toBeTruthy();
  });
});
