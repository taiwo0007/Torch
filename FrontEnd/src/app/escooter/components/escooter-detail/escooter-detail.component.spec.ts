import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscooterDetailComponent } from './escooter-detail.component';

describe('EscooterDetailComponent', () => {
  let component: EscooterDetailComponent;
  let fixture: ComponentFixture<EscooterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscooterDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscooterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
