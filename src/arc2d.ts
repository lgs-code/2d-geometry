import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Circle2d } from "./circle2d";
import { Ellipse2d } from "./ellipse2d";
import { Vector2d } from "./vector2d";
import { IShape2d } from "./ishape2d";
import { Intersection2d } from "./intersection2d";

/**
 * Defines an arc in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Circular_arc}
 */
export class Arc2d implements IShape2d {
  private _from: Point2d;
  private _to: Point2d;
  private _center: Point2d;

  constructor(from: Point2d, to: Point2d, center: Point2d) {
    this._from = from;
    this._to = to;
    this._center = center;
  }

  /**
   * Gets the starting point of the arc.
   */
  get from(): Point2d {
    return this._from;
  }

  /**
   * Gets the ending point of the arc.
   */
  get to(): Point2d {
    return this._to;
  }

  /**
   * Gets the center of the arc.
   */
  get center(): Point2d {
    return this._center;
  }

  /**
   * Gets a value indicating if the arc is circular, or not.
   * @returns true if this is the case, otherwise false.
   */
  get isCircular(): boolean {
    const r1: number = this.fromToCenter;
    const r2: number = this.toToCenter;

    return r1 === r2;
  }

  /**
   * Gets the arc angle.
   */
  get angle(): number {
    return Line2d.getAngleBetween(
      this._center.x,
      this._center.y,
      this._from.x,
      this._from.y,
      this._center.x,
      this._center.y,
      this._to.x,
      this._to.y,
      false,
    );
  }

  /**
   * Gets the length of the arc.
   * @see {@link https://en.wikipedia.org/wiki/Arc_length}
   */
  get length(): number {
    const r1: number = this.fromToCenter;
    const r2: number = this.toToCenter;
    const angle: number = this.angle;

    const isCircular: boolean = this.isCircular;

    const perimiter: number = isCircular
      ? Circle2d.getPerimeter(r1)
      : Ellipse2d.getPerimeter(r1, r2);

    const length = (perimiter * angle) / 360;

    return Number.parseFloat(length.toFixed(2));
  }

  protected get fromToCenter(): number {
    return Point2d.getDistance(
      this._from.x,
      this._from.y,
      this._center.x,
      this._center.y,
    );
  }

  protected get toToCenter(): number {
    return Point2d.getDistance(
      this._to.x,
      this._to.y,
      this._center.x,
      this._center.y,
    );
  }

  /**
   * Translates the arc using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this._to.translate(vector);
    this._from.translate(vector);
    this._center.translate(vector);
  }

  /**
   * Rotates the arc by the given angle in degree, around a point.
   * @param angle The rotation angle.
   * @param origin The origin from which the rotation is supposed to be done.
   */
  rotate(angle: number, origin: Point2d = new Point2d()): void {
    this._to.rotate(angle, origin);
    this._from.rotate(angle, origin);
    this._center.rotate(angle, origin);
  }

  /**
   * Checks if the given point is on one edge of the arc.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on one edge.
   * @returns true if the point is on edge.
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    const inRadar = Intersection2d.isPointInRadar(
      point,
      this.from,
      this.to,
      this.center,
      this.angle,
    );

    if (!inRadar) {
      return false;
    }

    const r1: number = this.fromToCenter;
    const r2: number = this.toToCenter;

    const baseShape: IShape2d = this.isCircular
      ? new Circle2d(this._center, r1)
      : new Ellipse2d(this._center, r1 * 2, r2 * 2);

    return baseShape.isOnEdge(point, threshold);
  }

  /**
   * Checks if the given shape intersects with the arc.
   * @param shape The reference shape.
   * @returns true it the two shapes intersect, otherwise false.
   */
  doesIntersect(shape: IShape2d): boolean {
    return this.getIntersectionPoints(shape).length > 0;
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
