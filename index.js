import Canvas, { Img } from './Canvas.js';

const threshold = 100;
const eq = (a, b) => Math.abs(a - b) <= threshold;

const f = (x, y) => eq(x ** 2 + y ** 2, 100 ** 2);
// const f = (x, y) => eq(y, x);

window.c = new Canvas('#main', (x, y, chunkSize) =>
    Img(
        new Array(chunkSize * chunkSize * 4)
            .fill(0, 0, chunkSize * chunkSize * 4)
            .map((_, i) => {
                switch (i % 4) {
                    case 0:
                        return 0;
                    case 1:
                        return 0;
                    case 2:
                        return 0;
                    case 3:
                        return (
                            f(
                                x * chunkSize + (Math.floor(i / 4) % chunkSize),
                                -(
                                    y * chunkSize +
                                    Math.floor(Math.floor(i / 4) / chunkSize)
                                )
                            ) * 255
                        );
                }
            })
    )
);
