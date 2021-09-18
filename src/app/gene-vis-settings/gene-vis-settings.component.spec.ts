import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneVisSettingsComponent } from './gene-vis-settings.component';

describe('GeneVisSettingsComponent', () => {
  let component: GeneVisSettingsComponent;
  let fixture: ComponentFixture<GeneVisSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneVisSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneVisSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
