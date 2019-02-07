import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinFeaturesComponent } from './protein-features.component';

describe('ProteinFeaturesComponent', () => {
  let component: ProteinFeaturesComponent;
  let fixture: ComponentFixture<ProteinFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
