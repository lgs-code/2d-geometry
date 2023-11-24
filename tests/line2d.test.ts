import { log } from "console";
import {
  Line2d,
  Point2d,
  Rect2d,
  Vector2d,
  Circle2d,
  Ellipse2d,
} from "../build/index";

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

        expect(l.centroid.x).toEqual(center[0]);
        expect(l.centroid.y).toEqual(center[1]);
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

  describe("goesSameDirection", () => {
    const linesList = [
      {
        line1: [0, 0, 0, 5],
        line2: [0, 0, 0, 10],
        same: true,
      },
      {
        line1: [0, 0, 5, 0],
        line2: [0, 0, 0, 5],
        same: false,
      },
    ];

    it.each(linesList)(
      "check if $line1 and $line2 goes in the same direction, expecting $same",
      ({ line1, line2, same }) => {
        const l1 = new Line2d(
          new Point2d(line1[0], line1[1]),
          new Point2d(line1[2], line1[3]),
        );

        const l2 = new Line2d(
          new Point2d(line2[0], line2[1]),
          new Point2d(line2[2], line2[3]),
        );

        expect(l1.goesSameDirection(l2)).toEqual(same);
      },
    );
  });

  describe("angleTo", () => {
    const angleList = [
      {
        line1: [0, 0, 0, 5],
        line2: [0, 0, 0, 10],
        angle: 0,
      },
      {
        line1: [0, 0, 5, 0],
        line2: [0, 0, 0, 5],
        angle: 90,
      },
      {
        line1: [0, 0, 5, 0],
        line2: [0, 0, 0, -5],
        angle: 90,
      },
      {
        line1: [0, 0, 5, 0],
        line2: [0, 0, -5, 0],
        angle: 180,
      },
      {
        line1: [0, 0, 5, 0],
        line2: [0, 0, 5, 5],
        angle: 45,
      },
      {
        line1: [0, 0, 0, 5],
        line2: [0, 5, 5, 0],
        angle: 45,
      },
    ];

    it.each(angleList)(
      "check the angle between $line1 and $line2, expecting $angle°",
      ({ line1, line2, angle }) => {
        const l1 = new Line2d(
          new Point2d(line1[0], line1[1]),
          new Point2d(line1[2], line1[3]),
        );

        const l2 = new Line2d(
          new Point2d(line2[0], line2[1]),
          new Point2d(line2[2], line2[3]),
        );

        expect(l1.angleTo(l2)).toEqual(angle);
      },
    );
  });

  describe("getLineAtAngle", () => {
    const angleList = [
      // horizontal checks
      {
        line1: [0, 0, 5, 0],
        angle: 0,
        length: 10,
        line2: [0, 0, 10, 0],
      },
      {
        line1: [0, 0, 5, 0],
        angle: 180,
        length: 10,
        line2: [0, 0, -10, 0],
      },
      {
        line1: [0, 0, 5, 0],
        angle: 45,
        length: 12,
        line2: [0, 0, 8.485, 8.485],
      },
      // vertical checks
      {
        line1: [0, 0, 0, 5],
        angle: 0,
        length: 10,
        line2: [0, 0, 0, 10],
      },
      {
        line1: [0, 0, 0, 5],
        angle: 180,
        length: 10,
        line2: [0, 0, 0, -10],
      },
      {
        line1: [0, 0, 0, 5],
        angle: 360,
        length: 10,
        line2: [0, 0, 0, 10],
      },
      {
        line1: [0, 0, 0, 5],
        angle: 90,
        length: 5,
        line2: [0, 0, -5, 0],
      },
      {
        line1: [0, 0, 0, 5],
        angle: -90,
        length: 6,
        line2: [0, 0, 6, 0],
      },
      {
        line1: [0, 0, 0, 5],
        angle: 30,
        length: 12,
        line2: [0, 0, -6, 10.392],
      },
      {
        line1: [0, 0, 0, 5],
        angle: -30,
        length: 12,
        line2: [0, 0, 6, 10.392],
      },
      {
        line1: [0, 0, 0, 5],
        angle: 120,
        length: 12,
        line2: [0, 0, -10.392, -6],
      },
      {
        line1: [0, 0, 0, 5],
        angle: 210,
        length: 12,
        line2: [0, 0, 6, -10.392],
      },
      {
        line1: [0, 0, 0, 5],
        angle: -45,
        length: 12,
        line2: [0, 0, 8.485, 8.485],
      },
    ];

    it.each(angleList)(
      "get a line having the given angle to a line",
      ({ line1, angle, length, line2 }) => {
        const l1 = new Line2d(
          new Point2d(line1[0], line1[1]),
          new Point2d(line1[2], line1[3]),
        );

        const l2 = l1.getLineAtAngle(angle, length);

        expect(l2).not.toBe(null);

        expect(l2.p1.x).toEqual(l1.p1.x);
        expect(l2.p1.y).toEqual(l1.p1.y);

        expect(l2.p2.x).toEqual(line2[2]);
        expect(l2.p2.y).toEqual(line2[3]);

        expect(l2.length).toEqual(length);
      },
    );
  });

  describe("isParallelTo", () => {
    const parallelList = [
      { line1: [0, 0, 0, 5], line2: [1, 0, 1, 5], parallel: true },
      { line1: [0, 0, 5, 5], line2: [0, 5, 5, 0], parallel: false },
    ];

    it.each(parallelList)(
      "check if two lines are parallel",
      ({ line1, line2, parallel }) => {
        const l1 = new Line2d(
          new Point2d(line1[0], line1[1]),
          new Point2d(line1[2], line1[3]),
        );

        const l2 = new Line2d(
          new Point2d(line2[0], line2[1]),
          new Point2d(line2[2], line2[3]),
        );

        expect(l1.isParallelTo(l2)).toEqual(parallel);
      },
    );
  });

  describe("isOrthogonalTo", () => {
    const orthogonalList = [
      { line1: [0, 0, 0, 5], line2: [-1, 2, 6, 2], orthogonal: true },
      { line1: [0, 0, 5, 0], line2: [1, 0, 1, 5], orthogonal: true },
      { line1: [0, 0, 5, 5], line2: [1, 0, 1, 5], orthogonal: false },
      { line1: [0, 5, 5, 0], line2: [0, 0, 5, 5], orthogonal: true },
      // both horizontal
      { line1: [0, 0, 5, 0], line2: [1, 1, 5, 1], orthogonal: false },
      // both vertical
      { line1: [0, 0, 0, 5], line2: [1, 1, 1, 6], orthogonal: false },
    ];

    it.each(orthogonalList)(
      "check if two lines are orthogonal",
      ({ line1, line2, orthogonal }) => {
        const l1 = new Line2d(
          new Point2d(line1[0], line1[1]),
          new Point2d(line1[2], line1[3]),
        );

        const l2 = new Line2d(
          new Point2d(line2[0], line2[1]),
          new Point2d(line2[2], line2[3]),
        );

        expect(l1.isOrthogonalTo(l2)).toEqual(orthogonal);
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

  describe("getOrthogonalLineThrough", () => {
    const orhoList = [
      { line: [0, 0, 5, 5], point: [5, 0], check: [2.5, 2.5] },
      { line: [0, 0, 5, 0], point: [2.5, 4], check: [2.5, 0] },
      { line: [0, 0, 0, 5], point: [4, 2.5], check: [0, 2.5] },
    ];

    it.each(orhoList)(
      "get the orthogonal line passing through a point",
      ({ line, point, check }) => {
        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        const p = new Point2d(point[0], point[1]);

        const result = l.getOrthogonalLineThrough(p);

        expect(result).not.toBe(null);
        expect(result.p1.x).toBe(check[0]);
        expect(result.p1.y).toBe(check[1]);
      },
    );
  });

  describe("getOrthogonalLineFrom", () => {
    const orhoList = [
      {
        line: [0, 0, 5, 5],
        point: [2.5, 2.5],
        length: 10,
        check: [-4.57, 9.57],
        clockwise: false,
      },
      {
        line: [0, 0, 5, 0],
        point: [2.5, 0],
        length: 8,
        check: [2.5, 8],
        clockwise: false,
      },
      {
        line: [0, 0, 0, 5],
        point: [0, 2.5],
        length: 6,
        check: [-6, 2.5],
        clockwise: false,
      },
      {
        line: [0, 5, 5, 0],
        point: [2.5, 2.5],
        length: 7.07 / 2,
        check: [5, 5],
        clockwise: false,
      },
      {
        line: [0, 5, 5, 0],
        point: [2.5, 2.5],
        length: 7.07 / 2,
        check: [0, 0],
        clockwise: true,
      },
      {
        line: [5, 0, 0, 5],
        point: [2.5, 2.5],
        length: 7.07,
        check: [-2.5, -2.5],
        clockwise: false,
      },
      {
        line: [5, 0, 0, 5],
        point: [2.5, 2.5],
        length: 7.07,
        check: [7.5, 7.5],
        clockwise: true,
      },
      {
        line: [0, 3, 5, 0],
        point: [2, 2],
        length: 4,
        check: [4.06, 5.43],
        clockwise: false,
      },
    ];

    it("cannot have an orthogonal line when point is not on edge", () => {
      const l = new Line2d(new Point2d(0, 0), new Point2d(0, 5));

      const p = new Point2d(2, 2);

      expect(l.getOrthogonalLineFrom(p)).toBe(null);
    });

    it.each(orhoList)(
      "get the orthogonal line, clockwise $clockwise, from $line starting at a $point, expecting $check",
      ({ line, point, length, check, clockwise }) => {
        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        const p = new Point2d(point[0], point[1]);

        const result = l.getOrthogonalLineFrom(p, length, clockwise)!;

        expect(result).not.toBe(null);
        expect(result.p2.x).toEqual(check[0]);
        expect(result.p2.y).toEqual(check[1]);
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

  const intersectCircleList = [
    {
      center: [0, 0],
      radius: 5,
      line: [-2, 0, 6, 0],
      intersect: true,
      intersectAt: [[5, 0]],
    },
    {
      center: [0, 0],
      radius: 5,
      line: [5, -2, 5, 10],
      intersect: true,
      intersectAt: [[5, 0]],
    },
    {
      center: [0, 0],
      radius: 5,
      line: [10, 3, 12, 15],
      intersect: false,
      intersectAt: [],
    },
  ];

  const intersectEllipseList = [
    {
      center: [0, 0],
      axis: [5, 3],
      line: [-5, 0, 0, 0],
      intersect: true,
      intersectAt: [[-2.5, 0]],
    },
    {
      center: [0, 0],
      axis: [5, 3],
      line: [0, -3, 0, 3],
      intersect: true,
      intersectAt: [
        [0, -1.5],
        [0, 1.5],
      ],
    },
    {
      center: [0, 0],
      axis: [5, 3],
      line: [-5, 0, 0, 5],
      intersect: false,
      intersectAt: [],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectLineList)(
      "check if two lines intersect $line1 / $line2, expecting $intersect",
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

    it.each(intersectCircleList)(
      "check if a line intersects with a circle",
      ({ center, radius, line, intersect }) => {
        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        const c = new Circle2d(new Point2d(center[0], center[1]), radius);

        expect(l.doesIntersect(c)).toEqual(intersect);
      },
    );

    it.each(intersectEllipseList)(
      "check if a line intersects with an ellipse",
      ({ center, axis, line, intersect }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        expect(l.doesIntersect(e)).toEqual(intersect);
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

        expect(points.length).toEqual(intersectAt.length);

        expect(
          points.length > 0 &&
            points.every((p, i) => {
              return p.x === intersectAt[i][0] && p.y === intersectAt[i][1];
            }),
        ).toEqual(intersect);
      },
    );
  });
});
