# Fundamental Real Functions

We shall establish a short list of fundamental real functions which we will then use to establish the complex forms of commonly required functions. Our list of required fundamental real functions is as follows, each of these has a purpose that cannot be fulfilled by any other function:

- $e^x$
- $\cos{x}$
- $\sin{x}$

These are defined for their real cases as follows:

$$e^x = \sum_{n=0}^{\infty}\frac{x^{n}}{n!}$$
$$\cos{x} = \sum_{n=0}^{\infty}\left[(-1)^n \frac{x^{2n}}{(2n)!}\right] \\$$
$$\sin{x} = \sum_{n=0}^{\infty}\left[(-1)^n \frac{x^{2n+1}}{(2n+1)!}\right]$$

We also define $\ln{x}$ for $x \in \mathbb{R}^+$ as this will be all we need to define complex formulae.

$$
\ln{x} = \begin{cases}
\int^x_1\frac{1}{t} dt, & \text{if $x \ge 1$}\\
\int^1_{x^{-1}}\frac{1}{t} dt, & \text{if $0 < x < 1$}
\end{cases}
$$

## Complex Functions from the FRFs

We now define our common mathematical functions for their complex cases where $z = x + iy$ as follows. (Note that these are ordered logically as many of the latter formulae rely on complex functions defined before them. FRFs will have $x$, $y$, or $r$ as their parameter.)

$$e^z = e^x(\cos{y} + i\sin{y})$$
$$\cos{z} = \frac{e^{iz} + e^{-iz}}{2}$$
$$\sin{z} = \frac{e^{iz} - e^{-iz}}{2i}$$
$$\cosh{z} = \frac{e^z + e^{-z}}{2}$$
$$\sinh{z} = \frac{e^z - e^{-z}}{2}$$
$$\operatorname{Ln} z = \ln{|r|} + i\theta \quad (z \ne 0)$$
$$\ln{z} = \operatorname{Ln} z + 2n \pi i \quad (n \in \mathbb{z})$$
$$z^c = e^{c \ln{z}} \quad (c \in \mathbb{C})$$
$$\log_{c}z = \frac{\ln{z}}{\ln{c}} \quad (c \in \mathbb{C})$$
