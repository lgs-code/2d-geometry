import { Line2d, Point2d, Vector2d } from "../dist/index";

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
      "rotates a point around another point",
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

  const intersectList = [
    {
      point1: [0, 0],
      point2: [5, 5],
      point3: [0, 5],
      point4: [5, 0],
      intersect: true,
      intersectAt: [[2.5, 2.5]],
    },
    {
      point1: [0, 0],
      point2: [5, 5],
      point3: [1, 0],
      point4: [6, 5],
      intersect: false,
      intersectAt: [],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectList)(
      "check if two lines intersect",
      ({ point1, point2, point3, point4, intersect }) => {
        const l1 = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );

        const l2 = new Line2d(
          new Point2d(point3[0], point3[1]),
          new Point2d(point4[0], point4[1]),
        );

        expect(l1.doesIntersect(l2)).toEqual(intersect);
      },
    );
  });

  describe("getIntersectionPoints", () => {
    it.each(intersectList)(
      "get intersection points",
      ({ point1, point2, point3, point4, intersect, intersectAt }) => {
        const l1 = new Line2d(
          new Point2d(point1[0], point1[1]),
          new Point2d(point2[0], point2[1]),
        );

        const l2 = new Line2d(
          new Point2d(point3[0], point3[1]),
          new Point2d(point4[0], point4[1]),
        );

        var points = l1.getIntersectionPoints(l2);

        expect(
          points.length > 0 &&
            points.every(
              (v, i) => v.x === intersectAt[i][0] && v.y === intersectAt[i][1],
            ),
        ).toBe(intersect);
      },
    );
  });
});
