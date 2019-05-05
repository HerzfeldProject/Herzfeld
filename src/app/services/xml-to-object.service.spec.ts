import { TestBed } from '@angular/core/testing';

import { XmlToObjectService } from './xml-to-object.service';

describe('XmlToObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmlToObjectService = TestBed.get(XmlToObjectService);
    expect(service).toBeTruthy();
  });
});
