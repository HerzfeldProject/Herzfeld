import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandagingDashboardComponent } from './bandaging-dashboard.component';

describe('BandagingDashboardComponent', () => {
  let component: BandagingDashboardComponent;
  let fixture: ComponentFixture<BandagingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandagingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandagingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
