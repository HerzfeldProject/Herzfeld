
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDashboardComponent } from './summary-dashboard.component';

describe('SummaryDashboardComponent', () => {
  let component: SummaryDashboardComponent;
  let fixture: ComponentFixture<SummaryDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
