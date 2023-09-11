import { log } from "console";
import { Point2d } from "./point2d";
import { Rect2d } from "./rect2d";
import { Vector2d } from "./vector2d";

/**
 * Defines a line in two-dimensional coordinates.
 */
export class Line2d {
  private _p1: Point2d;
  private _p2: Point2d;

  constructor(p1: Point2d, p2: Point2d) {
    this._p1 = p1;
    this._p2 = p2;
  }

  get p1() {
    return this._p1;
  }

  get p2() {
    return this._p2;
  }

  /**
   * Gets the length of the line.
   */
  get length(): number {
    return this.p1.distanceTo(this.p2);
  }

  /**
   * Gets the center of the line.
   */
  get center(): Point2d {
    return new Point2d(
      (this.p1.x + this.p2.x) / 2,
      (this.p1.y + this.p2.y) / 2,
    );
  }

  clone(): Line2d {
    return new Line2d(this._p1.clone(), this._p2.clone());
  }

  /**
   * Computes the distance of the given point to the line.
   * @param point The reference point.
   */
  private distanceTo(point: Point2d): number {
    return (
      Math.abs(
        (this.p2.x - this.p1.x) * (this.p1.y - point.y) -
          (this.p1.x - point.x) * (this.p2.y - this.p1.y),
      ) / Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2)
    );
  }

  /**
   * Translates the line using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this.p1.translate(vector);
    this.p2.translate(vector);
  }

  /**
   * Rotates the line by the given angle in degree, around a point.
   * @param angle The rotation angle.
   * @param origin The origin from which the rotation is supposed to be done.
   */
  rotate(angle: number, origin: Point2d = new Point2d()): void {
    if (angle === 0 || angle === 360) {
      return;
    }

    this.p1.rotate(angle, origin);
    this.p2.rotate(angle, origin);
  }

  /**
   * Checks if the given point is in the line.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on the line.
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    return (
      Math.round(this.distanceTo(point)) <= threshold &&
      point.x >= Math.min(this.p1.x, this.p2.x) &&
      point.x <= Math.max(this.p1.x, this.p2.x) &&
      point.y >= Math.min(this.p1.y, this.p2.y) &&
      point.y <= Math.max(this.p1.y, this.p2.y)
    );
  }

  /**
   * Checks if the line is parallel to another one.
   * @param line The reference line.
   * @returns true both lines are parallel.
   */
  isParallelTo(line: Line2d): boolean {
    return this.getDenominator(line) === 0;
  }

  /**
   * Checks if the given line intersect with the current line.
   * @param line The reference line.
   * @returns true if both intersect.
   */
  doesIntersect(line: Line2d): boolean;
  /**
   * Checks if the given rectangle intersect with the current line.
   * @param rect The reference rectangle.
   * @returns true if both intersect.
   */
  doesIntersect(rect: Rect2d): boolean;
  doesIntersect(item: Line2d | Rect2d): boolean {
    // see
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    // https://en.wikipedia.org/wiki/Intersection_(geometry)

    if (item instanceof Line2d) {
      return this.getIntersectionPoints(item).length > 0;
    } else {
      //if (item instanceof Rect2d)
      return item.doesIntersect(this);
    }
  }

  private getDenominator(line: Line2d): number {
    return (
      (this.p1.x - this.p2.x) * (line.p1.y - line.p2.y) -
      (this.p1.y - this.p2.y) * (line.p1.x - line.p2.x)
    );
  }

  private getIntersectionWithLine(line: Line2d): Point2d[] {
    if (this.isParallelTo(line)) {
      return [];
    }

    const denom = this.getDenominator(line);
    const deta = this.p1.x * this.p2.y - this.p1.y * this.p2.x;
    const detb = line.p1.x * line.p2.y - line.p1.y * line.p2.x;

    const px =
      (deta * (line.p1.x - line.p2.x) - (this.p1.x - this.p2.x) * detb) / denom;

    const py =
      (deta * (line.p1.y - line.p2.y) - (this.p1.y - this.p2.y) * detb) / denom;

    const theoricalPoint = new Point2d(
      Number.parseFloat(px.toFixed(2)),
      Number.parseFloat(py.toFixed(2)),
    );

    return this.isOnEdge(theoricalPoint) && line.isOnEdge(theoricalPoint)
      ? [theoricalPoint]
      : [];
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
    if (item instanceof Line2d) {
      return this.getIntersectionWithLine(item);
    } else {
      //if (item instanceof Rect2d)
      return item.getIntersectionPoints(this);
    }
  }
}
