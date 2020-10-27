import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierMapperComponent } from './identifier-mapper.component';

describe('IdentifierMapperComponent', () => {
  let component: IdentifierMapperComponent;
  let fixture: ComponentFixture<IdentifierMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifierMapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifierMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
