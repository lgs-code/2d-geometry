import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Vector2d } from "./vector2d";
import { IShape2d, IClosedShape2d } from "./ishape2d";
import { Intersection2d } from "./intersection2d";

/**
 * Defines a polygon in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Polygon}
 */
export class Polygon2d implements IClosedShape2d {
  protected _vertices: Point2d[];
  protected _edges: Line2d[];

  constructor(vertices: Point2d[]);
  constructor(edges: Line2d[]);
  constructor(item: Point2d[] | Line2d[]) {
    if (item[0] instanceof Point2d) {
      /* istanbul ignore next */
      if (item.length < 3) {
        throw new Error("Minimum number of vertices is 3");
      }

      this._vertices = item as Point2d[];
      this._edges = [];

      // build edges
      for (let i = 0; i < this._vertices.length - 1; i++) {
        this._edges.push(new Line2d(this._vertices[i], this._vertices[i + 1]));
      }
      this._edges.push(
        new Line2d(
          this._vertices[this._vertices.length - 1],
          this._vertices[0],
        ),
      );
    } else {
      /* istanbul ignore next */
      if (item.length < 3) {
        throw new Error("Minimum number of edges is 3");
      }

      this._vertices = [];
      this._edges = item as Line2d[];

      // build vertices
      for (let i = 0; i < this._edges.length; i++) {
        const p1 = this._edges[i].p1;
        const p2 = this._edges[i].p2;

        if (i === 0) {
          this._vertices.push(p1);
        } else if (!this._vertices[i - 1].equals(p1)) {
          this._vertices.push(p1);
        }

        if (!this._vertices[0].equals(p2)) {
          this._vertices.push(p2);
        }
      }
    }
  }

  /**
   * Gets the list or vertices.
   */
  get vertices(): Point2d[] {
    return this._vertices;
  }

  /**
   * Gets the list or edges.
   */
  get edges(): Line2d[] {
    return this._edges;
  }

  /**
   * Gets the center of the polygon.
   */
  get centroid(): Point2d {
    const length = this._vertices.length;

    const sumX = this._vertices
      .map((v) => v.x)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    const sumY = this._vertices
      .map((v) => v.y)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    return new Point2d(sumX / length, sumY / length);
  }

  /**
   * Gets the area.
   */
  get area(): number {
    const triangles: Line2d[][] = [];

    this.triangulate().forEach((points) => {
      triangles.push([
        new Line2d(points[0], points[1]),
        new Line2d(points[1], points[2]),
        new Line2d(points[2], points[0]),
      ]);
    });

    const area = triangles
      .map((edges) => {
        const b = edges[0].length;
        const h = edges[0].getOrthogonalLineThrough(edges[1].p2).length;

        return (b * h) / 2;
      })
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

    return Number.parseFloat(area.toFixed(1));
  }

  /**
   * Gets the perimeter.
   */
  get perimeter(): number {
    return Number.parseFloat(
      this.edges
        .map((edge) => edge.length)
        .reduce((sum, current) => sum + current, 0)
        .toFixed(2),
    );
  }

  /**
   * Gets the interior angles.
   */
  get interiorAngles(): number[] {
    const bound = this.edges.length - 1;

    return this.edges.map((edge, index, array) => {
      const angle =
        index === bound
          ? edge.angleTo(array[0])
          : edge.angleTo(array[index + 1]);

      return angle > 0 ? 360 - angle : Math.abs(angle);
    });
  }

  /**
   * Indicates if the polygon have all corner angles equal.
   * @returns true if this is the case.
   */
  get isEquiAngular(): boolean {
    return [...new Set(this.interiorAngles)].length === 1;
  }

  /**
   * Indicates if the polygon have all edges of the same length.
   * @returns true if this is the case.
   */
  get isEquilateral(): boolean {
    const lengths = this.edges.map((e) => e.length);

    return [...new Set(lengths)].length === 1;
  }

