import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneAllelesPageComponent } from './gene-alleles-page.component';

describe('GeneAllelesPageComponent', () => {
  let component: GeneAllelesPageComponent;
  let fixture: ComponentFixture<GeneAllelesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneAllelesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneAllelesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
