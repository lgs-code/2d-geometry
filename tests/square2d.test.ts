import { Line2d, Point2d, Square2d, Quadiralteral2d } from "../build/index";

describe("Square2d", () => {
  const squareList = [
    {
      location: [0, 0],
      width: 5,
      center: [2.5, 2.5],
      perimeter: 20,
      area: 25,
    },
    {
      location: [7, 9],
      width: 6,
      center: [10, 12],
      perimeter: 24,
      area: 36,
    },
  ];

  describe("ctor", () => {
    it.each(squareList)(
      "creates a square with proper parameters",
      ({ location, width, center }) => {
        const r = new Square2d(new Point2d(location[0], location[1]), width);

        expect(r.location.x).toEqual(location[0]);
        expect(r.location.y).toEqual(location[1]);
        expect(r.width).toEqual(width);
        expect(r.height).toEqual(width);
      },
    );

    it("creates a square with wrong number of points", () => {
      expect(
        () => new Quadiralteral2d([new Point2d(0, 0), new Point2d(0, 5)]),
      ).toThrowError("Expected number of vertices is 4");
    });

    it("creates a square with wrong number of lines", () => {
      expect(
        () =>
          new Quadiralteral2d([
            new Line2d(new Point2d(0, 0), new Point2d(0, 5)),
            new Line2d(new Point2d(0, 5), new Point2d(5, 5)),
          ]),
      ).toThrowError("Expected number of edges is 4");
    });
  });

  describe("props", () => {
    it.each(squareList)(
      "check center, vertices and edges",
      ({ location, width, center, perimeter, area }) => {
        const r = new Square2d(new Point2d(location[0], location[1]), width);

        expect(r.vertices.length).toEqual(4);
        expect(r.vertices[0].x).toEqual(location[0]);
        expect(r.vertices[0].y).toEqual(location[1]);
        expect(r.vertices[1].x).toEqual(location[0] + width);
        expect(r.vertices[1].y).toEqual(location[1]);
        expect(r.vertices[2].x).toEqual(location[0] + width);
        expect(r.vertices[2].y).toEqual(location[1] + width);
        expect(r.vertices[3].x).toEqual(location[0]);
        expect(r.vertices[3].y).toEqual(location[1] + width);

        expect(r.edges.length).toEqual(4);

        expect(r.centroid.x).toEqual(center[0]);
        expect(r.centroid.y).toEqual(center[1]);

        expect(r.area).toEqual(area);

        expect(r.perimeter).toEqual(perimeter);
      },
    );
  });
});
