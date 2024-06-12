import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnaStructureComponent } from './rna-structure.component';

describe('RnaStructureComponent', () => {
  let component: RnaStructureComponent;
  let fixture: ComponentFixture<RnaStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnaStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RnaStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
