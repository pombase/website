import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierMapperResultsComponent } from './identifier-mapper-results.component';

describe('IdentifierMapperResultsComponent', () => {
  let component: IdentifierMapperResultsComponent;
  let fixture: ComponentFixture<IdentifierMapperResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifierMapperResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifierMapperResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
