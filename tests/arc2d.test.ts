import { log } from "console";
import { pointsDoMatch } from "./test-utils";
import {
  Line2d,
  Point2d,
  Rect2d,
  Vector2d,
  Circle2d,
  Ellipse2d,
  Polygon2d,
  Arc2d,
  Sector2d,
} from "../build/index";

describe("Arc2d", () => {
  const arcList = [
    {
      from: [0, 0],
      to: [5, 5],
      center: [0, 5],
      angle: 90,
      length: 7.85,
      circular: true,
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      angle: 90,
      length: 7.85,
      circular: true,
    },
    {
      from: [0, 5],
      to: [5, 0],
      center: [0, 0],
      angle: 90,
      length: 7.85,
      circular: true,
    },
    {
      from: [0, 3],
      to: [7, 0],
      center: [0, 0],
      angle: 90,
      length: 8.46,
      circular: false,
    },
  ];

  describe("ctor", () => {
    it.each(arcList)("creates an arc", ({ from, to, center }) => {
      const a = new Arc2d(
        new Point2d(from[0], from[1]),
        new Point2d(to[0], to[1]),
        new Point2d(center[0], center[1]),
      );

      expect(a.from.x).toEqual(from[0]);
      expect(a.from.y).toEqual(from[1]);
      expect(a.to.x).toEqual(to[0]);
      expect(a.to.y).toEqual(to[1]);
      expect(a.center.x).toEqual(center[0]);
      expect(a.center.y).toEqual(center[1]);
    });
  });

  describe("props", () => {
    it.each(arcList)(
      "check angle, length, etc. using $from, $to, $center",
      ({ from, to, center, angle, length, circular }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        expect(a.isCircular).toEqual(circular);
        expect(a.angle).toEqual(angle);
        expect(a.length).toEqual(length);
      },
    );
  });

  describe("translate", () => {
    const vectorList = [
      { from: [0, 0], to: [5, 5], center: [0, 5], vector: [25, 0] },
    ];

    it.each(vectorList)(
      "moves an arc using a vector",
      ({ from, to, center, vector }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const v = new Vector2d(vector[0], vector[1]);

        a.translate(v);

        expect(a.from.x).toEqual(from[0] + vector[0]);
        expect(a.from.y).toEqual(from[1] + vector[1]);

        expect(a.to.x).toEqual(to[0] + vector[0]);
        expect(a.to.y).toEqual(to[1] + vector[1]);

        expect(a.center.x).toEqual(center[0] + vector[0]);
        expect(a.center.y).toEqual(center[1] + vector[1]);
      },
    );
  });

  describe("rotate", () => {
    const rotationList = [
      {
        from: [0, 0],
        to: [5, 5],
        center: [0, 5],
        origin: [0, 0],
        angle: 0,
        result: [0, 5],
      },
      {
        from: [0, 0],
        to: [5, 5],
        center: [0, 5],
        origin: [0, 0],
        angle: 360,
        result: [0, 5],
      },
      {
        from: [0, 0],
        to: [5, 5],
        center: [0, 5],
        origin: [0, 0],
        angle: 90,
        result: [-5, 0],
      },
    ];

    it.each(rotationList)(
      "rotates an arc around another point",
      ({ from, to, center, origin, angle, result }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const rp = new Point2d(origin[0], origin[1]);

        if (origin.every((v, i) => v === 0)) {
          a.rotate(angle);
        } else {
          a.rotate(angle, rp);
        }

        expect(a.center.x).toEqual(result[0]);
        expect(a.center.y).toEqual(result[1]);
      },
    );
  });

  describe("isOnEdge", () => {
    const pointList = [
      {
        from: [5, 0],
        to: [0, 5],
        center: [0, 0],
        check: [0, 5],
        inside: true,
      },
      {
        from: [5, 0],
        to: [0, 5],
        center: [0, 0],
        check: [3, 3],
        inside: false,
      },
      {
        from: [5, 0],
        to: [0, 5],
        center: [0, 0],
        check: [-5, 0],
        inside: false,
      },
    ];

    it.each(pointList)(
      "check if a point $check is stricly on the edge of an arc",
      ({ from, to, center, check, inside }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );
        const p = new Point2d(check[0], check[1]);

        expect(a.isOnEdge(p)).toEqual(inside);
      },
    );
  });

  const intersectLineList = [
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      line: [-2, -2, 7, 7],
      intersect: true,
      intersectAt: [[3.54, 3.54]],
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      line: [-2, -2, 2, 2],
      intersect: false,
      intersectAt: [],
    },
  ];

  const intersectPolygonList = [
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      polygon: [
        [-1, 0],
        [1, -1],
        [6, 3],
        [3, 5],
      ],
      intersect: true,
      intersectAt: [
        [4.62, 1.9],
        [2.48, 4.34],
      ],
    },
  ];

  const intersectCircleList = [
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      circle: [0, 0, 3],
      intersect: false,
      intersectAt: [],
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      circle: [2, 0, 4],
      intersect: true,
      intersectAt: [[3.25, 3.8]],
    },
  ];

  const intersectEllipseList = [
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      ellipse: [0, 0, 3, 2],
      intersect: false,
      intersectAt: [],
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      ellipse: [2, 2, 8, 4],
      intersect: true,
      intersectAt: [
        [3.1, 3.92],
        [4.96, 0.65],
      ],
    },
  ];

  const intersectArcList = [
    {
      arc1: [5, 0, 0, 5, 0, 0],
      arc2: [-1, 0, 4, 5, 4, 0],
      intersect: true,
      intersectAt: [[2, 4.58]],
    },
  ];

  const intersectSectorList = [
    {
      arc: [5, 0, 0, 5, 0, 0],
      sector: [-1, 0, 4, 5, 4, 0],
      intersect: true,
      intersectAt: [
        [2, 4.58],
        [4, 3],
      ],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectLineList)(
      "check if an arc intersects with a line",
      ({ from, to, center, line, intersect }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        expect(a.doesIntersect(l)).toEqual(intersect);
      },
    );

    it.each(intersectCircleList)(
      "check if an arc intersects with a circle",
      ({ from, to, center, circle, intersect }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        expect(a.doesIntersect(c)).toEqual(intersect);
      },
    );

    it.each(intersectPolygonList)(
      "check if an arc intersects with a polygon",
      ({ from, to, center, polygon, intersect }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const vertices = polygon.map((p) => new Point2d(p[0], p[1]));
        const p = new Polygon2d(vertices);

        expect(a.doesIntersect(p)).toEqual(intersect);
      },
    );

    it.each(intersectEllipseList)(
      "check if an arc intersects with an ellipse",
      ({ from, to, center, ellipse, intersect }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const e = new Ellipse2d(
          new Point2d(ellipse[0], ellipse[1]),
          ellipse[2],
          ellipse[3],
        );

        expect(a.doesIntersect(e)).toEqual(intersect);
      },
    );

    it.each(intersectArcList)(
      "check if an arc intersects with an other arc",
      ({ arc1, arc2, intersect }) => {
        const a1 = new Arc2d(
          new Point2d(arc1[0], arc1[1]),
          new Point2d(arc1[2], arc1[3]),
          new Point2d(arc1[4], arc1[5]),
        );

        const a2 = new Arc2d(
          new Point2d(arc2[0], arc2[1]),
          new Point2d(arc2[2], arc2[3]),
          new Point2d(arc2[4], arc2[5]),
        );

        expect(a1.doesIntersect(a2)).toEqual(intersect);
      },
    );

    it.each(intersectSectorList)(
      "check if an arc intersects with a sector",
      ({ arc, sector, intersect }) => {
        const a = new Arc2d(
          new Point2d(arc[0], arc[1]),
          new Point2d(arc[2], arc[3]),
          new Point2d(arc[4], arc[5]),
        );

        const s = new Sector2d(
          new Point2d(sector[0], sector[1]),
          new Point2d(sector[2], sector[3]),
          new Point2d(sector[4], sector[5]),
        );

        expect(a.doesIntersect(s)).toEqual(intersect);
      },
    );
  });

  describe("getIntersectionPoints", () => {
    it.each(intersectLineList)(
      "get intersection points with a line $line",
      ({ from, to, center, line, intersect, intersectAt }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const l = new Line2d(
          new Point2d(line[0], line[1]),
          new Point2d(line[2], line[3]),
        );

        const points = a.getIntersectionPoints(l);

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
      "get intersection points with a circle $circle",
      ({ from, to, center, circle, intersect, intersectAt }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        const points = a.getIntersectionPoints(c);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectPolygonList)(
      "get intersection points with a polygon $polygon",
      ({ from, to, center, polygon, intersect, intersectAt }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const vertices = polygon.map((p) => new Point2d(p[0], p[1]));
        const p = new Polygon2d(vertices);

        const points = a.getIntersectionPoints(p);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectEllipseList)(
      "get intersection points with an ellipse $ellipse",
      ({ from, to, center, ellipse, intersect, intersectAt }) => {
        const a = new Arc2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const e = new Ellipse2d(
          new Point2d(ellipse[0], ellipse[1]),
          ellipse[2],
          ellipse[3],
        );

        const points = a.getIntersectionPoints(e);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectArcList)(
      "get intersection points with an arc $arc2",
      ({ arc1, arc2, intersect, intersectAt }) => {
        const a1 = new Arc2d(
          new Point2d(arc1[0], arc1[1]),
          new Point2d(arc1[2], arc1[3]),
          new Point2d(arc1[4], arc1[5]),
        );

        const a2 = new Arc2d(
          new Point2d(arc2[0], arc2[1]),
          new Point2d(arc2[2], arc2[3]),
          new Point2d(arc2[4], arc2[5]),
        );

        const points = a1.getIntersectionPoints(a2);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectSectorList)(
      "get intersection points with a sector $sector",
      ({ arc, sector, intersect, intersectAt }) => {
        const a = new Arc2d(
          new Point2d(arc[0], arc[1]),
          new Point2d(arc[2], arc[3]),
          new Point2d(arc[4], arc[5]),
        );

        const s = new Sector2d(
          new Point2d(sector[0], sector[1]),
          new Point2d(sector[2], sector[3]),
          new Point2d(sector[4], sector[5]),
        );

        const points = a.getIntersectionPoints(s);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );
  });
});
