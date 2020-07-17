import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgHelpComponent } from './ng-help.component';

describe('NgHelpComponent', () => {
  let component: NgHelpComponent;
  let fixture: ComponentFixture<NgHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
