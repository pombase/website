import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCommunityPubsComponent } from './recent-community-pubs.component';

describe('RecentCommunityPubsComponent', () => {
  let component: RecentCommunityPubsComponent;
  let fixture: ComponentFixture<RecentCommunityPubsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentCommunityPubsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentCommunityPubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
