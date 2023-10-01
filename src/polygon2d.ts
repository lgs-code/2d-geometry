import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Vector2d } from "./vector2d";

/**
 * Defines a polygon in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Polygon}
 */
export abstract class Polygon2d {
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
  abstract get centroid(): Point2d;

  /**
   * Gets the area.
   */
  abstract get area(): number;

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
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    return this.edges.some((edge) => {
      return edge.isOnSegment(point, threshold);
    });
  }

  /**
   * Checks if the given line intersect with the current polygon.
   * @param line The reference line.
   * @returns true if both intersect.
   */
  doesIntersect(line: Line2d): boolean;
  /**
   * Checks if the given polygon intersect with the current polygon.
   * @param rect The reference polygon.
   * @returns true if both intersect.
   */
  doesIntersect(rect: Polygon2d): boolean;
  doesIntersect(item: Line2d | Polygon2d): boolean {
    if (item instanceof Line2d) {
      return this.edges.some((edge) => {
        return item.doesIntersect(edge);
      });
    } else {
      // if (item instanceof Polygon2d)
      return this.edges.some((edge) => {
        return item.edges.some((iedge) => iedge.doesIntersect(edge));
      });
    }
  }

  /**
   * Gets the list of intersection points.
   * @param line The reference line.
   * @returns the intersection points, if any.
   */
  getIntersectionPoints(line: Line2d): Point2d[];
  /**
   * Gets the list of intersection points.
   * @param line The reference polygon.
   * @returns the intersection points, if any.
   */
  getIntersectionPoints(rect: Polygon2d): Point2d[];
  getIntersectionPoints(item: Line2d | Polygon2d): Point2d[] {
    var points = [];

    if (item instanceof Line2d) {
      this.edges.forEach((edge) => {
        points = points.concat(edge.getIntersectionPoints(item));
      });
    } else {
      //if (item instanceof Polygon2d)
      this.edges.forEach((edge) => {
        item.edges.forEach((iedge) => {
          points = points.concat(iedge.getIntersectionPoints(edge));
        });
      });
    }

    return points;
  }
}
