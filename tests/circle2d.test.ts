import { log } from "console";
import { pointsDoMatch } from "./test-utils";
import {
  Circle2d,
  Point2d,
  Rect2d,
  Polygon2d,
  Line2d,
  Vector2d,
  Arc2d,
  Sector2d,
} from "../build/index";

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

  describe("rotate", () => {
    const rotationList = [
      {
        center: [0, 0],
        radius: 5,
        origin: [0, 0],
        angle: 0,
        result: [0, 0],
      },
      {
        center: [0, 0],
        radius: 5,
        origin: [0, 0],
        angle: 360,
        result: [0, 0],
      },
      {
        center: [5, 5],
        radius: 5,
        origin: [0, 0],
        angle: 90,
        result: [-5, 5],
      },
    ];

    it.each(rotationList)(
      "rotates a circle around another point",
      ({ center, radius, origin, angle, result }) => {
        const c = new Circle2d(new Point2d(center[0], center[1]), radius);

        const rp = new Point2d(origin[0], origin[1]);

        if (origin.every((v, i) => v === 0)) {
          c.rotate(angle);
        } else {
          c.rotate(angle, rp);
        }

        expect(c.center.x).toEqual(result[0]);
        expect(c.center.y).toEqual(result[1]);
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

  const intersectArcList = [
    {
      circle: [2, 0, 4],
      arc: [5, 0, 0, 5, 0, 0],
      intersect: true,
      intersectAt: [[3.25, 3.8]],
    },
  ];

  const intersectSectorList = [
    {
      circle: [2, 0, 4],
      sector: [5, 0, 0, 5, 0, 0],
      intersect: true,
      intersectAt: [
        [3.25, 3.8],
        [0, 3.46],
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

    it.each(intersectArcList)(
      "check if a circle intersects with an arc",
      ({ circle, arc, intersect }) => {
        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);
        const a = new Arc2d(
          new Point2d(arc[0], arc[1]),
          new Point2d(arc[2], arc[3]),
          new Point2d(arc[4], arc[5]),
        );
        expect(c.doesIntersect(a)).toEqual(intersect);
      },
    );

    it.each(intersectArcList)(
      "check if a circle intersects with a sector",
      ({ circle, arc, intersect }) => {
        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);
        const a = new Sector2d(
          new Point2d(arc[0], arc[1]),
          new Point2d(arc[2], arc[3]),
          new Point2d(arc[4], arc[5]),
        );
        expect(c.doesIntersect(a)).toEqual(intersect);
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

        const points = c.getIntersectionPoints(l);

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

        const points = c.getIntersectionPoints(p);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectCircleList)(
      "get intersection points with a circle",
      ({ center, radius, circle, intersect, intersectAt }) => {
        const c1 = new Circle2d(new Point2d(center[0], center[1]), radius);
        const c2 = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        const points = c1.getIntersectionPoints(c2);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectArcList)(
      "get intersection points with an arc",
      ({ circle, arc, intersect, intersectAt }) => {
        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);
        const a = new Arc2d(
          new Point2d(arc[0], arc[1]),
          new Point2d(arc[2], arc[3]),
          new Point2d(arc[4], arc[5]),
        );

        const points = c.getIntersectionPoints(a);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectSectorList)(
      "get intersection points with a sector",
      ({ circle, sector, intersect, intersectAt }) => {
        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);
        const s = new Sector2d(
          new Point2d(sector[0], sector[1]),
          new Point2d(sector[2], sector[3]),
          new Point2d(sector[4], sector[5]),
        );

        const points = c.getIntersectionPoints(s);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );
  });
});
