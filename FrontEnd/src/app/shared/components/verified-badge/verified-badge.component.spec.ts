import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedBadgeComponent } from './verified-badge.component';

describe('VerifiedBadgeComponent', () => {
  let component: VerifiedBadgeComponent;
  let fixture: ComponentFixture<VerifiedBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifiedBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiedBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
