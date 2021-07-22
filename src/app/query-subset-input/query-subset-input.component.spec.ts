import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySubsetInputComponent } from './query-subset-input.component';

describe('QuerySubsetInputComponent', () => {
  let component: QuerySubsetInputComponent;
  let fixture: ComponentFixture<QuerySubsetInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuerySubsetInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySubsetInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
