import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollPanelDemoComponent } from './scroll-panel-demo.component';

describe('ScrollPanelDemoComponent', () => {
  let component: ScrollPanelDemoComponent;
  let fixture: ComponentFixture<ScrollPanelDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollPanelDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollPanelDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
