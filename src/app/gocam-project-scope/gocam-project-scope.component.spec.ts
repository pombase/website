import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GocamProjectScopeComponent } from './gocam-project-scope.component';

describe('GocamProjectScopeComponent', () => {
  let component: GocamProjectScopeComponent;
  let fixture: ComponentFixture<GocamProjectScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GocamProjectScopeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GocamProjectScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
