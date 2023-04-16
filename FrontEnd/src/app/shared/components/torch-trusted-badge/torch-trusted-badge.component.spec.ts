import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorchTrustedBadgeComponent } from './torch-trusted-badge.component';

describe('TorchTrustedBadgeComponent', () => {
  let component: TorchTrustedBadgeComponent;
  let fixture: ComponentFixture<TorchTrustedBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorchTrustedBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TorchTrustedBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
