import { log } from "console";
import {
  Ellipse2d,
  Point2d,
  Circle2d,
  Polygon2d,
  Line2d,
  Vector2d,
} from "../build/index";

describe("Ellipse2d", () => {
  const ellipseList = [
    {
      center: [0, 0],
      axis: [5, 3],
      area: 11.78,
      perimeter: 12.95,
      eccentricity: 2,
    },
    {
      center: [7, 9],
      axis: [10, 4],
      area: 31.42,
      perimeter: 23.93,
      eccentricity: 4.58,
    },
    {
      center: [0, 27],
      axis: [8, 7],
      area: 43.98,
      perimeter: 23.61,
      eccentricity: 1.94,
    },
  ];

  describe("ctor", () => {
    it.each(ellipseList)(
      "creates an ellipse with proper coordinates",
      ({ center, axis }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        expect(e.center.x).toEqual(center[0]);
        expect(e.center.y).toEqual(center[1]);
        expect(e.width).toEqual(axis[0]);
        expect(e.height).toEqual(axis[1]);
      },
    );
  });

  describe("props", () => {
    it.each(ellipseList)(
      "check area, perimeter, focus points",
      ({ center, axis, area, perimeter, eccentricity }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        expect(e.area).toEqual(area);
        expect(e.perimeter).toEqual(perimeter);
        expect(e.eccentricity).toEqual(eccentricity);

        const f1 = e.f1;
        expect(f1.x).toEqual(center[0] - eccentricity);
        expect(f1.y).toEqual(center[1]);

        const f2 = e.f2;
        expect(f2.x).toEqual(center[0] + eccentricity);
        expect(f2.y).toEqual(center[1]);
      },
    );
  });

  describe("translate", () => {
    const vectorList = [
      { center: [0, 0], axis: [5, 3], vector: [25, 0] },
      { center: [0, 0], axis: [5, 3], vector: [0, 37] },
    ];

    it.each(vectorList)(
      "moves an ellipse using a vector",
      ({ center, axis, vector }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );
        const v = new Vector2d(vector[0], vector[1]);

        e.translate(v);

        expect(e.center.x).toEqual(center[0] + vector[0]);
        expect(e.center.y).toEqual(center[1] + vector[1]);
      },
    );
  });

  describe("rotate", () => {
    const rotationList = [
      {
        center: [0, 0],
        axis: [5, 3],
        origin: [0, 0],
        angle: 0,
        result: [0, 0],
      },
      {
        center: [0, 0],
        axis: [5, 3],
        origin: [0, 0],
        angle: 360,
        result: [0, 0],
      },
      {
        center: [5, 5],
        axis: [5, 3],
        origin: [0, 0],
        angle: 90,
        result: [-5, 5],
      },
    ];

    it.each(rotationList)(
      "rotates an ellipse around another point",
      ({ center, axis, origin, angle, result }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        const rp = new Point2d(origin[0], origin[1]);

        if (origin.every((v, i) => v === 0)) {
          e.rotate(angle);
        } else {
          e.rotate(angle, rp);
        }

        expect(e.center.x).toEqual(result[0]);
        expect(e.center.y).toEqual(result[1]);
      },
    );
  });

  describe("isOnEdge", () => {
    const pointList = [
      { center: [0, 0], axis: [5, 3], check: [0, 1.5], inside: true },
      { center: [0, 0], axis: [5, 3], check: [3, 3], inside: false },
      { center: [1, 1], axis: [5, 3], check: [3.5, 1], inside: true },
    ];

    it.each(pointList)(
      "check if a point is stricly on the edge of an ellipse",
      ({ center, axis, check, inside }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );
        const p = new Point2d(check[0], check[1]);

        expect(e.isOnEdge(p)).toEqual(inside);
      },
    );
  });

  describe("contains", () => {
    const pointList = [
      { center: [0, 0], axis: [5, 3], check: [0, 0], inside: true },
      { center: [0, 0], axis: [5, 3], check: [3, 3], inside: false },
      { center: [1, 1], axis: [5, 3], check: [2.5, 1.5], inside: true },
      { center: [1, 1], axis: [5, 3], check: [0, 0], inside: true },
    ];

    it.each(pointList)(
      "check if a point $check is contained inside an ellipse $center / $axis",
      ({ center, axis, check, inside }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );
        const p = new Point2d(check[0], check[1]);

        expect(e.contains(p)).toEqual(inside);
      },
    );
  });

  const intersectLineList = [
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

  const intersectPolygonList = [
    {
      center: [0, 0],
      axis: [5, 3],
      polygon: [
        [-4, -4],
        [4, -4],
        [4, 4],
        [-4, 4],
      ],
      intersect: false,
      intersectAt: [],
    },
    {
      center: [0, 0],
      axis: [5, 3],
      polygon: [
        [-2, -1],
        [2, -1],
        [2, 1],
        [-2, 1],
      ],
      intersect: true,
      intersectAt: [
        [-1.86, -1],
        [1.86, -1],
        [2, -0.9],
        [2, 0.9],
        [1.86, 1],
        [-1.86, 1],
        [-2, 0.9],
        [-2, -0.9],
      ],
    },
  ];

  const intersectCircleList = [
    {
      center: [0, 0],
      axis: [5, 3],
      circle: [0, 0, 3],
      intersect: false,
      intersectAt: [],
    },
    {
      center: [0, 0],
      axis: [5, 3],
      circle: [10, 10, 5],
      intersect: false,
      intersectAt: [],
    },
    {
      center: [100, 100],
      axis: [100, 60],
      circle: [150, 100, 25],
      intersect: true,
      intersectAt: [
        [136.08, 120.77],
        [136.08, 79.23],
      ],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectLineList)(
      "check if an ellipse intersects with a line",
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

        expect(e.doesIntersect(l)).toEqual(intersect);
      },
    );

    it.each(intersectPolygonList)(
      "check if an ellipse intersects with a polygon",
      ({ center, axis, polygon, intersect }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        const vertices = polygon.map((p) => new Point2d(p[0], p[1]));

        const p = new Polygon2d(vertices);

        expect(e.doesIntersect(p)).toEqual(intersect);
      },
    );

    it.each(intersectCircleList)(
      "check if an ellipse intersects with a circle",
      ({ center, axis, circle, intersect }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        expect(e.doesIntersect(c)).toEqual(intersect);
      },
    );
  });

  describe("getIntersectionPoints", () => {
    it.each(intersectLineList)(
      "get intersection points with a line",
      ({ center, axis, line, intersect, intersectAt }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );
        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        var points = e.getIntersectionPoints(l);

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
      "get intersection points with a polygon",
      ({ center, axis, polygon, intersect, intersectAt }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        const vertices = polygon.map((p) => new Point2d(p[0], p[1]));

        const p = new Polygon2d(vertices);

        var points = e.getIntersectionPoints(p);

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
      ({ center, axis, circle, intersect, intersectAt }) => {
        const e = new Ellipse2d(
          new Point2d(center[0], center[1]),
          axis[0],
          axis[1],
        );

        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        var points = e.getIntersectionPoints(c);

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
