import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarSearchComponent } from './nav-bar-search.component';

describe('NavBarSearchComponent', () => {
  let component: NavBarSearchComponent;
  let fixture: ComponentFixture<NavBarSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavBarSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
