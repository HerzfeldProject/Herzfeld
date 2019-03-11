
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpDashboardComponent } from './follow-up-dashboard.component';

describe('FollowUpDashboardComponent', () => {
  let component: FollowUpDashboardComponent;
  let fixture: ComponentFixture<FollowUpDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowUpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
