import { log } from "console";
import { Point2d, Polygon2d, Line2d } from "../build/index";

describe("Polygon2d", () => {
  const polygonList = [
    {
      vertices: [
        [0, 0],
        [5, 0],
        [5, 5],
        [0, 5],
      ],
      centroid: [2.5, 2.5],
      area: 25,
      convex: true,
      concave: false,
      equiAngular: true,
      equilateral: true,
      triangles: [
        [
          [5, 0],
          [5, 5],
          [0, 5],
        ],
        [
          [5, 0],
          [0, 5],
          [0, 0],
        ],
      ],
    },
    {
      vertices: [
        [0, 0],
        [5, 0],
        [6, 5],
        [-4, 7],
        [2, 3],
      ],
      centroid: [1.8, 3],
      area: 30.5,
      convex: false,
      concave: true,
      equiAngular: false,
      equilateral: false,
      triangles: [
        [
          [2, 3],
          [0, 0],
          [5, 0],
        ],
        [
          [2, 3],
          [5, 0],
          [6, 5],
        ],
        [
          [2, 3],
          [6, 5],
          [-4, 7],
        ],
      ],
    },
  ];

  describe("ctor", () => {
    it("creates a polygon with not enough points", () => {
      expect(
        () => new Polygon2d([new Point2d(0, 0), new Point2d(0, 5)]),
      ).toThrowError("Minimum number of vertices is 3");
    });

    it("creates a polygon with not enough lines", () => {
      expect(
        () =>
          new Polygon2d([
            new Line2d(new Point2d(0, 0), new Point2d(0, 5)),
            new Line2d(new Point2d(0, 5), new Point2d(5, 5)),
          ]),
      ).toThrowError("Minimum number of edges is 3");
    });
  });

  describe("props", () => {
    it.each(polygonList)(
      "check generic properties",
      ({
        vertices,
        centroid,
        area,
        convex,
        concave,
        equiAngular,
        equilateral,
      }) => {
        const vs = vertices.map((point) => new Point2d(point[0], point[1]));
        const p = new Polygon2d(vs);

        expect(p.centroid.x).toEqual(centroid[0]);
        expect(p.centroid.y).toEqual(centroid[1]);

        expect(p.area).toEqual(area);

        expect(p.isConvex).toEqual(convex);
        expect(p.isConcave).toEqual(concave);
        expect(p.isEquiAngular).toEqual(equiAngular);
        expect(p.isEquilateral).toEqual(equilateral);
      },
    );
  });

  describe("triangulate", () => {
    it.each(polygonList)(
      "check triangulate results",
      ({ vertices, triangles }) => {
        const vs = vertices.map((point) => new Point2d(point[0], point[1]));
        const p = new Polygon2d(vs);

        const ts = p.triangulate();
        expect(ts.length).toEqual(triangles.length);
        expect(
          ts.every(
            (t) =>
              t[0].x === triangles[0][0][0] && t[0].y === triangles[0][0][1],
          ),
        ).toEqual(true);
      },
    );
  });

  describe("contains", () => {
    const containsList = [
      {
        vertices: [
          [0, 0],
          [5, 0],
          [5, 5],
          [0, 5],
        ],
        triangles: [
          [
            [5, 0],
            [5, 5],
            [0, 5],
          ],
          [
            [5, 0],
            [0, 5],
            [0, 0],
          ],
        ],
        point: [4, 1],
        contains: true,
      },
      {
        vertices: [
          [0, 0],
          [5, 0],
          [6, 5],
          [-4, 7],
          [2, 3],
        ],
        triangles: [
          [
            [2, 3],
            [0, 0],
            [5, 0],
          ],
          [
            [2, 3],
            [5, 0],
            [6, 5],
          ],
          [
            [2, 3],
            [6, 5],
            [-4, 7],
          ],
        ],
        point: [-20, -20],
        contains: false,
      },
    ];

    it.each(containsList)(
      "check if a point is inside a polygon",
      ({ vertices, point, contains }) => {
        const p = new Polygon2d(
          vertices.map((point) => new Point2d(point[0], point[1])),
        );
        const pt = new Point2d(point[0], point[1]);

        expect(p.contains(pt)).toEqual(contains);
      },
    );
  });
});
