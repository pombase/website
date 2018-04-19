import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentsMenuComponent } from './page-contents-menu.component';

describe('PageContentsMenuComponent', () => {
  let component: PageContentsMenuComponent;
  let fixture: ComponentFixture<PageContentsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageContentsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageContentsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
