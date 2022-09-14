/**
 * @class Complex
 * @property {number} real
 * @property {number} imaginary
 */
export default class Complex {
    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    toString() {
        return `${this.real} + ${this.imaginary}i`;
    }

    clone() {
        return new Complex(this.real, this.imaginary);
    }

    static add(a, b) {
        return a.clone().add(b);
    }

    add(other) {
        this.real += other.real;
        this.imaginary += other.imaginary;
    }

    static sub(a, b) {
        return a.clone().sub(b);
    }

    sub(other) {
        this.real -= other.real;
        this.imaginary -= other.imaginary;
    }

    static mul(a, b) {
        return a.clone().mul(b);
    }

    mul(other) {
        return new Complex(
            this.real * other.real - this.imaginary * other.imaginary,
            this.real * other.imaginary + other.real * this.imaginary
        )
    }

    static div(a, b) {
        return a.clone().div(b);
    }

    div(other) {
        const d = Math.pow(other.real, 2) + Math.pow(other.imaginary, 2);
        return new Complex(
            (this.real * other.real + this.imaginary * other.imaginary) / d,
            (other.real * this.imaginary - this.real * other.imaginary) / d
        )
    }
}