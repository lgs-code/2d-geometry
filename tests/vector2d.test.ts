import { Vector2d } from "../build/index";

describe("Vector2d", () => {
  const vectorList = [
    [10, 50, 50.99, 78.69],
    [0, 50, 50, 90],
    [20, 100, 101.98, 78.69],
  ];

  describe("ctor", () => {
    it("creates a vector with no coordinates", () => {
      const v = new Vector2d();

      expect(v.x).toEqual(0);
      expect(v.y).toEqual(0);
    });

    it.each(vectorList)("creates a vector with proper coordinates", (x, y) => {
      const v = new Vector2d(x, y);

      expect(v.x).toEqual(x);
      expect(v.y).toEqual(y);
    });
  });

  describe("props", () => {
    it.each(vectorList)("check magnitude and angle", (x, y, m, a) => {
      const v = new Vector2d(x, y);

      expect(v.magnitude).toEqual(m);
      expect(v.angle).toEqual(a);
    });
  });

  describe("statics", () => {
    it.each(vectorList)(
      "create a vector from polar coordinates",
      (x, y, m, a) => {
        const v1 = new Vector2d(x, y);
        const v2 = Vector2d.fromPolarCoordinates(m, a);

        expect(v1.x).toEqual(v2.x);
        expect(v1.y).toEqual(v2.y);
      },
    );
  });

  describe("add", () => {
    it.each(vectorList)("moves a vector when adding coordinates", (x, y) => {
      const v = new Vector2d(x, y);

      v.add(new Vector2d(x, y));

      expect(v.x).toEqual(x * 2);
      expect(v.y).toEqual(y * 2);
    });
  });

  describe("substract", () => {
    it.each(vectorList)(
      "moves a vector when substracting coordinates",
      (x, y) => {
        const v = new Vector2d(x, y);

        v.substract(new Vector2d(y, x));

        expect(v.x).toEqual(x - y);
        expect(v.y).toEqual(y - x);
      },
    );
  });

  describe("multiply", () => {
    it.each(vectorList)(
      "moves a vector when multiplying coordinates",
      (x, y) => {
        const v = new Vector2d(x, y);
        const scalar = 2.5;

        v.multiply(scalar);

        expect(v.x).toEqual(x * scalar);
        expect(v.y).toEqual(y * scalar);
      },
    );
  });

  describe("divide", () => {
    it.each(vectorList)("moves a vector when dividing coordinates", (x, y) => {
      const v = new Vector2d(x, y);
      const scalar = 1.3;

      v.divide(scalar);

      expect(v.x).toEqual(x / scalar);
      expect(v.y).toEqual(y / scalar);
    });
  });

  describe("dot", () => {
    const dotList = [
      { vect1: [2, 3], vect2: [7, 2], dot: 20 },
      { vect1: [6, 1], vect2: [1, 1], dot: 7 },
      // same direction, 45° angle
      { vect1: [5, 0], vect2: [5, 5], dot: 25 },
      // perpendicular, 90° angle
      { vect1: [5, 0], vect2: [0, 5], dot: 0 },
      { vect1: [5, 0], vect2: [0, -5], dot: 0 },
      // opposite direction, 135° angle
      { vect1: [5, 0], vect2: [-5, 5], dot: -25 },
      // pretty close to each other
      { vect1: [5, 0], vect2: [3, 0.5], dot: 15 },
      // pretty nearly perpendicular
      { vect1: [5, 0], vect2: [0.5, 5], dot: 2.5 },
    ];

    it.each(dotList)("computes dot product", ({ vect1, vect2, dot }) => {
      const v1 = new Vector2d(vect1[0], vect1[1]);
      const v2 = new Vector2d(vect2[0], vect2[1]);

      const r = v1.dot(v2);

      expect(r).toEqual(dot);
    });
  });
});
