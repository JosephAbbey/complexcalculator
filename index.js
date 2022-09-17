import Canvas, { Img } from './Canvas.js';

// g.func()({ x: 0, y: 0, '=': eq });

const to_func = (editor, vars) =>
    eval(
        [...vars.keys()].map((v) => `const ${v} = ${vars.get(v)};`).join("") +
        'const sqrt=Math.sqrt;const sin=Math.sin;const cos=Math.cos;const tan=Math.tan;const log=Math.log;' +
        `const eq=(a,b)=>Math.abs(a-b)<=${editor.threshold}?(${editor.threshold}-Math.abs(a-b))/${editor.threshold}:0;` +
        `const lt=(a,b)=>Number(a<b);` +
        `const gt=(a,b)=>Number(b>a);` +
        '(x, y)=>' +
        editor.guppy
            .text()
            .replaceAll('^', '**')
            .replace(/(.+)=(.+)/g, 'eq($1,$2)')
            .replace(/(.+)<(.+)/g, 'lt($1,$2)')
            .replace(/(.+)>(.+)/g, 'gt($1,$2)')
    );

const state = {
    threshold: 250,
    editors: [],
    graphs: [],
    values: [],
    equations: [],
};

state.editors.push({
    guppy: new Guppy('guppy-0'),
    function: () => 0,
    threshold: 255,
    colour: [0, 0, 0],
    type: "graph"
});
state.editors[0].guppy.import_text('x^2+y^2=100^2');
state.editors[0].guppy.activate();
state.editors[0].function = to_func(state.editors[0], new Map());
state.graphs.push(state.editors[0]);

// state.editors.push({
//     input: document.getElementById("value-1"),
//     value: 1,
//     name: "a",
//     type: "value"
// });
// state.values.push(state.editors[1]);

// state.editors.push({
//     guppy: new Guppy('guppy-2'),
//     value: 2,
//     name: "b",
//     type: "equation"
// });
// state.editors[2].guppy.import_text('2*a');
// state.editors[2].guppy.activate();
// state.equations.push(state.editors[2]);

const bAverage = (x) => {
    const y = x.reduce((a, b) => (isNaN(b) ? a : [b + a[0], a[1] + 1]), [0, 0]);
    return y[1] === 0 ? 255 : y[0] / y[1];
};

const zeroNaN = (x) => (x === 0 ? NaN : x);

const canvas = new Canvas('#main', (x, y, chunkSize) => {
    const a = [];

    const colours = state.graphs.map((editor) => [
        editor.colour[0],
        editor.colour[1],
        editor.colour[2],
    ]);

    for (let ay = 0; ay < chunkSize; ay++) {
        for (let ax = 0; ax < chunkSize; ax++) {
            const px = x * chunkSize + ax;
            const py = -(y * chunkSize + ay);
            const values = state.graphs.map((editor) => {
                try {
                    return zeroNaN(editor.function(px, py))
                } catch {
                    return NaN
                }
            }
            );
            a.push(
                bAverage(state.graphs.map((_, i) => colours[i][0] * values[i]))
            );
            a.push(
                bAverage(state.graphs.map((_, i) => colours[i][1] * values[i]))
            );
            a.push(
                bAverage(state.graphs.map((_, i) => colours[i][2] * values[i]))
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

const render = () => {
    const vars = new Map();

    state.values.forEach((editor) => {
        vars.set(editor.name, editor.value = editor.input.value);
    });

    let equationsToDo = state.equations.length;
    for (var i = 0; equationsToDo > 0 && i < 20; i++) {
        state.equations.forEach((editor) => {
            try {
                vars.set(editor.name, editor.value = to_func(editor, vars)());
                equationsToDo--;
            } catch { }
        });
    }

    state.graphs.forEach((editor, i) => {
        editor.function = to_func(editor, vars);
        editor.threshold = document.querySelector('#threshold-' + i).value;
        editor.colour = parseHex(
            document.querySelector('#colour-' + i).value
        );
    });

    canvas.clear();
};

document.addEventListener('keydown', e =>
    e.ctrlKey && e.key === 's' &&
    (e.preventDefault(),
        render())
);
document.querySelector('#render').addEventListener(
    'click',
    render
);

document.querySelector('#new_graph').addEventListener('click', () => {
    const e = document.createElement('div');
    e.id = 'editor-' + state.editors.length;
    e.className = "graph";

    e.innerHTML = `<div id="guppy-${state.editors.length}" class="e"></div>
<div class="c">
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
            type: "graph"
        }) - 1;
    state.editors[i].g.import_text('y=2x');
    state.editors[i].g.activate();
    state.editors[i].f = to_func(state.editors[0]);

    state.graphs.push(state.editors[i]);
});

document.querySelector('#new_value').addEventListener('click', function new_value() {
    const name = prompt("Variable name (1 character): ");
    if (!name) return;
    if (!/[a-zA-Z]/.test(name) || state.editors.some((editor) => editor.name === name ? true : undefined)) return new_value();

    const e = document.createElement('div');
    e.id = 'editor-' + state.editors.length;
    e.className = "value";

    e.innerHTML = `<div class="e">
    <label for="value-${state.editors.length}">${name} =</label>
    <input
        type="number"
        name="value-${state.editors.length}"
        id="value-${state.editors.length}"
        value="1"
    />
</div>`;

    document.querySelector('#editor').appendChild(e);

    const i =
        state.editors.push({
            input: document.getElementById("value-" + state.editors.length),
            value: 1,
            name,
            type: "value"
        }) - 1;

    state.values.push(state.editors[i])
});

document.querySelector('#new_equation').addEventListener('click', function new_equation() {
    const name = prompt("Variable name (1 character): ");
    if (!name) return;
    if (!/[a-zA-Z]/.test(name) || state.editors.some((editor) => editor.name === name ? true : undefined)) return new_equation();

    const e = document.createElement('div');
    e.id = 'editor-' + state.editors.length;
    e.className = "graph";

    e.innerHTML = `<div class="e">
    <label for="guppy-${state.editors.length}">${name} =</label>
    <div id="guppy-${state.editors.length}"></div>
</div>`;

    document.querySelector('#editor').appendChild(e);

    const i =
        state.editors.push({
            guppy: new Guppy('guppy-' + state.editors.length),
            value: 2,
            name,
            type: "equation"
        }) - 1;
    state.editors[i].guppy.import_text('2*a');
    state.editors[i].guppy.activate();

    state.equations.push(state.editors[i]);
});

const divider = document.querySelector('#divider');

divider.addEventListener('mousedown', (e) => {
    e.target.mousedown = true;
});
window.addEventListener('mouseup', (e) => {
    e.target.mousedown = false;
});
window.addEventListener('mousemove', (e) => {
    divider.mousedown &&
        ((document.querySelector('#editor').style.width =
            e.screenX - divider.clientWidth / 2 + 'px'),
            canvas.resize());
});
