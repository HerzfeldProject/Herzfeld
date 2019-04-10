
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentDashboardComponent } from './treatment-dashboard.component';

describe('TreatmentDashboardComponent', () => {
  let component: TreatmentDashboardComponent;
  let fixture: ComponentFixture<TreatmentDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
