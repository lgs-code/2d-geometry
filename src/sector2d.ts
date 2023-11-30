import { Point2d } from "./point2d";
import { Arc2d } from "./arc2d";
import { Circle2d } from "./circle2d";
import { Ellipse2d } from "./ellipse2d";
import { IShape2d, IClosedShape2d } from "./ishape2d";
import { Intersection2d } from "./intersection2d";

/**
 * Defines a sector in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Circular_sector}
 */
export class Sector2d extends Arc2d implements IClosedShape2d {
  constructor(from: Point2d, to: Point2d, center: Point2d) {
    super(from, to, center);
  }

  /**
   * Gets the are of the sector.
   */
  get area(): number {
    const r1: number = this.fromToCenter;
    const r2: number = this.toToCenter;
    const angle: number = this.angle;

    const globalArea: number = this.isCircular
      ? Circle2d.getArea(r1)
      : Ellipse2d.getArea(r1, r2);

    const area: number = (globalArea * angle) / 360;

    return Number.parseFloat(area.toFixed(2));
  }

  /**
   * Gets the perimeter of the sector.
   */
  get perimeter(): number {
    return this.length + this.fromToCenter + this.toToCenter;
  }

  /**
   * Checks if the given point is located inside the sector.
   * @param point The reference point.
   * @returns true if the point is inside the sector.
   */
  contains(point: Point2d): boolean {
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

    const baseShape: IClosedShape2d = this.isCircular
      ? new Circle2d(this.center, r1)
      : new Ellipse2d(this.center, r1 * 2, r2 * 2);

    return baseShape.contains(point);
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
