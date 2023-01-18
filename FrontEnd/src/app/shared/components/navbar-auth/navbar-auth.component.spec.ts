import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAuthComponent } from './navbar-auth.component';

describe('NavbarAuthComponent', () => {
  let component: NavbarAuthComponent;
  let fixture: ComponentFixture<NavbarAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
