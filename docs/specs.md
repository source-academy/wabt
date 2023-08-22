# Specifications
- Temporary specifications file while I figure out the $\LaTeX$-specific things


## Encoding
- All integers (both 32- and 64-bit) are encoded in [LEB128](https://en.wikipedia.org/wiki/LEB128) encoding.
- All floating-point numbers are encoded in the [IEEE 754](https://ieeexplore.ieee.org/document/8766229) representation.
- Given an const (i.e. `i32.const` or `f64.const`), the constant values that follow are assumed to be signed, and therefore are bound between $[-2^{31}-1, 2^{31}-1]$ and $[-2^{63}-1, 2^{63}-1]$ respectively.