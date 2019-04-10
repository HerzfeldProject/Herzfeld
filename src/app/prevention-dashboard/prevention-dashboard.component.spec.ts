
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventionDashboardComponent } from './prevention-dashboard.component';

describe('PreventionDashboardComponent', () => {
  let component: PreventionDashboardComponent;
  let fixture: ComponentFixture<PreventionDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventionDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreventionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
