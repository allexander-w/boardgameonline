import { heapText, heapField } from "../../factory/heap.factory.js";
import { isPointInsideRect } from "../../utils/utils.js";
import { loadSVG } from "../../utils/loader.js";

import Konva from "konva";

function Heap(game, options = {}) {
    this.elements = [];
    this.in_heap_count = 0;

    const field = heapField(options);
    const nameShape = heapText(this.in_heap_count, options);

    this.buttonEntire = new Konva.Rect({
        x: (options.x || 1000) - 30,
        y: (options.y || 200) + 10,
        width: 24,
        height: 24,
        stroke: "rgb(42,30,32)",

        // fillPatternScale: { x: .2, y: .2 },
        // fillPatternOffset: { x: 0, y: 0 },
        fillPatternRepeat: "no-repeat",

        // fill: "rgba(0,0,0, 0.1)",

        cornerRadius: 4,
        draggable: false,
    });


    loadSVG("/union.svg", (image) => {
        const shapeWidth = this.buttonEntire.width();
        const shapeHeight = this.buttonEntire.height();
        const imgWidth = image.width;
        const imgHeight = image.height;


        const scale = Math.min(shapeWidth / imgWidth, shapeHeight / imgHeight);
        this.buttonEntire.fillPatternScale({ x: scale, y: scale });


        this.buttonEntire.fillPatternOffset({
            x: (imgWidth * scale - shapeWidth) / 2,
            y: (imgHeight * scale - shapeHeight) / 2
        });


        this.buttonEntire.fillPatternImage(image);
    });


    game.add(this.buttonEntire);
    game.add(field);
    game.add(nameShape);


    this.add_element = (element) => {
        this.elements.push(element);
        this.in_heap_count = this.elements.length;

        nameShape.text(this.in_heap_count);
        game.add(element.element);
    }

    this.to_heap = () => {
        this.in_heap_count ++;
        nameShape.text(this.in_heap_count);
    }

    this.from_heap = () => {
        this.in_heap_count --;
        nameShape.text(this.in_heap_count);
    }

    this.check_chip_position = (e) => {
        const point = { x: e.target?.attrs?.x, y: e.target?.attrs?.y };
        const rectangle = { x: field.x(), y: field.y(), width: field.width(), height: field.height() };

        if ( isPointInsideRect(point, rectangle) && !isPointInsideRect( e.target.attrs.prevPosition, rectangle) ) {
            this.to_heap()
        }

        if ( isPointInsideRect( e.target.attrs.prevPosition, rectangle) && !isPointInsideRect(point, rectangle) ) {
            this.from_heap();
        }

        e.target.attrs.prevPosition = point;
    }

    this.entire = () => {
        this.elements.forEach(el => {
            el.chip.x(options.x + (options.width / 2));
            el.chip.y(options.y + (options.height / 2));
        })
    }


    this.buttonEntire.on('click', this.entire);
}

export default Heap;