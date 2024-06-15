import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoCamTableComponent } from './go-cam-table.component';

describe('GoCamTableComponent', () => {
  let component: GoCamTableComponent;
  let fixture: ComponentFixture<GoCamTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoCamTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoCamTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
