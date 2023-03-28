import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdModalComponent } from './ad-modal.component';

describe('AdModalComponent', () => {
  let component: AdModalComponent;
  let fixture: ComponentFixture<AdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
