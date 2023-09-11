import { Line2d, Point2d, Rect2d, Vector2d } from "../dist/index";

describe("Rect2d", () => {
  const rectList = [
    { location: [0, 0], width: 5, height: 5, center: [2.5, 2.5] },
    { location: [7, 9], width: 6, height: 8, center: [10, 13] },
    { location: [-3, 6], width: 8, height: 14, center: [1, 13] },
  ];

  describe("ctor", () => {
    it.each(rectList)(
      "creates a rectangle with proper parameters",
      ({ location, width, height, center }) => {
        const r = new Rect2d(
          new Point2d(location[0], location[1]),
          width,
          height,
        );

        expect(r.location.x).toEqual(location[0]);
        expect(r.location.y).toEqual(location[1]);
        expect(r.width).toEqual(width);
        expect(r.height).toEqual(height);
      },
    );
  });

  describe("props", () => {
    it.each(rectList)(
      "check center, vertices and edges",
      ({ location, width, height, center }) => {
        const r = new Rect2d(
          new Point2d(location[0], location[1]),
          width,
          height,
        );

        expect(r.vertices.length).toEqual(4);
        expect(r.vertices[0].x).toEqual(location[0]);
        expect(r.vertices[0].y).toEqual(location[1]);
        expect(r.vertices[1].x).toEqual(location[0] + width);
        expect(r.vertices[1].y).toEqual(location[1]);
        expect(r.vertices[2].x).toEqual(location[0] + width);
        expect(r.vertices[2].y).toEqual(location[1] + height);
        expect(r.vertices[3].x).toEqual(location[0]);
        expect(r.vertices[3].y).toEqual(location[1] + height);

        expect(r.edges.length).toEqual(4);

        expect(r.center.x).toEqual(center[0]);
        expect(r.center.y).toEqual(center[1]);
      },
    );
  });

  describe("translate", () => {
    const vectorList = [
      { location: [0, 0], width: 5, height: 5, vector: [25, 0] },
      { location: [7, 9], width: 6, height: 8, vector: [0, 37] },
    ];

    it.each(vectorList)(
      "moves a rectangle using a vector",
      ({ location, width, height, vector }) => {
        const r = new Rect2d(
          new Point2d(location[0], location[1]),
          width,
          height,
        );
        const v = new Vector2d(vector[0], vector[1]);

        r.translate(v);

        expect(r.vertices[0].x).toEqual(location[0] + vector[0]);
        expect(r.vertices[0].y).toEqual(location[1] + vector[1]);
        expect(r.vertices[1].x).toEqual(location[0] + width + vector[0]);
        expect(r.vertices[1].y).toEqual(location[1] + vector[1]);
        expect(r.vertices[2].x).toEqual(location[0] + width + vector[0]);
        expect(r.vertices[2].y).toEqual(location[1] + height + vector[1]);
        expect(r.vertices[3].x).toEqual(location[0] + vector[0]);
        expect(r.vertices[3].y).toEqual(location[1] + height + vector[1]);
      },
    );
  });

  describe("rotate", () => {
    const rotationList = [
      {
        source: [0, 0, 5, 5],
        origin: [0, 0],
        angle: 0,
        result: [
          [0, 0],
          [5, 0],
          [5, 5],
          [0, 5],
        ],
      },
      {
        source: [0, 0, 5, 5],
        origin: [0, 0],
        angle: 360,
        result: [
          [0, 0],
          [5, 0],
          [5, 5],
          [0, 5],
        ],
      },
      {
        source: [0, 0, 5, 5],
        origin: [0, 0],
        angle: 90,
        result: [
          [0, 0],
          [0, 5],
          [-5, 5],
          [-5, 0],
        ],
      },
    ];

    it.each(rotationList)(
      "rotates a rectangle around another point",
      ({ source, origin, angle, result }) => {
        const r = new Rect2d(
          new Point2d(source[0], source[1]),
          source[2],
          source[3],
        );

        const rp = new Point2d(origin[0], origin[1]);

        if (origin.every((v, i) => v === 0)) {
          r.rotate(angle);
        } else {
          r.rotate(angle, rp);
        }

        r.vertices.forEach((vertice, index) => {
          expect(vertice.x).toEqual(result[index][0]);
          expect(vertice.y).toEqual(result[index][1]);
        });
      },
    );
  });

  describe("isOnEdge", () => {
    const edgeList = [
      {
        source: [0, 0, 5, 5],
        point: [0, 0],
        onEdge: true,
      },
      {
        source: [0, 0, 5, 5],
        point: [-1, 0],
        onEdge: false,
      },
      {
        source: [0, 0, 5, 5],
        point: [5, 2],
        onEdge: true,
      },
      {
        source: [0, 0, 5, 5],
        point: [3, 5],
        onEdge: true,
      },
    ];

    it.each(edgeList)(
      "check if a point is stricly on an edge",
      ({ source, point, onEdge }) => {
        const r = new Rect2d(
          new Point2d(source[0], source[1]),
          source[2],
          source[3],
        );

        const p = new Point2d(point[0], point[1]);

        expect(r.isOnEdge(p)).toEqual(onEdge);
      },
    );
  });

  const intersectLineList = [
    {
      source: [0, 0, 5, 5],
      reference: [1, -2, 1, 10],
      intersect: true,
      intersectAt: [
        [1, 0],
        [1, 5],
      ],
    },
    {
      source: [0, 0, 5, 5],
      reference: [1, -5, 4, -5],
      intersect: false,
      intersectAt: [],
    },
    {
      source: [0, 0, 5, 5],
      reference: [-5, 2, 10, 4],
      intersect: true,
      intersectAt: [
        [5, 3.33],
        [0, 2.67],
      ],
    },
  ];

  const intersectRectList = [
    {
      source: [0, 0, 5, 5],
      reference: [1, 1, 5, 5],
      intersect: true,
      intersectAt: [
        [5, 1],
        [1, 5],
      ],
    },
    {
      source: [0, 0, 5, 5],
      reference: [1, 1, 3, 3],
      intersect: false,
      intersectAt: [],
    },
    {
      source: [0, 0, 5, 5],
      reference: [-2, -2, 5, 5],
      intersect: true,
      intersectAt: [
        [3, 0],
        [0, 3],
      ],
    },
  ];

  describe("doesIntersect", () => {
    it.each(intersectLineList)(
      "check if a line intersects a rectangle",
      ({ source, reference, intersect }) => {
        const r = new Rect2d(
          new Point2d(source[0], source[1]),
          source[2],
          source[3],
        );

        const l = new Line2d(
          new Point2d(reference[0], reference[1]),
          new Point2d(reference[2], reference[3]),
        );

        expect(r.doesIntersect(l)).toEqual(intersect);
      },
    );

    it.each(intersectRectList)(
      "check if a rectangle intersects a rectangle",
      ({ source, reference, intersect }) => {
        const r1 = new Rect2d(
          new Point2d(source[0], source[1]),
          source[2],
          source[3],
        );

        const r2 = new Rect2d(
          new Point2d(reference[0], reference[1]),
          reference[2],
          reference[3],
        );

        expect(r1.doesIntersect(r2)).toEqual(intersect);
      },
    );
  });

  describe("getIntersectionPoints", () => {
    it.each(intersectLineList)(
      "get intersection points with a line",
      ({ source, reference, intersect, intersectAt }) => {
        const r = new Rect2d(
          new Point2d(source[0], source[1]),
          source[2],
          source[3],
        );

        const l = new Line2d(
          new Point2d(reference[0], reference[1]),
          new Point2d(reference[2], reference[3]),
        );

        var points = r.getIntersectionPoints(l);

        expect(
          points.length > 0 &&
            points.every((p, i) => {
              return p.x === intersectAt[i][0] && p.y === intersectAt[i][1];
            }),
        ).toBe(intersect);
      },
    );

    it.each(intersectRectList)(
      "get intersection points with a rectangle",
      ({ source, reference, intersect, intersectAt }) => {
        const r1 = new Rect2d(
          new Point2d(source[0], source[1]),
          source[2],
          source[3],
        );

        const r2 = new Rect2d(
          new Point2d(reference[0], reference[1]),
          reference[2],
          reference[3],
        );

        var points = r1.getIntersectionPoints(r2);

        expect(
          points.length > 0 &&
            points.every((p, i) => {
              return p.x === intersectAt[i][0] && p.y === intersectAt[i][1];
            }),
        ).toBe(intersect);
      },
    );
  });
});