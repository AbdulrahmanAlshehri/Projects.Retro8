export class FrameBuffer {

    private _currentFrame: number[][];

    get currentFrame() {
        return this._currentFrame;
    }

    set currentFrame(value: number[][]) {
        this._currentFrame = value;
    }

    private FRAME_WIDTH = 64;

    private FRAME_HEIGHT = 32;

    constructor() {
        this.currentFrame = new Array<Array<number>>()
        this.clearFrameBuffer();
    }

    clearFrameBuffer() {
        for(let i = 0; i < this.FRAME_WIDTH; i++) {
            this.currentFrame[i] = new Array<number>();
            for(let j = 0; j < this.FRAME_HEIGHT; j++) {
                this.currentFrame[i][j] = 0;
            }
        }
    }

    whiteFrameBuffer() {
        for(let i = 0; i < this.FRAME_WIDTH; i++) {
            this.currentFrame[i] = new Array<number>();
            for(let j = 0; j < this.FRAME_HEIGHT; j++) {
                this.currentFrame[i][j] = 1;
            }
        }
    }

    draw(x: number, y: number, sprite: Uint8Array, byteCount: number): boolean {
        let collision: boolean = false;
        for(let i = 0; i < byteCount; i++) {
            let spriteString = sprite[i].toString(2);
            while(spriteString.length < 8) {
                spriteString = '0' + spriteString;
            }
            for(let j = 0; j < 8; j++) {
                if(spriteString[j] === '1') {
                    if(this.currentFrame[(x + j) % 64][(y + i) % 32] & 1) {
                        collision = true;
                    }
                    this.currentFrame[(x + j) % 64][(y + i) % 32] = 1 ^ this.currentFrame[(x + j) % 64][(y + i) % 32];
                }
                else {
                    this.currentFrame[(x + j) % 64][(y + i) % 32] = 0 ^ this.currentFrame[(x + j) % 64][(y + i) % 32];
                }
            }
        }
        console.log(this._currentFrame);
        return collision;
    }
}