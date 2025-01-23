import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDescriptionDisplayComponent } from './query-description-display.component';

describe('QueryDescriptionDisplayComponent', () => {
  let component: QueryDescriptionDisplayComponent;
  let fixture: ComponentFixture<QueryDescriptionDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryDescriptionDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryDescriptionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
