import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Chip8Component } from './chip8.component';

describe('Chip8Component', () => {
  let component: Chip8Component;
  let fixture: ComponentFixture<Chip8Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Chip8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chip8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
