import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenesTableConfigComponent } from './genes-table-config.component';

describe('GenesTableConfigComponent', () => {
  let component: GenesTableConfigComponent;
  let fixture: ComponentFixture<GenesTableConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenesTableConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenesTableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
