import Canvas, { chunkSize, Img } from './Canvas.js';

window.c = new Canvas('#main', () =>
    Img(
        new Array(chunkSize * chunkSize * 4).fill(
            Math.round(Math.random() * 255),
            0,
            chunkSize * chunkSize * 4
        )
    )
);
