import { log } from "console";
import {
  Circle2d,
  Point2d,
  Rect2d,
  Polygon2d,
  Line2d,
  Vector2d,
} from "../dist/index";

describe("Circle2d", () => {
  const circleList = [
    { center: [0, 0], radius: 5, area: 78.54, perimeter: 31.42 },
    { center: [7, 9], radius: 2.5, area: 19.63, perimeter: 15.71 },
    { center: [0, 27], radius: 9.2, area: 265.9, perimeter: 57.81 },
  ];

  describe("ctor", () => {
    it.each(circleList)(
      "creates a circle with proper coordinates",
      ({ center, radius }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);

        expect(c.center.x).toEqual(center[0]);
        expect(c.center.y).toEqual(center[1]);
        expect(c.radius).toEqual(radius);
      },
    );
  });

  describe("props", () => {
    it.each(circleList)(
      "check diameter, area, perimeter",
      ({ center, radius, area, perimeter }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);

        expect(c.diameter).toEqual(radius * 2);
        expect(c.area).toEqual(area);
        expect(c.perimeter).toEqual(perimeter);
      },
    );
  });

  describe("translate", () => {
    const vectorList = [
      { center: [0, 0], radius: 5, vector: [25, 0] },
      { center: [0, 0], radius: 5, vector: [0, 37] },
    ];

    it.each(vectorList)(
      "moves a line using a vector",
      ({ center, radius, vector }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);
        const v = new Vector2d(vector[0], vector[1]);

        c.translate(v);

        expect(c.center.x).toEqual(center[0] + vector[0]);
        expect(c.center.y).toEqual(center[1] + vector[1]);
      },
    );
  });

  describe("isOnEdge", () => {
    const pointList = [
      { center: [0, 0], radius: 5, check: [0, 5], inside: true },
      { center: [0, 0], radius: 5, check: [3, 3], inside: false },
      { center: [1, 1], radius: 5, check: [6, 1], inside: true },
    ];

    it.each(pointList)(
      "check if a point is stricly on the edge of a circle",
      ({ center, radius, check, inside }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);
        const p = new Point2d(check[0], check[1]);

        expect(c.isOnEdge(p)).toEqual(inside);
      },
    );
  });

  describe("contains", () => {
    const pointList = [
      { center: [0, 0], radius: 5, check: [0, 5], inside: true },
      { center: [0, 0], radius: 5, check: [3, 3], inside: true },
      { center: [1, 1], radius: 5, check: [6, 1], inside: true },
      { center: [1, 1], radius: 5, check: [7, 7], inside: false },
    ];

    it.each(pointList)(
      "check if a point is contained inside a circle",
      ({ center, radius, check, inside }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);
        const p = new Point2d(check[0], check[1]);

        expect(c.contains(p)).toEqual(inside);
      },
    );
  });

  const intersectLineList = [
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
    {
      center: [0, 0],
      radius: 5,
      line: [-2, -2, 6, 6],
      intersect: true,
      intersectAt: [[3.54, 3.54]],
    },
    {
      center: [0, 0],
      radius: 5,
      line: [-6, -6, 6, 6],
      intersect: true,
      intersectAt: [
        [3.54, 3.54],
        [-3.54, -3.54],
      ],
    },
  ];

  const intersectPolygonList = [
    {
      center: [0, 0],
      radius: 5,
      polygon: [
        [-2, 0],
        [2, 0],
        [2, 6],
        [-4, 8],
      ],
      intersect: true,
      intersectAt: [
        [2, 4.58],
        [-3, 4],
      ],
    },
  ];

  const intersectCircleList = [
    {
      center: [0, 0],
      radius: 5,
      circle: [0, 0, 3],
      intersect: false,
      intersectAt: [],
    },
    {
      center: [0, 0],
      radius: 5,
      circle: [10, 10, 5],
      intersect: false,
      intersectAt: [],
    },
    {
      center: [0, 0],
      radius: 5,
      circle: [3, 0, 5],
      intersect: true,
      intersectAt: [
        [1.5, 4.77],
        [1.5, -4.77],
      ],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectLineList)(
      "check if a circle intersects with a line",
      ({ center, radius, line, intersect }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);
        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        expect(c.doesIntersect(l)).toEqual(intersect);
      },
    );

    it.each(intersectCircleList)(
      "check if a circle intersects with a circle",
      ({ center, radius, circle, intersect }) => {
        const c1 = new Circle2d(new Point2d(center[0], center[1]), radius);
        const c2 = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        expect(c1.doesIntersect(c2)).toEqual(intersect);
      },
    );
  });

  describe("getIntersectionPoints", () => {
    it.each(intersectLineList)(
      "get intersection points with a line",
      ({ center, radius, line, intersect, intersectAt }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);
        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        var points = c.getIntersectionPoints(l);

        expect(points.length).toEqual(intersectAt.length);

        expect(
          points.length > 0 &&
            points.every((p, i) => {
              return p.x === intersectAt[i][0] && p.y === intersectAt[i][1];
            }),
        ).toEqual(intersect);
      },
    );

    it.each(intersectPolygonList)(
      "get intersection points for $center / $radius with a polygon $polygon",
      ({ center, radius, polygon, intersect, intersectAt }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);

        const vertices = polygon.map((p) => new Point2d(p[0], p[1]));

        const p = new Polygon2d(vertices);

        var points = c.getIntersectionPoints(p);

        expect(points.length).toEqual(intersectAt.length);

        expect(
          points.length > 0 &&
            points.every((p, i) => {
              return p.x === intersectAt[i][0] && p.y === intersectAt[i][1];
            }),
        ).toEqual(intersect);
      },
    );

    it.each(intersectCircleList)(
      "get intersection points with a circle",
      ({ center, radius, circle, intersect, intersectAt }) => {
        const c1 = new Circle2d(new Point2d(center[0], center[1]), radius);
        const c2 = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        var points = c1.getIntersectionPoints(c2);

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