  /**
   * Gets a value indicating if the polygon is convex.
   * @see {@link https://en.wikipedia.org/wiki/Convex_polygon}
   */
  get isConvex(): boolean {
    return !this.isConcave;
  }

  /**
   * Gets a value indicating if the polygon is concave.
   * @see {@link https://en.wikipedia.org/wiki/Concave_polygon}
   */
  get isConcave(): boolean {
    return this.interiorAngles.some((a) => a > 180);
  }

  /**
   * Translates the polygon using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this.vertices.forEach((vertice) => {
      return vertice.translate(vector);
    });
  }

  /**
   * Rotates the polygon by the given angle in degree, around a point.
   * @param angle The rotation angle.
   * @param origin The origin from which the rotation is supposed to be done.
   */
  rotate(angle: number, origin: Point2d = new Point2d()): void {
    if (angle === 0 || angle === 360) {
      return;
    }

    this.vertices.forEach((vertice) => {
      return vertice.rotate(angle, origin);
    });
  }

  /**
   * Checks if the given point is on one edge of the polygon.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on one edge.
   * @returns true if the point is on edge.
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    return this.edges.some((edge) => {
      return edge.isOnEdge(point, threshold);
    });
  }

  /**
   * Checks if the given point is located inside the polygon.
   * @param point The reference point.
   * @returns true if the point is inside the polygon.
   */
  contains(point: Point2d): boolean {
    return this.triangulate().some((triangle: Point2d[]) => {
      const v1 = triangle[0];
      const v2 = triangle[1];
      const v3 = triangle[2];

      const d1 =
        (point.x - v2.x) * (v1.y - v2.y) - (v1.x - v2.x) * (point.y - v2.y);
      const d2 =
        (point.x - v3.x) * (v2.y - v3.y) - (v2.x - v3.x) * (point.y - v3.y);
      const d3 =
        (point.x - v1.x) * (v3.y - v1.y) - (v3.x - v1.x) * (point.y - v1.y);

      const has_neg = d1 < 0 || d2 < 0 || d3 < 0;
      const has_pos = d1 > 0 || d2 > 0 || d3 > 0;

      return !(has_neg && has_pos);
    });
  }

  /**
   * Triangulates the polygon using "Fan Triangulation".
   * @returns an array of points representing the triangles.
   * @see {@link https://en.wikipedia.org/wiki/Fan_triangulation}
   */
  triangulate(): Point2d[][] {
    const bound = this.edges.length - 1;
    const reflexPoints = this.edges.map((edge, index, array) => {
      const angle =
        index === bound
          ? edge.angleTo(array[0])
          : edge.angleTo(array[index + 1]);

      return {
        angle: angle > 0 ? 360 - angle : Math.abs(angle),
        point: edge.p2,
      };
    });

    const triangles: Point2d[][] = [];
    let workingSet = [...reflexPoints];

    const concaveIndex = reflexPoints.findIndex((t) => t.angle > 180);
    if (concaveIndex !== -1) {
      workingSet = reflexPoints
        .slice(concaveIndex) // from the reflex interior angle to the end
        .concat(reflexPoints.slice(0, concaveIndex)); // from the beginning to the reflex interior angle
    }

    for (let i = 1; i < workingSet.length - 1; i++) {
      triangles.push([
        workingSet[0].point,
        workingSet[i].point,
        workingSet[i + 1].point,
      ]);
    }

    return triangles;
  }

  /**
   * Checks if the current polygon intersect with the given shape.
   * @param shape The reference shape.
   * @returns true it the two shapes intersect, otherwise false.
   */
  doesIntersect(shape: IShape2d): boolean {
    return Intersection2d.getIntersections(this, shape).length > 0;
  }

  /**
   * Get the intersection points with the given shape.
   * @param shape The reference shape.
   * @returns An array of points if any intersection exist, otherwise an empty array.
   */
  getIntersectionPoints(shape: IShape2d): Point2d[] {
    return Intersection2d.getIntersections(this, shape);
  }
}
