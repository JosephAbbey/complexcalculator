export class CoordinateError extends Error {}

/**
 * @class Coordinate
 * Base class for a coordinate of any type.
 * @property {number} x
 * @property {number} y
 * @property {number} t
 * @property {number} r
 */
export default class Coordinate {
    static Cartesian(x, y) {
        return new Cartesian(x, y);
    }
    static Polar(t, r) {
        return new Polar(t, r);
    }

    get x() {
        throw new CoordinateError("Cannot access `x` on a non Cartesian Coordinate.");
    }
    get y() {
        throw new CoordinateError("Cannot access `y` on a non Cartesian Coordinate.");
    }
    get t() {
        throw new CoordinateError("Cannot access `t` on a non Polar Coordinate.");
    }
    get r() {
        throw new CoordinateError("Cannot access `r` on a non Polar Coordinate.");
    }
}

/**
 * @class Cartesian
 * @extends Coordinate
 * @property {number} x
 * @property {number} y
 * @property {number} t Does not exist on this type of coordinate
 * @property {number} r Does not exist on this type of coordinate
 */
export class Cartesian extends Coordinate {
    Polar = () => new Polar(Math.atan2(this.y, this.x), Math.sqrt(this.x + this.y));

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
}

/**
 * @class Polar
 * @extends Coordinate
 * @property {number} x Does not exist on this type of coordinate
 * @property {number} y Does not exist on this type of coordinate
 * @property {number} t
 * @property {number} r
 */
export class Polar extends Coordinate {
    Cartesian = () => new Cartesian(this.r * Math.cos(this.t), this.r * Math.sin(this.t));

    constructor(t, r) {
        this._t = t;
        this._r = r;
    }

    get t() {
        return this._t;
    }
    get r() {
        return this._r;
    }
}
