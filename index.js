import Canvas, { chunkSize, Img } from './Canvas.js';

const m = 2;
const c = 3;

const f = (x, y) => y == m * x + c

window.c = new Canvas('#main', (x, y) =>
    Img(
        new Array(chunkSize * chunkSize * 4).fill(
            0,
            0,
            chunkSize * chunkSize * 4
        ).map((_, i) => {
            switch (i % 4) {
                case 0:
                    return 0;
                case 1:
                    return 0;
                case 2:
                    return 0;
                case 3:
                    return f(x * chunkSize + Math.floor(i / 4) % chunkSize, y * chunkSize + Math.floor(Math.floor(i / 4) / chunkSize)) * 255;
            }
        })
    )
);
