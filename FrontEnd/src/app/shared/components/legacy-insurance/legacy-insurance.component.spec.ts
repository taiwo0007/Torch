import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegacyInsuranceComponent } from './legacy-insurance.component';

describe('LegacyInsuranceComponent', () => {
  let component: LegacyInsuranceComponent;
  let fixture: ComponentFixture<LegacyInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegacyInsuranceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegacyInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
