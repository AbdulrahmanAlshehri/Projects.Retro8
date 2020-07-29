import { Chip8Core } from './chip8Core';

describe('Chip8Core', () => {
  let core: Chip8Core;

  beforeEach(() => {
    core = new Chip8Core();
  });

  it('should be created', () => {
    expect(core).toBeTruthy();
  });
});
