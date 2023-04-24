import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostBadgeComponent } from './host-badge.component';

describe('HostBadgeComponent', () => {
  let component: HostBadgeComponent;
  let fixture: ComponentFixture<HostBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
