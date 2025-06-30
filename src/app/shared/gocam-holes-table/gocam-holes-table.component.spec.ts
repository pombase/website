import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GocamHolesTableComponent } from './gocam-holes-table.component';

describe('GocamHolesTableComponent', () => {
  let component: GocamHolesTableComponent;
  let fixture: ComponentFixture<GocamHolesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GocamHolesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GocamHolesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
