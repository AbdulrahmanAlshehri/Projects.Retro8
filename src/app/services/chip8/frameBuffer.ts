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
        this.initFrameBuffer();
    }

    initFrameBuffer() {
        for(let i = 0; i < this.FRAME_WIDTH; i++) {
            this.currentFrame[i] = new Array<number>();
            for(let j = 0; j < this.FRAME_HEIGHT; j++) {
                this.currentFrame[i][j] = 0;
            }
        }
    }
}