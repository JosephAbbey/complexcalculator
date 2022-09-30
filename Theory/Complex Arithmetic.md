# Fundamental Complex Arithmetic

Given two complex numbers $z_1 = x_1 + iy_1$ and $z_2 = x_2 + iy_2$, we can define our complex arithmetic by applying the arithmetic from the real plane. We shall first define the arithmetic of addition, subtraction, and multiplication before taking a detour to some other useful pieces of complex arithmetic which are necessary in deriving complex division.

## Addition

$$
z_1 + z_2 \equiv (x_1 + iy_1) + (x_2 + iy_2) \equiv (x_1 + x_2) + i(y_1 + y_2)
$$

## Subtraction

$$
z_1 + z_2 \equiv (x_1 + iy_1) - (x_2 + iy_2) \equiv (x_1 - x_2) + i(y_1 - y_2)
$$

## Multiplication

$$
z_1 z_2 \equiv (x_1 + iy_1)(x_2 + iy_2) \equiv x_1 x_2 + i x_1 y_2 + i x_2 y_1 - y_1 y_2 \equiv (x_1 x_2 - y_1 y_2) + i(x_1 y_2 + y_1 x_2) 
$$

## Complex Conjugates

The complex conjugate of a complex number $z = x + iy$ (denoted $\overline{z}$) is a complex number with a real component equal to that of $z$ and an imaginary component opposite to that of $z$.

$$
\overline{z} = x - iy
$$

## Functions for the Real and Imaginary Part

We can define functions for the real and imaginary parts of a complex number using our new idea of a complex conjugate as follows.

$$
\frac{z + \overline{z}}{2} \equiv \frac{(x + iy) + (x - iy)}{2} \equiv \frac{2x}{2} \equiv x \equiv \operatorname{Re}(z)
$$
$$
\frac{z - \overline{z}}{2i} \equiv \frac{(x + iy) - (x - iy)}{2i} \equiv \frac{2iy}{2i} \equiv y \equiv \operatorname{Im}(z)
$$

## Magnitude (Absolute Value)

The absolute value of a complex number $z$ (denoted $|z|$) is a positive real number ($|z| \in \mathbb{R}^+_0$) which is the distance from the origin to the point if plotted with an Argand Diagram.

$$
\sqrt{z \overline{z}} \equiv \sqrt{(x + iy)(x - iy)} \equiv \sqrt{x^2 + ixy - ixy - (iy)^2} \equiv \sqrt{x^2 + y^2}
$$

We can see that this last version is the formula for the distance from the origin to some point $(x, y)$ and is thus what we want. Therefore,

$$
\sqrt{z \overline{z}} \equiv \sqrt{x^2 + y^2} \equiv |z|
$$

## Division

$$
\frac{z_1}{z_2} \equiv \frac{z_1 \overline{z_2}}{z_2 \overline{z_2}} \equiv \frac{(x_1 + iy_1)(x_2 - iy_2)}{|z_2|^2} \equiv \frac{x_1 x_2 - i x_1 y_2 + i y_1 x_2 - i^2 y_1 y_2}{|z_2|^2} \equiv \frac{(x_1 x_2 + y_1 y_2) + i(x_2 y_1 - x_1 y_2)}{|z_2|^2} \equiv \frac{x_1 x_2 + y_1 y_2}{|z_2|^2} + i\frac{x_2 y_1 - x_1 y_2}{|z_2|^2}
$$

## Roots Using Polar Form

Let $z = re^{i\theta + 2k\pi}$ where $k \in \mathbb{Z}$. We know that the $n^{\textrm{th}}$ root of $z$, $\sqrt[n]{z}$, is the same as $z^{\frac{1}{n}} = (re^{i\theta})^{\frac{1}{n}} = r^{\frac{1}{n}}e^{i\frac{\theta + 2k\pi}{n}}$. Thus,

$$
\sqrt[n]{z} = \sqrt[n]{r}e^{i\phi}, \quad \phi := \frac{\theta + 2k\pi}{n}, \quad k \in [0, n).
$$

In the case of square roots, this becomes

$$
\sqrt{z} = \sqrt{r}e^{i\frac{\theta}{2}}, \sqrt{z} = \sqrt{r}e^{i\theta}.
$$

Which can be simplified to the form

$$
\sqrt{z} = \pm[\sqrt{\frac{1}{2}(|z| + \operatorname{Re} z)} + (\operatorname{sign}(\operatorname{Im} z))i\sqrt{\frac{1}{2}(|z| - \operatorname{Re} z)}].
$$
