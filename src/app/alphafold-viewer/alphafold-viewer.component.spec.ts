import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphafoldViewerComponent } from './alphafold-viewer.component';

describe('AlphafoldViewerComponent', () => {
  let component: AlphafoldViewerComponent;
  let fixture: ComponentFixture<AlphafoldViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphafoldViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphafoldViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
