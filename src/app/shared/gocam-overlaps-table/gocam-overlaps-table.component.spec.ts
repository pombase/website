import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GocamOverlapsTableComponent } from './gocam-overlaps-table.component';

describe('GocamOverlapsTableComponent', () => {
  let component: GocamOverlapsTableComponent;
  let fixture: ComponentFixture<GocamOverlapsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GocamOverlapsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GocamOverlapsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
