import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Vector2d } from "./vector2d";

/**
 * Defines a rectangle in two-dimensional coordinates.
 */
// see https://en.wikipedia.org/wiki/Rectangle
export class Rect2d {
  private _location: Point2d;
  width: number;
  height: number;

  private _vertices: Point2d[];
  private _edges: Line2d[];

  constructor(location: Point2d, width: number, height: number) {
    this._location = location;

    this.width = width;
    this.height = height;

    this._vertices = [
      this.location,
      new Point2d(this.location.x + this.width, this.location.y),
      new Point2d(this.location.x + this.width, this.location.y + this.height),
      new Point2d(this.location.x, this.location.y + this.height),
    ];

    this._edges = [
      new Line2d(this._vertices[0], this._vertices[1]),
      new Line2d(this._vertices[1], this._vertices[2]),
      new Line2d(this._vertices[2], this._vertices[3]),
      new Line2d(this._vertices[3], this._vertices[0]),
    ];
  }

  get location() {
    return this._location;
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
   * Gets the center of the rectangle.
   */
  get center(): Point2d {
    var diag1 = new Line2d(this.vertices[0], this.vertices[2]);
    var diag2 = new Line2d(this.vertices[1], this.vertices[3]);

    return diag1.getIntersectionPoints(diag2)[0];
  }

  /**
   * Translates the rectangle using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this.vertices.forEach((vertice) => {
      return vertice.translate(vector);
    });
  }

  /**
   * Rotates the rectangle by the given angle in degree, around a point.
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
   * Checks if the given point is on one edge of the rectangle.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on one edge.
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    return this.edges.some((edge) => {
      return edge.isOnEdge(point, threshold);
    });
  }

  /**
   * Checks if the given line intersect with the current rectangle.
   * @param line The reference line.
   * @returns true if both intersect.
   */
  doesIntersect(line: Line2d): boolean;
  /**
   * Checks if the given rectangle intersect with the current rectangle.
   * @param rect The reference rectangle.
   * @returns true if both intersect.
   */
  doesIntersect(rect: Rect2d): boolean;
  doesIntersect(item: Line2d | Rect2d): boolean {
    if (item instanceof Line2d) {
      return this.edges.some((edge) => {
        return item.doesIntersect(edge);
      });
    } else {
      // if (item instanceof Rect2d)
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
   * @param line The reference rectangle.
   * @returns the intersection points, if any.
   */
  getIntersectionPoints(rect: Rect2d): Point2d[];
  getIntersectionPoints(item: Line2d | Rect2d): Point2d[] {
    var points = [];

    if (item instanceof Line2d) {
      this.edges.forEach((edge) => {
        points = points.concat(edge.getIntersectionPoints(item));
      });
    } else {
      //if (item instanceof Rect2d)
      this.edges.forEach((edge) => {
        item.edges.forEach((iedge) => {
          points = points.concat(iedge.getIntersectionPoints(edge));
        });
      });
    }

    return points;
  }
}
