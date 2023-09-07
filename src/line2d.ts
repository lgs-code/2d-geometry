import { Point2d } from "./point2d";
import { Vector2d } from "./vector2d";

/**
 * Defines a line in two-dimensional coordinates.
 */
export class Line2d {
  p1: Point2d;
  p2: Point2d;

  constructor(p1: Point2d, p2: Point2d) {
    this.p1 = p1;
    this.p2 = p2;
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

  /**
   * Computes the distance of the given point to the line.
   * @param point The reference point.
   */
  distanceTo(point: Point2d): number {
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
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    return Math.round(this.distanceTo(point)) <= threshold;
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
   * Checks if the given line intersect with the current one.
   * @param line The reference line.
   * @returns true both lines intersect.
   */
  doesIntersect(line: Line2d): boolean {
    // see
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    // https://en.wikipedia.org/wiki/Intersection_(geometry)
    return !this.isParallelTo(line);
  }

  private getDenominator(line: Line2d): number {
    return (
      (this.p1.x - this.p2.x) * (line.p1.y - line.p2.y) -
      (this.p1.y - this.p2.y) * (line.p1.x - line.p2.x)
    );
  }

  /**
   * Gets the list of intersection points.
   * @param line The reference line.
   */
  getIntersectionPoints(line: Line2d): Point2d[] {
    if (!this.doesIntersect(line)) {
      return [];
    }

    const denom = this.getDenominator(line);
    const deta = this.p1.x * this.p2.y - this.p1.y * this.p2.x;
    const detb = line.p1.x * line.p2.y - line.p1.y * line.p2.x;

    const px =
      (deta * (line.p1.x - line.p2.x) - (this.p1.x - this.p2.x) * detb) / denom;

    const py =
      (deta * (line.p1.y - line.p2.y) - (this.p1.y - this.p2.y) * detb) / denom;

    return [new Point2d(px, py)];
  }
}
