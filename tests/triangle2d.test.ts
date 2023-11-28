import { log } from "console";
import { Line2d, Point2d, Triangle2d, Vector2d } from "../build/index";

describe("Triangle2d", () => {
  const triangleList = [
    {
      triangle: [0, 0, 0, 5, 5, 0],
      center: [1.67, 1.67],
      circum: [2.5, 2.5],
      ortho: [0, 0],
      perimeter: 17.07,
      area: 12.5,
      right: true,
      equi: false,
      iso: true,
    },
    {
      triangle: [0, 0, 6, 0, 3, 2],
      center: [3, 0.67],
      circum: [3, -1.25],
      ortho: [3, 4.5],
      perimeter: 13.22,
      area: 6,
      right: false,
      equi: false,
      iso: true,
    },
    {
      triangle: [0, 0, 0, 6, 3, 2],
      center: [1, 2.67],
      circum: [0.17, 3],
      ortho: [2.67, 2],
      perimeter: 14.61,
      area: 9,
      right: false,
      equi: false,
      iso: false,
    },
  ];

  describe("ctor", () => {
    it.each(triangleList)("creates a triangle with points", ({ triangle }) => {
      const points = [
        new Point2d(triangle[0], triangle[1]),
        new Point2d(triangle[2], triangle[3]),
        new Point2d(triangle[4], triangle[5]),
      ];

      const t = new Triangle2d(points);

      expect(t).not.toBe(null);
    });

    it.each(triangleList)("creates a triangle with lines", ({ triangle }) => {
      const points = [
        new Point2d(triangle[0], triangle[1]),
        new Point2d(triangle[2], triangle[3]),
        new Point2d(triangle[4], triangle[5]),
      ];

      const lines = [
        new Line2d(points[0], points[1]),
        new Line2d(points[1], points[2]),
        new Line2d(points[2], points[0]),
      ];

      const t = new Triangle2d(lines);

      expect(t).not.toBe(null);
    });

    it("creates a triangle with wrong number of points", () => {
      expect(
        () => new Triangle2d([new Point2d(0, 0), new Point2d(0, 5)]),
      ).toThrowError("Expected number of vertices is 3");
    });

    it("creates a triangle with wrong number of lines", () => {
      expect(
        () =>
          new Triangle2d([
            new Line2d(new Point2d(0, 0), new Point2d(0, 5)),
            new Line2d(new Point2d(0, 5), new Point2d(5, 5)),
          ]),
      ).toThrowError("Expected number of edges is 3");
    });
  });

  describe("props", () => {
    it.each(triangleList)(
      "check center, vertices and edges",
      ({
        triangle,
        center,
        circum,
        ortho,
        perimeter,
        area,
        right,
        equi,
        iso,
      }) => {
        const points = [
          new Point2d(triangle[0], triangle[1]),
          new Point2d(triangle[2], triangle[3]),
          new Point2d(triangle[4], triangle[5]),
        ];

        const t = new Triangle2d(points);

        expect(t.vertices.length).toEqual(3);
        expect(t.vertices[0].x).toEqual(triangle[0]);
        expect(t.vertices[0].y).toEqual(triangle[1]);
        expect(t.vertices[1].x).toEqual(triangle[2]);
        expect(t.vertices[1].y).toEqual(triangle[3]);
        expect(t.vertices[2].x).toEqual(triangle[4]);
        expect(t.vertices[2].y).toEqual(triangle[5]);

        expect(t.edges.length).toEqual(3);

        expect(t.centroid.x).toEqual(center[0]);
        expect(t.centroid.y).toEqual(center[1]);

        expect(t.circumCenter.x).toEqual(circum[0]);
        expect(t.circumCenter.y).toEqual(circum[1]);

        expect(t.orthoCenter.x).toEqual(ortho[0]);
        expect(t.orthoCenter.y).toEqual(ortho[1]);

        expect(t.perimeter).toEqual(perimeter);

        expect(t.area).toEqual(area);

        expect(t.isRight).toEqual(right);
        expect(t.isEquilateral).toEqual(equi);
        expect(t.isIsoceles).toEqual(iso);
      },
    );
  });
});
