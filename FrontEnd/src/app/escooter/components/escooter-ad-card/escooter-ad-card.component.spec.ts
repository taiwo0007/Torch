import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscooterAdCardComponent } from './escooter-ad-card.component';

describe('EscooterAdCardComponent', () => {
  let component: EscooterAdCardComponent;
  let fixture: ComponentFixture<EscooterAdCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscooterAdCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscooterAdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
