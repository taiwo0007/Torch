import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscooterResultsComponent } from './escooter-results.component';

describe('EscooterResultsComponent', () => {
  let component: EscooterResultsComponent;
  let fixture: ComponentFixture<EscooterResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscooterResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscooterResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
