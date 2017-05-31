import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterisationStatusTableComponent } from './characterisation-status-table.component';

describe('CharacterisationStatusTableComponent', () => {
  let component: CharacterisationStatusTableComponent;
  let fixture: ComponentFixture<CharacterisationStatusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterisationStatusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterisationStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
