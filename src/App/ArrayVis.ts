import * as d3 from "d3";
import Highlight from "./Utils/HighLight";


export default class ArrayVis {

    private data: any[];
    private svg;
    private speed = 500;
    private dataWidths;
    private commaWidth;
    private parensWidth;
    private height;

    public options = {};
    public container;

    constructor(data, svg, options) {
        this.data = data;
        this.svg = svg;
        this.speed = options.speed;
        this.options = options;
        this.container = this.svg.append('g').attr("transform", (d, i) => "translate(0,50)");
        this.update(data);
    }

    /**
     * 
     * @param data 
     */
    private computeWidths(data) {
        const text = this.container.selectAll('text._text')
            .data(data)
            .enter()
            .append('text')
            .text(d => d)

        const commas = this.container.append('text').text(',')

        const parens = this.container.append('text').text("[")

        this.dataWidths = data.map((a, i) => {
            return text["_groups"][0][i].getComputedTextLength();
        })

        this.commaWidth = commas["_groups"][0][0].getComputedTextLength();
        this.parensWidth = parens["_groups"][0][0].getComputedTextLength();

        this.height = parens["_groups"][0][0].getBBox().height;

        // debugger;

        text.remove();
        commas.remove();
        parens.remove();

    }

    /**
     * 
     * @param data 
     */
    public update(data) {
        this.computeWidths(data);

        // DATA JOIN
        const text = this.container.selectAll('text.text')
            .data(data, (a) => { return a });

        const commas = this.container.selectAll('text.comma')
            .data(data.slice(0, data.length - 1));

        const parens = this.container.selectAll('text.parens')
            .data(['[', ']'])

        // UPDATE
        text
            .transition()
            .duration(this.speed)
            .text(d => d)
            .attr("transform", (d, i) => {
                let x = d3.sum(this.dataWidths.slice(0, i)) + this.parensWidth;
                x+= i * this.commaWidth;
                return "translate(" + x + ",0)"
            })

        commas
            .transition()
            .duration(this.speed)
            .attr("transform", (d, i) => {
                let x = d3.sum(this.dataWidths.slice(0, i + 1)) + this.parensWidth;
                x+= i * this.commaWidth;
                return "translate(" + x + ",0)"
            })


        parens
            .transition()
            .duration(this.speed)
            .attr("transform", (d, i) => {
                let x = d3.sum(this.dataWidths) + this.parensWidth;
                x+= (data.length - 1) * this.commaWidth;
                if (data.length === 0)
                    x = this.parensWidth;
                return "translate(" + (i === 0 ? 0 : x) + ",0)";
            })


        // ENTER
        text.enter().append('text')
            .text((d, i) => { return d })
            .attr('class', 'text')
            .attr("transform", (d, i) => {
                let x = d3.sum(this.dataWidths.slice(0, i)) + this.parensWidth;
                x+= i * this.commaWidth;
                return "translate(" + x + ",0)"
            })
            .attr('opacity', 0)
            .attr('y', 50)
            .transition()
            .duration(this.speed)
            .attr('opacity', 1)
            .attr('y', 0)

        commas.enter().append('text')
            .text((d, i) => { return ","; })
            .attr('class', 'comma')
            .attr("transform", (d, i) => {
                let x = d3.sum(this.dataWidths.slice(0, i + 1)) + this.parensWidth;
                x+= i * this.commaWidth;
                return "translate(" + x + ",0)"
            })

        parens
            .enter().append('text')
            .attr('class', 'parens')
            .attr("transform", (d, i) => {
                let x = d3.sum(this.dataWidths) + this.parensWidth;
                x+= (data.length - 1) * this.commaWidth;
                if (data.length === 0) x = this.parensWidth;
                return "translate(" + (i === 0 ? 0 : x) + ",0)"
            })
            .text(d => d)

        //EXIT
        text.exit()
            .attr("y", 0)
            .transition()
            .duration(this.speed / 2)
            .attr("y", -75)
            .transition()
            .duration(this.speed / 2)
            .attr("opacity", 0)
            .remove();

        commas.exit()
            .remove();
    }

    /**
     * 
     * @param a 
     * @param index 
     */
    public push(a, index?){
        this.data.splice(index || this.data.length, 0, a);
        this.update(this.data);
    }

    /**
     * 
     * @param index 
     * @param value 
     */
    public splice(index, value) {
        value ? this.data.splice(index, 1, value) : this.data.splice(index, 1);
        this.update(this.data);
    }

    /**
     * 
     * @param index 
     * @returns 
     */
    public highlight(index) {
        index = index || 0;

        const highlight = new Highlight(index, this.height, this.container, this.data, this.dataWidths, this.parensWidth, this.commaWidth);
        return highlight;
    }

}