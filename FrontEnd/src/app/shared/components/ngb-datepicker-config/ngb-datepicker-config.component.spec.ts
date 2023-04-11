import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbDatepickerConfigComponent } from './ngb-datepicker-config.component';

describe('NgbDatepickerConfigComponent', () => {
  let component: NgbDatepickerConfigComponent;
  let fixture: ComponentFixture<NgbDatepickerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgbDatepickerConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgbDatepickerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
