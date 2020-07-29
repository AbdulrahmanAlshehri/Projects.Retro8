import { TestBed } from '@angular/core/testing';

import { Chip8Service } from './chip8.service';

describe('Chip8Service', () => {
  let service: Chip8Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Chip8Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
