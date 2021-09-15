import * as d3 from 'd3';
import ArrayVis from '../ArrayVis';
import Timer from '../Utils/Timer';

export default class MapArray {
  private data: any;
  index: number = 0;
  h: any;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  arrow: any;
  operator: any;
  operand: any;
  rect: any;
  callback: (n: any) => number;
  b: ArrayVis;
  ref: any;
  isPaused = false;
  timer: Timer;

  constructor(data: number[], ref: HTMLDivElement) {
    this.data = data || [2, 7, 5, 8, 4, 1, 9];
    this.ref = ref;
    this.callback = (n) => {
      return n * 2;
    };
    this.init(ref);
  }

  private init(ref: HTMLDivElement) {
    this.svg = d3
      .select(ref)
      .append('svg')
      .attr('height', 300)
      .attr('width', 900);
    this.arrow = this.svg
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000')
      .attr('transform', 'translate(30,180),rotate(90),scale(2)');
    const a = new ArrayVis(this.data, this.svg, {
      speed: 250,
    });
    const filteredData: any[] = [];
    this.b = new ArrayVis(filteredData, this.svg, {
      speed: 250,
    });
    a.container.attr('transform', 'translate(0,150)');
    this.b.container.attr('transform', 'translate(0,250)');
    this.h = a.highlight(this.index);
    this.h.color('blue');

    this.svg.append('text').text('map').attr('y', 75).attr('class', 'sm');

    this.svg
      .append('text')
      .text('array.map(function(n){return (n*2)})')
      .attr('y', 105)
      .attr('x', 0)
      .attr('class', 'xsm');

    this.svg
      .append('text')
      .text(' * 2 =')
      .attr('y', 195)
      .attr('x', 90)
      .attr('class', 'sm');

    this.operator = this.svg
      .append('text')
      .text('n')
      .attr('y', 195)
      .attr('x', 60)
      .attr('class', 'sm')
      .style('text-align', 'right')
      .attr('opacity', 1);

    this.operand = this.svg
      .append('text')
      .text('x')
      .attr('y', 195)
      .attr('x', 170)
      .attr('class', 'sm')
      .style('text-align', 'right')
      .attr('opacity', 1);

    this.rect = this.svg
      .append('rect')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('height', 40)
      .attr('width', 42)
      .attr('opacity', 0)
      .attr('transform', 'translate(160,170)');
  }

  public play() {
    this.timer = new Timer(() => {
      let d = this.data[this.index];
      this.h.color('blue');
      this.h.goto(this.index);
      this.updateOperator(d);
      this.updateOperand(' ');

      if (this.index > this.data.length - 1) {
        setTimeout(() => {
          this.svg.remove();
          this.index = 0;
          this.init(this.ref);
        }, 3000);
        return;
      }

      setTimeout(() => {
        this.h.color('green');
        this.b.push(this.callback(d));
        this.updateOperand(this.callback(d));
        this.flashRect('green');
        this.bumpArrow();

        this.index++;
      }, 1800);
    }, 3600);
  }

  public pause() {
    this.timer.pause();
  }

  public resume() {
    this.timer.resume();
  }

  private bumpArrow() {
    this.arrow
      .transition()
      .attr('transform', 'translate(30,190),rotate(90),scale(2)')
      .transition()
      .attr('transform', 'translate(30,180),rotate(90),scale(2)');
  }

  private flashRect(color: string) {
    this.rect
      .transition()
      .attr('opacity', 0.35)
      .style('fill', color)
      .transition()
      .delay(1600)
      .attr('opacity', 0);
  }

  private updateOperator(number: any) {
    this.operator
      .transition()
      .attr('opacity', 0)
      .transition()
      .text(number || 'n')
      .attr('opacity', 1);
  }

  private updateOperand(number: string | number) {
    this.operand
      .transition()
      .attr('opacity', 0)
      .transition()
      .text(number || 'n')
      .attr('opacity', 1);
  }
}
