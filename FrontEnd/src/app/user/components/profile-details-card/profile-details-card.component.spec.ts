import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDetailsCardComponent } from './profile-details-card.component';

describe('ProfileDetailsCardComponent', () => {
  let component: ProfileDetailsCardComponent;
  let fixture: ComponentFixture<ProfileDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileDetailsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
