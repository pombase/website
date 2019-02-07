import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneListLookupComponent } from './gene-list-lookup.component';

describe('GeneListLookupComponent', () => {
  let component: GeneListLookupComponent;
  let fixture: ComponentFixture<GeneListLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneListLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneListLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
