
export class Audio {

    audioContext: AudioContext;
    oscillator: any;

    constructor() {
        this.audioContext = new AudioContext();

    }

    public createOscillator() {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = 'triangle';
        this.oscillator.frequency.value = 400;
        this.oscillator.connect(this.audioContext.destination);
    }
    public play(): void {
        if (!this.oscillator) {
            this.createOscillator();
            if (this.oscillator) {
                this.oscillator.start(0);
            }
        }
    }
}