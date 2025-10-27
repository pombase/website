import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetVersionsComponent } from './dataset-versions.component';

describe('DatasetVersionsComponent', () => {
  let component: DatasetVersionsComponent;
  let fixture: ComponentFixture<DatasetVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetVersionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
