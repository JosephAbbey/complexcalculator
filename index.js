import Canvas, { Img } from './Canvas.js';

// g.func()({ x: 0, y: 0, '=': eq });

const to_func = (editor) =>
    eval(
        'const sqrt=Math.sqrt;const sin=Math.sin;const cos=Math.cos;const tan=Math.tan;const log=Math.log;' +
            `const eq=(a,b)=>Math.abs(a-b)<=${editor.threshold}?(${editor.threshold}-Math.abs(a-b))/${editor.threshold}:0;` +
            `const lt=(a,b)=>Number(a<b);` +
            `const gt=(a,b)=>Number(b>a);` +
            '(x, y)=>' +
            editor.g
                .text()
                .replaceAll('^', '**')
                .replace(/(.+)=(.+)/g, 'eq($1,$2)')
                .replace(/(.+)<(.+)/g, 'lt($1,$2)')
                .replace(/(.+)>(.+)/g, 'gt($1,$2)')
    );

const state = {
    threshold: 250,
    editors: [],
};

state.editors.push({
    g: new Guppy('guppy-0'),
    f: () => 0,
    threshold: 255,
    colour: [0, 0, 0],
});
state.editors[0].g.import_text('x^2+y^2=100^2');
state.editors[0].g.activate();
state.editors[0].f = to_func(state.editors[0]);

const bAverage = (x) => {
    const y = x.reduce((a, b) => (isNaN(b) ? a : [b + a[0], a[1] + 1]), [0, 0]);
    return y[1] === 0 ? 255 : y[0] / y[1];
};

const zeroNaN = (x) => (x === 0 ? NaN : x);

const canvas = new Canvas('#main', (x, y, chunkSize) => {
    const a = [];

    const colours = state.editors.map((editor) => [
        editor.colour[0],
        editor.colour[1],
        editor.colour[2],
    ]);

    for (let ay = 0; ay < chunkSize; ay++) {
        for (let ax = 0; ax < chunkSize; ax++) {
            const px = x * chunkSize + ax;
            const py = -(y * chunkSize + ay);
            const values = state.editors.map((editor) =>
                zeroNaN(editor.f(px, py))
            );
            a.push(
                bAverage(state.editors.map((_, i) => colours[i][0] * values[i]))
            );
            a.push(
                bAverage(state.editors.map((_, i) => colours[i][1] * values[i]))
            );
            a.push(
                bAverage(state.editors.map((_, i) => colours[i][2] * values[i]))
            );
            a.push(255);
        }
    }

    return Img(a);
});

const parseHex = (hex) => [
    parseInt(hex.substr(1, 2), 16),
    parseInt(hex.substr(3, 2), 16),
    parseInt(hex.substr(5, 2), 16),
];

document.querySelector('#render').addEventListener(
    'click',
    () => (
        state.editors.forEach((editor, i) => {
            editor.f = to_func(editor);
            editor.threshold = document.querySelector('#threshold-' + i).value;
            editor.colour = parseHex(
                document.querySelector('#colour-' + i).value
            );
        }),
        canvas.clear()
    )
);

document.querySelector('#new_editor').addEventListener('click', () => {
    const e = document.createElement('div');
    e.id = 'editor-' + state.editors.length;

    e.innerHTML = `<div id="guppy-${state.editors.length}"></div>
<div>
    <input
        type="number"
        name="threshold-${state.editors.length}"
        id="threshold-${state.editors.length}"
        min="0"
        value="4"
    />
    <input type="color" name="colour-${state.editors.length}" id="colour-${state.editors.length}" />
</div>`;

    document.querySelector('#editor').appendChild(e);

    const i =
        state.editors.push({
            g: new Guppy('guppy-' + state.editors.length),
            f: () => 0,
            threshold: 4,
            colour: [0, 0, 0],
        }) - 1;
    state.editors[i].g.import_text('y=2x');
    state.editors[i].g.activate();
    state.editors[i].f = to_func(state.editors[0]);
});

const divider = document.querySelector('#divider');

divider.addEventListener('mousedown', (e) => {
    e.target.mousedown = true;
});
divider.addEventListener('mouseup', (e) => {
    e.target.mousedown = false;
});
window.addEventListener('mousemove', (e) => {
    divider.mousedown &&
        ((document.querySelector('#editor').style.width =
            e.screenX - divider.clientWidth / 2 + 'px'),
        canvas.resize());
});
