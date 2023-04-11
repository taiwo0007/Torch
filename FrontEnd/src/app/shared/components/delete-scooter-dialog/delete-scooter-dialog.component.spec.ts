import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteScooterDialogComponent } from './delete-scooter-dialog.component';

describe('DeleteScooterDialogComponent', () => {
  let component: DeleteScooterDialogComponent;
  let fixture: ComponentFixture<DeleteScooterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteScooterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteScooterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
