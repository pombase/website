import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefGenesViewComponent } from './ref-genes-view.component';

describe('RefGenesViewComponent', () => {
  let component: RefGenesViewComponent;
  let fixture: ComponentFixture<RefGenesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefGenesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefGenesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
