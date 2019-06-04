import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolModalComponent } from './protocol-modal.component';

describe('ProtocolModalComponent', () => {
  let component: ProtocolModalComponent;
  let fixture: ComponentFixture<ProtocolModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
