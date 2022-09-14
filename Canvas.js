export class CanvasError extends Error {}

export const chunkSize = 5;

export const Img = (data) => (
    new ImageData(new Uint8ClampedArray(
        data.reduce((list, elem, i) => (
            list.push(elem),
            ((i + 1) % 3 === 0) && list.push(255),
            list
        ), [])
    ), chunkSize)
);

export default class Canvas {
    constructor(element) {
        let el = element instanceof HTMLElement ? element : document.querySelector(element);
        if (el instanceof HTMLDivElement)
            el.appendChild(this.canvas = document.createElement("canvas"));
        else if (el instanceof HTMLCanvasElement)
            this.canvas = el;
        else throw new CanvasError("Element not found.");

        this.ctx = this.canvas.getContext("2d");
        this.ox = 0;
        this.oy = 0;

        this.bitmaps = [[Img([
            0, 255, 255,
            255, 0, 255,
            255, 255, 0,
            0, 0, 0,
            255, 255, 255,
        ])]];
    }

    render() {
        let dx = this.canvas.width + this.ox;
        let dy = this.canvas.height + this.oy;
        this.bitmaps.forEach((bitmaps, x) => bitmaps.forEach(
            (bitmap, y) => (
                    console.log(x, y, bitmap),
                    this.ctx.putImageData(
                        bitmap,
                        dx + x * chunkSize,
                        dy + y * chunkSize
                    )
                )
        ));
        return this;
    }
}