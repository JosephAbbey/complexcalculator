export class CanvasError extends Error {}

export const chunkSize = 100;

export const Img = (data) =>
    new ImageData(new Uint8ClampedArray(data), chunkSize);

const cleanMod = (a) => (Math.sign(a) === 1 ? a - chunkSize : a);

export default class Canvas {
    constructor(element, chunkFunction) {
        let el =
            element instanceof HTMLElement
                ? element
                : document.querySelector(element);
        if (el instanceof HTMLDivElement)
            el.appendChild((this.canvas = document.createElement('canvas')));
        else throw new CanvasError('Element not found.');

        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;

        this.ctx = this.canvas.getContext('2d');

        this.canvas.style.filter = "blur(1px) url(#amplify-alpha)";

        this.ox = 0;
        this.oy = 0;

        this.md = false;
        this.mx = 0;
        this.my = 0;

        this.chunkFunction = chunkFunction;
        this.bitmaps = [];

        this.canvas.addEventListener(
            'mousedown',
            (evt) => {
                evt.preventDefault();
                this.md = true;
                this.mx = evt.clientX;
                this.my = evt.clientY;
            },
            false
        );
        this.canvas.addEventListener(
            'mouseup',
            (evt) => {
                evt.preventDefault();
                this.md = false;
            },
            false
        );
        this.canvas.addEventListener(
            'mousemove',
            (evt) => {
                if (this.md) {
                    evt.preventDefault();
                    var dx = evt.clientX - this.mx,
                        dy = evt.clientY - this.my;
                    this.mx = evt.clientX;
                    this.my = evt.clientY;
                    this.ox += dx;
                    this.oy += dy;
                    this.render();
                }
            },
            false
        );

        this.render();
    }

    clear() {
        this.bitmaps = [];
        this.render();
    }

    render() {
        let sx = Math.floor(-this.ox / chunkSize);
        let ex = Math.floor((-this.ox + this.canvas.width) / chunkSize);
        let sy = Math.floor(-this.oy / chunkSize);
        let ey = Math.floor((-this.oy + this.canvas.height) / chunkSize);
        let dx = ex - sx;
        let dy = ey - sy;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgb(255, 0, 0)';
        for (let x = 0; x <= dx; x++)
            for (let y = 0; y <= dy; y++)
                this.ctx.putImageData(
                    typeof (
                        typeof this.bitmaps[sx + x] === 'undefined'
                            ? (this.bitmaps[sx + x] = [])
                            : this.bitmaps[sx + x]
                    )[sy + y] === 'undefined'
                        ? (this.bitmaps[sx + x][sy + y] = this.chunkFunction(
                              sx + x,
                              sy + y
                          ))
                        : this.bitmaps[sx + x][sy + y],
                    cleanMod(this.ox % chunkSize) + x * chunkSize,
                    cleanMod(this.oy % chunkSize) + y * chunkSize
                );
    }
}
