import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFormCardComponent } from './profile-form-card.component';

describe('ProfileFormCardComponent', () => {
  let component: ProfileFormCardComponent;
  let fixture: ComponentFixture<ProfileFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileFormCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
