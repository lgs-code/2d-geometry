# 2d-geometry

2d-geometry is a (yet another) library providing a bunch of classes and geometry operations in 2d space.

The main concern behind this library is to aggregate at some point, as many neat computational features that we can do for basic shapes in 2d space as possible.

This library is not intented to be used as-is, but more as a toolkit in your own applications.

## How to use it

For example, image you'd like to get the area of a circle, you could use the following code :

    import { Circle2d, Point2d }  from "@lgs-code/2d-geometry"; 

    const circle = new Circle2d(new Point2d(10, 10), 33);

    // will output 3421.19
    console.log(circle.area);

Another example could be you'd like to get intersection points between an ellipse and a rectangle, you could use the following code :

    import { Rect2d, Ellipse2d }  from "@lgs-code/2d-geometry"; 

    const rect = new Rect2d(new Point2d(0, 0), 150, 30);
    const ellipse = new Ellipse2d(new Point2d(20, 10), 100, 60);

    // will output [ Point2d { x: 67.14, y: 0 }, Point2d { x: 57.27, y: 30 } ]
    const intersections = rect.getIntersectionPoints(ellipse);

Fairly simple, right?

## Documentation

For the list of of available classes and features, please review the documentation [here](https://lgs-code.github.io/2d-geometry/).

## Tools

The tools used in this library are :

- [TypeScript](https://www.typescriptlang.org/) => mostly for configuring compiler options
- [ESLint](https://eslint.org/docs/latest/) => code rules and formatters
- [Prettier](https://prettier.io/) => code formatting rules
- [Rollup](https://rollupjs.org/) => to create bundles in various format like UMD, Common Js and ES Modules
- [Jest]() => writing and executing unit tests
- [TypeDoc](https://typedoc.org/) => generating the documentation

## Contribution

Feel free to contribute by adding new features or shapes :)
