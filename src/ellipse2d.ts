import { Point2d } from "./point2d";
import { Vector2d } from "./vector2d";
import { IShape2d, IClosedShape2d } from "./ishape2d";
import { Intersection2d } from "./intersection2d";

/**
 * Defines an ellipse in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Ellipse}
 */
export class Ellipse2d implements IClosedShape2d {
  private _center: Point2d;
  /**
   * Gets or sets the width of the ellipse.
   */
  public width: number;
  /**
   * Gets or sets the height of the ellipse.
   */
  public height: number;

  constructor(center: Point2d, width: number, height: number) {
    this._center = center;
    this.width = width;
    this.height = height;
  }

  /**
   * Gets the center of the ellipse.
   */
  get center(): Point2d {
    return this._center;
  }

  /**
   * Gets the perimeter of the ellipse.
   */
  get perimeter(): number {
    const a = this.width / 2;
    const b = this.height / 2;
    const perimeter = 2 * Math.PI * Math.sqrt((a * a + b * b) / 2.0);

    return Number.parseFloat(perimeter.toFixed(2));
  }

  /**
   * Gets the area of the ellipse.
   */
  get area(): number {
    const a = this.width / 2;
    const b = this.height / 2;
    const area = Math.PI * a * b;

    return Number.parseFloat(area.toFixed(2));
  }

  /**
   * Gets the linear eccentricity of the ellipse.
   */
  get eccentricity(): number {
    const a = this.width / 2;
    const b = this.height / 2;
    const ecc = Math.sqrt(a * a - b * b);

    return Number.parseFloat(ecc.toFixed(2));
  }

  /**
   * Gets the first focus point of the ellipse.
   */
  get f1(): Point2d {
    const e = this.eccentricity;

    return new Point2d(this._center.x - e, this._center.y);
  }

  /**
   * Gets the second focus point of the ellipse.
   */
  get f2(): Point2d {
    const e = this.eccentricity;

    return new Point2d(this._center.x + e, this._center.y);
  }

  /**
   * Translates the ellipse using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this._center.translate(vector);
  }

  /**
   * Rotates the ellipse by the given angle in degree, around a point.
   * @param angle The rotation angle.
   * @param origin The origin from which the rotation is supposed to be done.
   */
  rotate(angle: number, origin: Point2d = new Point2d()): void {
    if (angle === 0 || angle === 360) {
      return;
    }

    this._center.rotate(angle, origin);
  }

  private computeCheckpoint(point: Point2d): number {
    const a = this.width / 2;
    const b = this.height / 2;

    return (
      Math.pow(point.x - this._center.x, 2) / Math.pow(a, 2) +
      Math.pow(point.y - this._center.y, 2) / Math.pow(b, 2)
    );
  }

  /**
   * Checks if the given point is on one edge of the ellipse.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on one edge.
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    const c = this.computeCheckpoint(point);

    return c >= 1 - threshold && c <= 1 + threshold;
  }

  /**
   * Checks if the given point is located inside the ellipse.
   * @param point The reference point.
   * @returns true if the point is inside the ellipse.
   */
  contains(point: Point2d): boolean {
    const c = this.computeCheckpoint(point);

    return c <= 1;
  }

  /**
   * Checks if the current ellipse intersect with the given shape.
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
