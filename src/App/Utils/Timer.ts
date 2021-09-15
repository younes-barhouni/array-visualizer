export default class Timer {
  timerId: number;
  start: number | Date | any;
  remaining: any;
  callback: () => void;
  delay: any;

  constructor(callback: { (): void; (): void }, delay: number) {
    this.callback = callback;
    this.delay = delay;
    this.resume();
  }

  pause() {
    window.clearTimeout(this.timerId);
    const date: Date = new Date();
    this.remaining -= (date as any) - this.start;
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
