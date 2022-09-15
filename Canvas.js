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
        if (el instanceof HTMLDivElement) {
            el.appendChild((this.canvas = document.createElement('canvas')));
            el.appendChild((this.axis = document.createElement('canvas')));
        } else throw new CanvasError('Element not found.');

        this.axis.width = this.canvas.width =
            this.canvas.parentElement.clientWidth;
        this.axis.height = this.canvas.height =
            this.canvas.parentElement.clientHeight;
        this.canvas.parentElement.addEventListener('resize', () => {
            this.axis.width = this.canvas.width =
                this.canvas.parentElement.clientWidth;
            this.axis.height = this.canvas.height =
                this.canvas.parentElement.clientHeight;
            this.render();
        });

        this.ctx = this.canvas.getContext('2d');
        this.axis_ctx = this.axis.getContext('2d');

        this.canvas.style.filter = 'blur(1px) url(#amplify-alpha)';

        this.canvas.parentElement.style.position = 'relative';
        this.axis.style.position = this.canvas.style.position = 'absolute';
        this.axis.style.inset = this.canvas.style.inset = '0';

        this.ox = this.axis.width / 10;
        this.oy = this.axis.height / 10;

        this.md = false;
        this.mx = 0;
        this.my = 0;

        this.chunkFunction = chunkFunction;
        this.bitmaps = [];

        this.axis.addEventListener(
            'mousedown',
            (evt) => {
                evt.preventDefault();
                this.md = true;
                this.mx = evt.clientX;
                this.my = evt.clientY;
            },
            false
        );
        this.axis.addEventListener(
            'mouseup',
            (evt) => {
                evt.preventDefault();
                this.md = false;
            },
            false
        );
        this.axis.addEventListener(
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
        this.axis_ctx.clearRect(0, 0, this.axis.width, this.axis.height);

        var grid_size = 25;
        var x_axis_distance_grid_lines = this.oy / grid_size;
        var off_x = (this.oy % grid_size) / grid_size;
        var y_axis_distance_grid_lines = this.ox / grid_size;
        var off_y = (this.ox % grid_size) / grid_size;

        // no of vertical grid lines
        var num_lines_x = this.axis.height / grid_size;

        // no of horizontal grid lines
        var num_lines_y = this.axis.width / grid_size;

        // Draw grid lines along X-axis
        for (var i = off_x; i <= num_lines_x + off_x; i++) {
            this.axis_ctx.beginPath();
            this.axis_ctx.lineWidth = 1;

            // If line represents X-axis draw in different color
            if (i == x_axis_distance_grid_lines)
                this.axis_ctx.strokeStyle = '#000000';
            else this.axis_ctx.strokeStyle = '#0000001f';

            if (i == num_lines_x) {
                this.axis_ctx.moveTo(0, grid_size * i);
                this.axis_ctx.lineTo(this.axis.width, grid_size * i);
            } else {
                this.axis_ctx.moveTo(0, grid_size * i + 0.5);
                this.axis_ctx.lineTo(this.axis.width, grid_size * i + 0.5);
            }
            this.axis_ctx.stroke();
        }

        // Draw grid lines along Y-axis
        for (i = off_y; i <= num_lines_y + off_y; i++) {
            this.axis_ctx.beginPath();
            this.axis_ctx.lineWidth = 1;

            // If line represents Y-axis draw in different color
            if (i == y_axis_distance_grid_lines)
                this.axis_ctx.strokeStyle = '#000000';
            else this.axis_ctx.strokeStyle = '#0000001f';

            if (i == num_lines_y) {
                this.axis_ctx.moveTo(grid_size * i, 0);
                this.axis_ctx.lineTo(grid_size * i, this.axis.height);
            } else {
                this.axis_ctx.moveTo(grid_size * i + 0.5, 0);
                this.axis_ctx.lineTo(grid_size * i + 0.5, this.axis.height);
            }
            this.axis_ctx.stroke();
        }

        this.axis_ctx.translate(this.ox, this.oy);

        // Ticks marks along the positive X-axis
        for (i = 1; i < num_lines_y - y_axis_distance_grid_lines; i++) {
            this.axis_ctx.beginPath();
            this.axis_ctx.lineWidth = 1;
            this.axis_ctx.strokeStyle = '#000000';

            // Draw a tick mark 6px long (-3 to 3)
            this.axis_ctx.moveTo(grid_size * i + 0.5, -3);
            this.axis_ctx.lineTo(grid_size * i + 0.5, 3);
            this.axis_ctx.stroke();

            // Text value at that point
            this.axis_ctx.font = '9px Arial';
            this.axis_ctx.textAlign = 'start';
            this.axis_ctx.fillText(grid_size * i, grid_size * i - 2, 15);
        }

        // Ticks marks along the negative X-axis
        for (i = 1; i < y_axis_distance_grid_lines; i++) {
            this.axis_ctx.beginPath();
            this.axis_ctx.lineWidth = 1;
            this.axis_ctx.strokeStyle = '#000000';

            // Draw a tick mark 6px long (-3 to 3)
            this.axis_ctx.moveTo(-grid_size * i + 0.5, -3);
            this.axis_ctx.lineTo(-grid_size * i + 0.5, 3);
            this.axis_ctx.stroke();

            // Text value at that point
            this.axis_ctx.font = '9px Arial';
            this.axis_ctx.textAlign = 'end';
            this.axis_ctx.fillText(-grid_size * i, -grid_size * i + 3, 15);
        }

        // Ticks marks along the positive Y-axis
        // Positive Y-axis of graph is negative Y-axis of the canvas
        for (i = 1; i < num_lines_x - x_axis_distance_grid_lines; i++) {
            this.axis_ctx.beginPath();
            this.axis_ctx.lineWidth = 1;
            this.axis_ctx.strokeStyle = '#000000';

            // Draw a tick mark 6px long (-3 to 3)
            this.axis_ctx.moveTo(-3, grid_size * i + 0.5);
            this.axis_ctx.lineTo(3, grid_size * i + 0.5);
            this.axis_ctx.stroke();

            // Text value at that point
            this.axis_ctx.font = '9px Arial';
            this.axis_ctx.textAlign = 'start';
            this.axis_ctx.fillText(-grid_size * i, 8, grid_size * i + 3);
        }

        // Ticks marks along the negative Y-axis
        // Negative Y-axis of graph is positive Y-axis of the canvas
        for (i = 1; i < x_axis_distance_grid_lines; i++) {
            this.axis_ctx.beginPath();
            this.axis_ctx.lineWidth = 1;
            this.axis_ctx.strokeStyle = '#000000';

            // Draw a tick mark 6px long (-3 to 3)
            this.axis_ctx.moveTo(-3, -grid_size * i + 0.5);
            this.axis_ctx.lineTo(3, -grid_size * i + 0.5);
            this.axis_ctx.stroke();

            // Text value at that point
            this.axis_ctx.font = '9px Arial';
            this.axis_ctx.textAlign = 'start';
            this.axis_ctx.fillText(grid_size * i, 8, -grid_size * i + 3);
        }

        this.axis_ctx.translate(-this.ox, -this.oy);

        // canvas

        let sx = Math.floor(-this.ox / chunkSize);
        let ex = Math.floor((-this.ox + this.canvas.width) / chunkSize);
        let sy = Math.floor(-this.oy / chunkSize);
        let ey = Math.floor((-this.oy + this.canvas.height) / chunkSize);
        let dx = ex - sx;
        let dy = ey - sy;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
                              sy + y,
                              chunkSize
                          ))
                        : this.bitmaps[sx + x][sy + y],
                    cleanMod(this.ox % chunkSize) + x * chunkSize,
                    cleanMod(this.oy % chunkSize) + y * chunkSize
                );
    }
}
