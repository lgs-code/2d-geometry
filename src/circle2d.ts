import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Vector2d } from "./vector2d";
import { Ellipse2d } from "./ellipse2d";
import { Polygon2d } from "./polygon2d";

/**
 * Defines a circle in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Circle}
 */
export class Circle2d {
  private _center: Point2d;
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
    return Number.parseFloat((2 * Math.PI * this.radius).toFixed(2));
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
    return Number.parseFloat((Math.PI * Math.pow(this.radius, 2)).toFixed(2));
  }

  /**
   * Translates the circle using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this._center.translate(vector);
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
   * Checks if the given line intersect with the current circle.
   * @param line The reference line.
   * @returns true if both intersect.
   */
  doesIntersect(line: Line2d): boolean;
  /**
   * Checks if the given polygon intersect with the current circle.
   * @param polygon The reference polygon.
   * @returns true if both intersect.
   */
  doesIntersect(polygon: Polygon2d): boolean;
  /**
   * Checks if the given circle intersect with the current circle.
   * @param circle The reference circle.
   * @returns true if both intersect.
   */
  doesIntersect(circle: Circle2d): boolean;
  /**
   * Checks if the given ellipse intersect with the current circle.
   * @param ellipse The reference ellipse.
   * @returns true if both intersect.
   */
  doesIntersect(ellipse: Ellipse2d): boolean;
  doesIntersect(item: Line2d | Polygon2d | Circle2d | Ellipse2d): boolean {
    if (item instanceof Line2d) {
      return this.getIntersectionWithSegment(item).length > 0;
    } else if (item instanceof Polygon2d) {
      return item.doesIntersect(this);
    } else if (item instanceof Circle2d) {
      return this.getIntersectionWithCircle(item).length > 0;
    } else {
      // instanceof Ellipse2d
      return item.doesIntersect(this);
    }
  }

  /**
   * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection}
   * @see {@link https://en.wikipedia.org/wiki/Intersection_(geometry)}
   */
  getIntersectionWithSegment(line: Line2d): Point2d[] {
    const c = this._center;
    const r = this.radius;
    const a1 = line.p1;
    const a2 = line.p2;

    const a = (a2.x - a1.x) * (a2.x - a1.x) + (a2.y - a1.y) * (a2.y - a1.y);
    const b = 2 * ((a2.x - a1.x) * (a1.x - c.x) + (a2.y - a1.y) * (a1.y - c.y));

    const cc =
      c.x * c.x +
      c.y * c.y +
      a1.x * a1.x +
      a1.y * a1.y -
      2 * (c.x * a1.x + c.y * a1.y) -
      r * r;

    const deter = b * b - 4 * a * cc;

    // no intersection
    if (deter < 0) {
      return [];
    }

    // tangent
    if (deter === 0) {
      const secant = line.getOrthogonalLineThrough(c);
      return [secant.getIntersectionWithLine(line)];
    }

    const e = Math.sqrt(deter);
    const u1 = (-b + e) / (2 * a);
    const u2 = (-b - e) / (2 * a);

    if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
      // if (u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1) => line is outside
      // otherwise => line is inside
      return [];
    }

    const intersections = [];

    if (0 <= u1 && u1 <= 1) {
      const px1 = a1.x + (a2.x - a1.x) * u1;
      const py1 = a1.y + (a2.y - a1.y) * u1;

      intersections.push(
        new Point2d(
          Number.parseFloat(px1.toFixed(2)),
          Number.parseFloat(py1.toFixed(2)),
        ),
      );
    }

    if (0 <= u2 && u2 <= 1) {
      const px2 = a1.x + (a2.x - a1.x) * u2;
      const py2 = a1.y + (a2.y - a1.y) * u2;

      intersections.push(
        new Point2d(
          Number.parseFloat(px2.toFixed(2)),
          Number.parseFloat(py2.toFixed(2)),
        ),
      );
    }

    return intersections;
  }

  getIntersectionWithCircle(circle: Circle2d): Point2d[] {
    const c1 = this.center;
    const r1 = this.radius;
    const c2 = circle.center;
    const r2 = circle.radius;

    // determine minimum and maximum radii where circles can intersect
    const r_max = r1 + r2;
    const r_min = Math.abs(r1 - r2);

    // determine actual distance between circle centers
    const c_dist = c1.distanceTo(c2);

    // circle is outisde
    if (c_dist > r_max) {
      return [];
    }

    // circle is inside
    if (c_dist < r_min) {
      return [];
    }

    const intersections = [];

    var a = (r1 * r1 - r2 * r2 + c_dist * c_dist) / (2 * c_dist);
    var h = Math.sqrt(r1 * r1 - a * a);

    const px = c1.x + (c2.x - c1.x) * (a / c_dist);
    const py = c1.y + (c2.y - c1.y) * (a / c_dist);
    var p = new Point2d(px, py);
    var b = h / c_dist;

    intersections.push(
      new Point2d(
        Number.parseFloat((p.x - b * (c2.y - c1.y)).toFixed(2)),
        Number.parseFloat((p.y + b * (c2.x - c1.x)).toFixed(2)),
      ),
    );

    intersections.push(
      new Point2d(
        Number.parseFloat((p.x + b * (c2.y - c1.y)).toFixed(2)),
        Number.parseFloat((p.y - b * (c2.x - c1.x)).toFixed(2)),
      ),
    );

    return intersections;
  }

  /**
   * Gets the list of intersection points.
   * @param line The reference line.
   * @returns the intersection points, if any.
   */
  getIntersectionPoints(line: Line2d): Point2d[];
  /**
   * Gets the list of intersection points.
   * @param polygon The reference polygon.
   * @returns the intersection points, if any.
   */
  getIntersectionPoints(polygon: Polygon2d): Point2d[];
  /**
   * Gets the list of intersection points.
   * @param circle The reference circle.
   * @returns the intersection points, if any.
   */
  getIntersectionPoints(circle: Circle2d): Point2d[];
  /**
   * Gets the list of intersection points.
   * @param ellipse The reference ellipse.
   * @returns the intersection points, if any.
   */
  getIntersectionPoints(ellipse: Ellipse2d): Point2d[];
  getIntersectionPoints(
    item: Line2d | Polygon2d | Circle2d | Ellipse2d,
  ): Point2d[] {
    if (item instanceof Line2d) {
      return this.getIntersectionWithSegment(item);
    } else if (item instanceof Polygon2d) {
      return item.getIntersectionPoints(this);
    } else if (item instanceof Circle2d) {
      return this.getIntersectionWithCircle(item);
    } else {
      //if (item instanceof Ellipse2d)
      return item.getIntersectionPoints(this);
    }
  }
}
