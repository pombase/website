import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinPropertiesComponent } from './protein-properties.component';

describe('ProteinPropertiesComponent', () => {
  let component: ProteinPropertiesComponent;
  let fixture: ComponentFixture<ProteinPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
