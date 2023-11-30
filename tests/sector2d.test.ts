import { log } from "console";
import { pointsDoMatch } from "./test-utils";
import {
  Point2d,
  Line2d,
  Circle2d,
  Sector2d,
  Polygon2d,
  Ellipse2d,
  Arc2d,
} from "../build/index";

describe("Sector2d", () => {
  const sectorList = [
    {
      from: [0, 0],
      to: [5, 5],
      center: [0, 5],
      angle: 90,
      length: 7.85,
      area: 19.63,
      perimeter: 17.85,
      circular: true,
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      angle: 90,
      length: 7.85,
      area: 19.63,
      perimeter: 17.85,
      circular: true,
    },
    {
      from: [0, 3],
      to: [7, 0],
      center: [0, 0],
      angle: 90,
      length: 8.46,
      area: 16.49,
      perimeter: 18.46,
      circular: false,
    },
  ];

  describe("ctor", () => {
    it.each(sectorList)("creates a sector", ({ from, to, center }) => {
      const a = new Sector2d(
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
    it.each(sectorList)(
      "check angle, length, area, perimeter using $from, $to, $center",
      ({ from, to, center, angle, length, circular, area, perimeter }) => {
        const a = new Sector2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        expect(a.isCircular).toEqual(circular);
        expect(a.angle).toEqual(angle);
        expect(a.length).toEqual(length);
        expect(a.area).toEqual(area);
        expect(a.perimeter).toEqual(perimeter);
      },
    );
  });

  describe("contains", () => {
    const containsList = [
      {
        from: [0, 0],
        to: [5, 5],
        center: [0, 5],
        check: [1, 4],
        inside: true,
      },
      {
        from: [0, 0],
        to: [5, 5],
        center: [0, 5],
        check: [-5, 5],
        inside: false,
      },
    ];

    it.each(containsList)(
      "check if a point $check is inside a sector",
      ({ from, to, center, check, inside }) => {
        const a = new Sector2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const p = new Point2d(check[0], check[1]);

        expect(a.contains(p)).toEqual(inside);
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
      intersectAt: [
        [3.54, 3.54],
        [0, 0],
      ],
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      line: [-2, 0, -2, 7],
      intersect: false,
      intersectAt: [],
    },
  ];

  const intersectCircleList = [
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      circle: [0, 0, 3],
      intersect: true,
      intersectAt: [
        [3, 0],
        [0, 3],
      ],
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      circle: [2, 0, 4],
      intersect: true,
      intersectAt: [
        [3.25, 3.8],
        [0, 3.46],
      ],
    },
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      circle: [-5, 0, 4],
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
        [2.25, 0],
        [2.48, 4.34],
        [0, 1.25],
      ],
    },
  ];

  const intersectEllipseList = [
    {
      from: [5, 0],
      to: [0, 5],
      center: [0, 0],
      ellipse: [0, 0, 3, 2],
      intersect: true,
      intersectAt: [
        [1.5, 0],
        [0, 1],
      ],
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
        [2, 0],
        [0, 0.27],
        [0, 3.73],
      ],
    },
  ];

  const intersectArcList = [
    {
      sector: [5, 0, 0, 5, 0, 0],
      arc: [-1, 0, 4, 5, 4, 0],
      intersect: true,
      intersectAt: [
        [2, 4.58],
        [0, 3],
      ],
    },
  ];

  const intersectSectorList = [
    {
      sector1: [5, 0, 0, 5, 0, 0],
      sector2: [-1, 0, 4, 5, 4, 0],
      intersect: true,
      intersectAt: [
        [2, 4.58],
        [4, 0],
        [0, 0],
      ],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectLineList)(
      "check if a sector intersects with a line $line",
      ({ from, to, center, line, intersect }) => {
        const a = new Sector2d(
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
      "check if a sector intersects with a circle $circle",
      ({ from, to, center, circle, intersect }) => {
        const a = new Sector2d(
          new Point2d(from[0], from[1]),
          new Point2d(to[0], to[1]),
          new Point2d(center[0], center[1]),
        );

        const c = new Circle2d(new Point2d(circle[0], circle[1]), circle[2]);

        expect(a.doesIntersect(c)).toEqual(intersect);
      },
    );

    it.each(intersectPolygonList)(
      "check if a sector intersects with a polygon",
      ({ from, to, center, polygon, intersect }) => {
        const a = new Sector2d(
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
      "check if a sector intersects with an ellipse $ellipse",
      ({ from, to, center, ellipse, intersect }) => {
        const a = new Sector2d(
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
      "check if a sector intersects with an arc $arc",
      ({ sector, arc, intersect }) => {
        const s = new Sector2d(
          new Point2d(sector[0], sector[1]),
          new Point2d(sector[2], sector[3]),
          new Point2d(sector[4], sector[5]),
        );

        const a = new Arc2d(
          new Point2d(arc[0], arc[1]),
          new Point2d(arc[2], arc[3]),
          new Point2d(arc[4], arc[5]),
        );

        expect(s.doesIntersect(a)).toEqual(intersect);
      },
    );

    it.each(intersectSectorList)(
      "check if a sector intersects with a sector $sector2",
      ({ sector1, sector2, intersect }) => {
        const s1 = new Sector2d(
          new Point2d(sector1[0], sector1[1]),
          new Point2d(sector1[2], sector1[3]),
          new Point2d(sector1[4], sector1[5]),
        );

        const s2 = new Sector2d(
          new Point2d(sector2[0], sector2[1]),
          new Point2d(sector2[2], sector2[3]),
          new Point2d(sector2[4], sector2[5]),
        );

        expect(s1.doesIntersect(s2)).toEqual(intersect);
      },
    );
  });

  describe("getIntersectionPoints", () => {
    it.each(intersectLineList)(
      "get intersection points with a line $line",
      ({ from, to, center, line, intersect, intersectAt }) => {
        const a = new Sector2d(
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

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectCircleList)(
      "get intersection points with a circle $circle",
      ({ from, to, center, circle, intersect, intersectAt }) => {
        const a = new Sector2d(
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
        const a = new Sector2d(
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
        const a = new Sector2d(
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
      "get intersection points with an arc $arc",
      ({ sector, arc, intersect, intersectAt }) => {
        const s = new Sector2d(
          new Point2d(sector[0], sector[1]),
          new Point2d(sector[2], sector[3]),
          new Point2d(sector[4], sector[5]),
        );

        const a = new Arc2d(
          new Point2d(arc[0], arc[1]),
          new Point2d(arc[2], arc[3]),
          new Point2d(arc[4], arc[5]),
        );

        const points = s.getIntersectionPoints(a);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );

    it.each(intersectSectorList)(
      "get intersection points with a sector $sector2",
      ({ sector1, sector2, intersect, intersectAt }) => {
        const s1 = new Sector2d(
          new Point2d(sector1[0], sector1[1]),
          new Point2d(sector1[2], sector1[3]),
          new Point2d(sector1[4], sector1[5]),
        );

        const s2 = new Sector2d(
          new Point2d(sector2[0], sector2[1]),
          new Point2d(sector2[2], sector2[3]),
          new Point2d(sector2[4], sector2[5]),
        );

        const points = s1.getIntersectionPoints(s2);

        expect(points.length).toEqual(intersectAt.length);

        expect(pointsDoMatch(points, intersectAt)).toEqual(intersect);
      },
    );
  });
});
