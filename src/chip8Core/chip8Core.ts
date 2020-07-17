
export class Chip8Core {

    private _rom: string;

    get rom(): string {
        return this.rom;
    }

    set rom(newRom: string) {
        this._rom = newRom;
    }
}