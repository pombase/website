import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDetailsDialogComponent } from './query-details-dialog.component';

describe('QueryDetailsDialogComponent', () => {
  let component: QueryDetailsDialogComponent;
  let fixture: ComponentFixture<QueryDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
