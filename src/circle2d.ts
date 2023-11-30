import { Point2d } from "./point2d";
import { Vector2d } from "./vector2d";
import { IShape2d, IClosedShape2d } from "./ishape2d";
import { Intersection2d } from "./intersection2d";

/**
 * Defines a circle in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Circle}
 */
export class Circle2d implements IClosedShape2d {
  /**
   * Gets the perimeter of a circle.
   * @param radius The circle radius.
   */
  public static getPerimeter(radius: number): number {
    return 2 * Math.PI * radius;
  }

  /**
   * Gets the area of a circle.
   * @param radius The circle radius.
   */
  public static getArea(radius: number): number {
    return Math.PI * Math.pow(radius, 2);
  }

  private _center: Point2d;
  /**
   * Gets or sets the radius.
   */
  public radius: number;

  constructor(center: Point2d, radius: number) {
    this._center = center;
    this.radius = radius;
  }

  /**
   * Gets the center of the circle.
   */
  get center(): Point2d {
    return this._center;
  }

  /**
   * Gets the perimeter of the circle.
   */
  get perimeter(): number {
    return Number.parseFloat(Circle2d.getPerimeter(this.radius).toFixed(2));
  }

  /**
   * Gets the diameter of the circle.
   */
  get diameter(): number {
    return 2 * this.radius;
  }

  /**
   * Gets the area of the circle.
   */
  get area(): number {
    return Number.parseFloat(Circle2d.getArea(this.radius).toFixed(2));
  }

  /**
   * Translates the circle using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this._center.translate(vector);
  }

  /**
   * Rotates the circle by the given angle in degree, around a point.
   * @param angle The rotation angle.
   * @param origin The origin from which the rotation is supposed to be done.
   */
  rotate(angle: number, origin: Point2d = new Point2d()): void {
    if (angle === 0 || angle === 360) {
      return;
    }

    this._center.rotate(angle, origin);
  }

  /**
   * Checks if the given point is on one edge of the circle.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on one edge.
   * @returns true if the point is on edge.
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    return Math.abs(this.radius - this._center.distanceTo(point)) <= threshold;
  }

  /**
   * Checks if the given point is located inside the circle.
   * @param point The reference point.
   * @returns true if the point is inside the circle.
   */
  contains(point: Point2d): boolean {
    return this.radius >= this._center.distanceTo(point);
  }

  /**
   * Checks if the current circle intersect with the given shape.
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
