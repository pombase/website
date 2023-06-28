import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionViewComponent } from './reaction-view.component';

describe('ReactionViewComponent', () => {
  let component: ReactionViewComponent;
  let fixture: ComponentFixture<ReactionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
