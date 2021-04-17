import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotDirectionSelectDialogComponent } from './not-direction-select-dialog.component';

describe('NotDirectionSelectDialogComponent', () => {
  let component: NotDirectionSelectDialogComponent;
  let fixture: ComponentFixture<NotDirectionSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotDirectionSelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotDirectionSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
