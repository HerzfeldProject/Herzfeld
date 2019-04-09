
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionDashboardComponent } from './admission-dashboard.component';

describe('AdmissionDashboardComponent', () => {
  let component: AdmissionDashboardComponent;
  let fixture: ComponentFixture<AdmissionDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmissionDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
