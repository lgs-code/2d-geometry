import { Point2d, Vector2d } from "../dist/index";

describe("Point2d", () => {
  const pointList = [
    [10, 50],
    [0, 50],
    [20, 100],
  ];

  describe("ctor", () => {
    it("creates a point with no coordinates", () => {
      const p = new Point2d();

      expect(p.x).toEqual(0);
      expect(p.y).toEqual(0);
    });

    it.each(pointList)("creates a point with proper coordinates", (x, y) => {
      const p = new Point2d(x, y);

      expect(p.x).toEqual(x);
      expect(p.y).toEqual(y);
    });
  });

  describe("clone", () => {
    it.each(pointList)("clones a point", (x, y) => {
      const p1 = new Point2d(x, y);

      const p2 = p1.clone();

      expect(p1.x).toEqual(p2.x);
      expect(p1.y).toEqual(p2.y);
      expect(p1 !== p2).toBe(true);
      expect(p1 === p2).toBe(false);
    });
  });

  describe("add", () => {
    it.each(pointList)("moves a point when adding coordinates", (x, y) => {
      const p = new Point2d(x, y);

      p.add(new Point2d(x, y));

      expect(p.x).toEqual(x * 2);
      expect(p.y).toEqual(y * 2);
    });
  });

  describe("substract", () => {
    it.each(pointList)(
      "moves a point when substracting coordinates",
      (x, y) => {
        const p = new Point2d(x, y);

        p.substract(new Point2d(y, x));

        expect(p.x).toEqual(x - y);
        expect(p.y).toEqual(y - x);
      },
    );
  });

  describe("multiply", () => {
    it.each(pointList)("moves a point when multiplying coordinates", (x, y) => {
      const p = new Point2d(x, y);
      const scalar = 2.5;

      p.multiply(scalar);

      expect(p.x).toEqual(x * scalar);
      expect(p.y).toEqual(y * scalar);
    });
  });

  describe("divide", () => {
    it.each(pointList)("moves a point when dividing coordinates", (x, y) => {
      const p = new Point2d(x, y);
      const scalar = 1.3;

      p.divide(scalar);

      expect(p.x).toEqual(x / scalar);
      expect(p.y).toEqual(y / scalar);
    });
  });

  describe("translate", () => {
    const vectorList = [
      { point: [10, 0], vector: [25, 0] },
      { point: [0, 5], vector: [0, 37] },
    ];

    it.each(vectorList)("moves a point using a vector", ({ point, vector }) => {
      const p = new Point2d(point[0], point[1]);
      const v = new Vector2d(vector[0], vector[1]);

      p.translate(v);

      expect(p.x).toEqual(point[0] + vector[0]);
      expect(p.y).toEqual(point[1] + vector[1]);
    });
  });

  describe("distanceTo", () => {
    const distanceList = [
      { c1: [10, 0], c2: [25, 0], dist: 15 },
      { c1: [0, 5], c2: [0, 37], dist: 32 },
    ];

    it.each(distanceList)(
      "gives distance between two points",
      ({ c1, c2, dist }) => {
        const p1 = new Point2d(c1[0], c1[1]);
        const p2 = new Point2d(c2[0], c2[1]);

        const distance = p1.distanceTo(p2);

        expect(distance).toEqual(dist);
      },
    );
  });

  describe("rotate", () => {
    const rotationList = [
      { point: [10, 0], origin: [0, 0], angle: 0, r: [10, 0] },
      { point: [10, 0], origin: [0, 0], angle: 360, r: [10, 0] },
      { point: [10, 0], origin: [0, 0], angle: 90, r: [0, 10] },
      { point: [0, 10], origin: [0, 0], angle: -45, r: [7.07, 7.07] },
      { point: [5, 7], origin: [2, 3], angle: -30, r: [6.6, 4.96] },
    ];

    it.each(rotationList)(
      "rotates a point around another point",
      ({ point, origin, angle, r }) => {
        const p = new Point2d(point[0], point[1]);
        const rp = new Point2d(origin[0], origin[1]);

        if (origin.every((v, i) => v === 0)) {
          p.rotate(angle);
        } else {
          p.rotate(angle, rp);
        }

        expect(p.x).toEqual(r[0]);
        expect(p.y).toEqual(r[1]);
      },
    );
  });
});
