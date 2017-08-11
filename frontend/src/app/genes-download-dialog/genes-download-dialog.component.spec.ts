import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenesDownloadDialogComponent } from './genes-download-dialog.component';

describe('GenesDownloadDialogComponent', () => {
  let component: GenesDownloadDialogComponent;
  let fixture: ComponentFixture<GenesDownloadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenesDownloadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenesDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
