import { Line2d, Point2d, Rect2d, Vector2d } from "../dist/index";

describe("Line2d", () => {
  const lineList = [
    { point1: [0, 0], point2: [5, 5], center: [2.5, 2.5], length: 7.07 },
    { point1: [7, 9], point2: [-3, 19], center: [2, 14], length: 14.14 },
    { point1: [0, 27], point2: [3, 45], center: [1.5, 36], length: 18.25 },
  ];

  describe("ctor", () => {
    it.each(lineList)(
      "creates a line with proper coordinates",
      ({ point1, point2 }) => {
        const l = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );

        expect(l.p1.x).toEqual(point1[0]);
        expect(l.p1.y).toEqual(point1[1]);
        expect(l.p2.x).toEqual(point2[0]);
        expect(l.p2.y).toEqual(point2[1]);
      },
    );
  });

  describe("props", () => {
    it.each(lineList)(
      "check length and center",
      ({ point1, point2, center, length }) => {
        const l = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );

        expect(l.length).toEqual(length);
        expect(l.p1.distanceTo(l.p2)).toEqual(length);

        expect(l.center.x).toEqual(center[0]);
        expect(l.center.y).toEqual(center[1]);
      },
    );
  });

  describe("clone", () => {
    it.each(lineList)("clones a line", ({ point1, point2 }) => {
      const l1 = new Line2d(
        new Point2d(point1[0], point1[1]),
        new Point2d(point2[0], point2[1]),
      );

      const l2 = l1.clone();

      expect(l1.p1.x).toEqual(l2.p1.x);
      expect(l1.p1.y).toEqual(l2.p1.y);
      expect(l1.p2.x).toEqual(l2.p2.x);
      expect(l1.p2.y).toEqual(l2.p2.y);

      expect(l1.p1 === l2.p1).toBe(false);
      expect(l1.p2 === l2.p2).toBe(false);

      expect(l1 !== l2).toBe(true);
      expect(l1 === l2).toBe(false);
    });
  });

  describe("translate", () => {
    const vectorList = [
      { point1: [0, 0], point2: [5, 5], vector: [25, 0] },
      { point1: [7, 9], point2: [-3, 19], vector: [0, 37] },
    ];

    it.each(vectorList)(
      "moves a line using a vector",
      ({ point1, point2, vector }) => {
        const l = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );
        const v = new Vector2d(vector[0], vector[1]);

        l.translate(v);

        expect(l.p1.x).toEqual(point1[0] + vector[0]);
        expect(l.p1.y).toEqual(point1[1] + vector[1]);
        expect(l.p2.x).toEqual(point2[0] + vector[0]);
        expect(l.p2.y).toEqual(point2[1] + vector[1]);
      },
    );
  });

  describe("rotate", () => {
    const rotationList = [
      {
        point1: [0, 0],
        point2: [5, 5],
        origin: [0, 0],
        angle: 0,
        rotate1: [0, 0],
        rotate2: [5, 5],
      },
      {
        point1: [0, 0],
        point2: [5, 5],
        origin: [0, 0],
        angle: 360,
        rotate1: [0, 0],
        rotate2: [5, 5],
      },
      {
        point1: [0, 0],
        point2: [5, 5],
        origin: [0, 0],
        angle: 90,
        rotate1: [0, 0],
        rotate2: [-5, 5],
      },
      {
        point1: [0, 0],
        point2: [5, 5],
        origin: [0, 0],
        angle: 45,
        rotate1: [0, 0],
        rotate2: [0, 7.07],
      },
      {
        point1: [0, 0],
        point2: [5, 5],
        origin: [2.5, 2.5],
        angle: 45,
        rotate1: [2.5, -1.04],
        rotate2: [2.5, 6.04],
      },
    ];

    it.each(rotationList)(
      "rotates a line around another point",
      ({ point1, point2, origin, angle, rotate1, rotate2 }) => {
        const l = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );

        const rp = new Point2d(origin[0], origin[1]);

        if (origin.every((v, i) => v === 0)) {
          l.rotate(angle);
        } else {
          l.rotate(angle, rp);
        }

        expect(l.p1.x).toEqual(rotate1[0]);
        expect(l.p1.y).toEqual(rotate1[1]);
        expect(l.p2.x).toEqual(rotate2[0]);
        expect(l.p2.y).toEqual(rotate2[1]);
      },
    );
  });

  describe("isOnEdge", () => {
    const pointList = [
      { point1: [0, 0], point2: [5, 5], check: [2.5, 2.5], inside: true },
      { point1: [7, 9], point2: [-3, 19], check: [3, 3], inside: false },
    ];

    it.each(pointList)(
      "check if a point is stricly on the line",
      ({ point1, point2, check, inside }) => {
        const l = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );

        const p = new Point2d(check[0], check[1]);

        expect(l.isOnEdge(p)).toEqual(inside);
      },
    );
  });

  const intersectLineList = [
    {
      line1: [0, 0, 5, 5],
      line2: [0, 5, 5, 0],
      intersect: true,
      intersectAt: [[2.5, 2.5]],
    },
    {
      line1: [0, 0, 5, 5],
      line2: [1, 0, 6, 5],
      intersect: false,
      intersectAt: [],
    },
    {
      line1: [0, 0, 5, 5],
      line2: [3, -2, 8, -2],
      intersect: false,
      intersectAt: [],
    },
    {
      line1: [4, 1, 4, 4],
      line2: [0, 0, 5, 0],
      intersect: false,
      intersectAt: [],
    },
  ];

  const intersectRectList = [
    {
      point1: [0, 0],
      point2: [5, 5],
      location: [1, 3],
      width: 10,
      height: 20,
      intersect: true,
      intersectAt: [[3, 3]],
    },
    {
      point1: [0, 0],
      point2: [5, 5],
      location: [3, -2],
      width: 5,
      height: 3,
      intersect: false,
      intersectAt: [],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectLineList)(
      "check if two lines intersect",
      ({ line1, line2, intersect }) => {
        const l1 = new Line2d(
          new Point2d(line1[0], line1[1]),
          new Point2d(line1[2], line1[3]),
        );

        const l2 = new Line2d(
          new Point2d(line2[0], line2[1]),
          new Point2d(line2[2], line2[3]),
        );

        expect(l1.doesIntersect(l2)).toEqual(intersect);
      },
    );

    it.each(intersectRectList)(
      "check if a line intersects with a rectangle",
      ({ point1, point2, location, width, height, intersect }) => {
        const l1 = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );

        const rect1 = new Rect2d(
          new Point2d(location[0], location[1]),
          width,
          height,
        );

        expect(l1.doesIntersect(rect1)).toEqual(intersect);
      },
    );
  });

  describe("getIntersectionPoints", () => {
    it.each(intersectLineList)(
      "get intersection points with a line",
      ({ line1, line2, intersect, intersectAt }) => {
        const l1 = new Line2d(
          new Point2d(line1[0], line1[1]),
          new Point2d(line1[2], line1[3]),
        );

        const l2 = new Line2d(
          new Point2d(line2[0], line2[1]),
          new Point2d(line2[2], line2[3]),
        );

        var points = l1.getIntersectionPoints(l2);

        expect(
          points.length > 0 &&
            points.every((p, i) => {
              return p.x === intersectAt[i][0] && p.y === intersectAt[i][1];
            }),
        ).toBe(intersect);
      },
    );
  });
});
