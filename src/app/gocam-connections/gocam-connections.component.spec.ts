import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GocamConnectionsComponent } from './gocam-connections.component';

describe('GocamConnectionsComponent', () => {
  let component: GocamConnectionsComponent;
  let fixture: ComponentFixture<GocamConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GocamConnectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GocamConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
