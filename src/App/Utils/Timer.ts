

export default class Timer {

    timerId;
    start;
    remaining: any;
    callback: () => void;
    delay: any;

    constructor(callback, delay) {
        this.callback = callback;
        this.delay = delay
        this.resume();
    }


    pause() {
        window.clearTimeout(this.timerId);
        const date: any = new Date();
        this.remaining -= date - this.start;
    }


    resume() {

        this.start = new Date();
        this.timerId = window.setTimeout(() => {
            this.remaining = this.delay;
            this.resume();
            this.callback();
        }, this.remaining);
    }
}