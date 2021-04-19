import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemControllerComponent } from './system-controller.component';

describe('SystemControllerComponent', () => {
  let component: SystemControllerComponent;
  let fixture: ComponentFixture<SystemControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
