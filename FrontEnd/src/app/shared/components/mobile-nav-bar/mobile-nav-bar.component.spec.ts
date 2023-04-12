import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavBarComponent } from './mobile-nav-bar.component';

describe('MobileNavBarComponent', () => {
  let component: MobileNavBarComponent;
  let fixture: ComponentFixture<MobileNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileNavBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
