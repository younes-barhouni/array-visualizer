import * as d3 from 'd3';

export default class Highlight {
  private targetX = 0;
  private targetY = 0;
  private targetWidth = 0;
  private targetOpacity = 0.35;
  private targetColor = 'red';
  private padding: number;
  private height;
  private rect: any;
  private container;

  public index = 0;
  public dataWidths: any;
  public parensWidth: number;
  public commaWidth: number;
  public data: any;

  constructor(
    index: number,
    height: any,
    container: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    data: any[],
    dataWidths: Iterable<d3.Numeric>,
    parensWidth: number,
    commaWidth: number
  ) {
    this.index = index;
    this.height = height;
    this.container = container;
    this.data = data;
    this.dataWidths = dataWidths;
    this.parensWidth = parensWidth;
    this.commaWidth = commaWidth;
    this.init();
  }

  private init() {
    this.calculate();
    this.rect = this.container
      .append('rect')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('height', this.height + this.padding * 2)
      .attr('opacity', 0)
      .attr(
        'transform',
        'translate(' +
          (this.targetX - this.padding) +
          ',' +
          (this.targetY - this.padding) +
          ')'
      );
    this.updateAll();
  }

  private calculate() {
    this.targetX =
      d3.sum(this.dataWidths.slice(0, this.index)) +
      this.parensWidth +
      this.index * this.commaWidth;
    this.targetY = -this.height * 0.75;
    this.targetWidth = this.dataWidths[this.index];
    this.padding = this.height / 12;
  }

  private updateAll() {
    this.calculate();

    this.rect
      .transition()
      .attr('opacity', this.targetOpacity)
      .attr(
        'transform',
        'translate(' +
          (this.targetX - this.padding) +
          ',' +
          (this.targetY - this.padding) +
          ')'
      )
      .attr('width', this.targetWidth + this.padding * 2)
      .style('fill', this.targetColor);
  }

  public goto(i: number) {
    this.index = i;
    if (this.index > this.data.length - 1) this.index = this.data.length - 1;
    this.updateAll();
  }

  public color(fill: string) {
    this.targetColor = fill;
    this.updateAll();
  }

  public destroy() {
    this.rect.transition().attr('opacity', 0).remove();
  }
}
