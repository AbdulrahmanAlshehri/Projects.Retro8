import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Chip8PageComponent } from './chip8Page.component';

describe('Chip8Component', () => {
  let component: Chip8PageComponent;
  let fixture: ComponentFixture<Chip8PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Chip8PageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chip8PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
