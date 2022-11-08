import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneticInteractionAnnotationTableComponent } from './genetic-interaction-annotation-table.component';

describe('GeneticInteractionAnnotationTableComponent', () => {
  let component: GeneticInteractionAnnotationTableComponent;
  let fixture: ComponentFixture<GeneticInteractionAnnotationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneticInteractionAnnotationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneticInteractionAnnotationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
