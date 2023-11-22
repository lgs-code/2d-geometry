import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Vector2d } from "./vector2d";
import { Polygon2d } from "./polygon2d";
import { Circle2d } from "./circle2d";
import { Polynomial } from "./polynomial";

/**
 * Defines an ellipse in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Ellipse}
 */
export class Ellipse2d {
  private _center: Point2d;
  public width: number;
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
   * Checks if the given line intersect with the current ellipse.
   * @param line The reference line.
   * @returns true if both intersect.
   */
  doesIntersect(line: Line2d): boolean;
  /**
   * Checks if the given polygon intersect with the current ellipse.
   * @param polygon The reference polygon.
   * @returns true if both intersect.
   */
  doesIntersect(polygon: Polygon2d): boolean;
  /**
   * Checks if the given circle intersect with the current ellipse.
   * @param circle The reference circle.
   * @returns true if both intersect.
   */
  doesIntersect(circle: Circle2d): boolean;
  /**
   * Checks if the given ellipse intersect with the current ellipse.
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
      return this.getIntersectionWithEllipse(item).length > 0;
    }
  }

  getIntersectionWithSegment(line: Line2d): Point2d[] {
    const dir = new Vector2d(line.p2.x - line.p1.x, line.p2.y - line.p1.y);
    const diff = new Vector2d(
      line.p1.x - this._center.x,
      line.p1.y - this._center.y,
    );
    const rx = this.width / 2;
    const ry = this.height / 2;
    const mDir = new Vector2d(dir.x / (rx * rx), dir.y / (ry * ry));
    const mDiff = new Vector2d(diff.x / (rx * rx), diff.y / (ry * ry));

    const a = dir.dot(mDir);
    const b = dir.dot(mDiff);
    const c = diff.dot(mDiff) - 1.0;
    const d = b * b - a * c;

    const intersections: Point2d[] = [];

    if (d > 0) {
      const t_a = (-b - Math.sqrt(d)) / a;
      const t_b = (-b + Math.sqrt(d)) / a;

      if (0 <= t_a && t_a <= 1) {
        intersections.push(
          new Point2d(
            Number.parseFloat(
              (line.p1.x + (line.p2.x - line.p1.x) * t_a).toFixed(2),
            ),
            Number.parseFloat(
              (line.p1.y + (line.p2.y - line.p1.y) * t_a).toFixed(2),
            ),
          ),
        );
      }

      if (0 <= t_b && t_b <= 1) {
        intersections.push(
          new Point2d(
            Number.parseFloat(
              (line.p1.x + (line.p2.x - line.p1.x) * t_b).toFixed(2),
            ),
            Number.parseFloat(
              (line.p1.y + (line.p2.y - line.p1.y) * t_b).toFixed(2),
            ),
          ),
        );
      }
    } else if (d === 0) {
      const t = -b / a;
      if (0 <= t && t <= 1) {
        intersections.push(
          new Point2d(
            Number.parseFloat(
              (line.p1.x + (line.p2.x - line.p1.x) * t).toFixed(2),
            ),
            Number.parseFloat(
              (line.p1.y + (line.p2.y - line.p1.y) * t).toFixed(2),
            ),
          ),
        );
      }
    }

    return intersections;
  }

  getIntersectionWithCircle(circle: Circle2d): Point2d[] {
    return this.getIntersectionWithEllipse(
      new Ellipse2d(circle.center, circle.diameter, circle.diameter),
    );
  }

  private static bezout(arg1: number[], arg2: number[]): Polynomial {
    const AB = arg1[0] * arg2[1] - arg2[0] * arg1[1];
    const AC = arg1[0] * arg2[2] - arg2[0] * arg1[2];
    const AD = arg1[0] * arg2[3] - arg2[0] * arg1[3];
    const AE = arg1[0] * arg2[4] - arg2[0] * arg1[4];
    const AF = arg1[0] * arg2[5] - arg2[0] * arg1[5];
    const BC = arg1[1] * arg2[2] - arg2[1] * arg1[2];
    const BE = arg1[1] * arg2[4] - arg2[1] * arg1[4];
    const BF = arg1[1] * arg2[5] - arg2[1] * arg1[5];
    const CD = arg1[2] * arg2[3] - arg2[2] * arg1[3];
    const DE = arg1[3] * arg2[4] - arg2[3] * arg1[4];
    const DF = arg1[3] * arg2[5] - arg2[3] * arg1[5];
    const BFpDE = BF + DE;
    const BEmCD = BE - CD;

    return new Polynomial(
      AB * BC - AC * AC,
      AB * BEmCD + AD * BC - 2 * AC * AE,
      AB * BFpDE + AD * BEmCD - AE * AE - 2 * AC * AF,
      AB * DF + AD * BFpDE - 2 * AE * AF,
      AD * DF - AF * AF,
    );
  }

  getIntersectionWithEllipse(ellipse: Ellipse2d): Point2d[] {
    const c1 = this.center;
    const rx1 = this.width / 2;
    const ry1 = this.height / 2;

    const c2 = ellipse.center;
    const rx2 = ellipse.width / 2;
    const ry2 = ellipse.height / 2;

    const a = [
      ry1 * ry1,
      0,
      rx1 * rx1,
      -2 * ry1 * ry1 * c1.x,
      -2 * rx1 * rx1 * c1.y,
      ry1 * ry1 * c1.x * c1.x + rx1 * rx1 * c1.y * c1.y - rx1 * rx1 * ry1 * ry1,
    ];
    const b = [
      ry2 * ry2,
      0,
      rx2 * rx2,
      -2 * ry2 * ry2 * c2.x,
      -2 * rx2 * rx2 * c2.y,
      ry2 * ry2 * c2.x * c2.x + rx2 * rx2 * c2.y * c2.y - rx2 * rx2 * ry2 * ry2,
    ];

    const epsilon = 1e-3;
    const norm0 = (a[0] * a[0] + 2 * a[1] * a[1] + a[2] * a[2]) * epsilon;
    const norm1 = (b[0] * b[0] + 2 * b[1] * b[1] + b[2] * b[2]) * epsilon;

    const intersections: Point2d[] = [];

    const yPoly = Ellipse2d.bezout(a, b);
    const yRoots = yPoly.getRoots();

    for (var y = 0; y < yRoots.length; y++) {
      const xPoly = new Polynomial(
        a[0],
        a[3] + yRoots[y] * a[1],
        a[5] + yRoots[y] * (a[4] + yRoots[y] * a[2]),
      );
      const xRoots = xPoly.getRoots();

      for (let x = 0; x < xRoots.length; x++) {
        let test =
          (a[0] * xRoots[x] + a[1] * yRoots[y] + a[3]) * xRoots[x] +
          (a[2] * yRoots[y] + a[4]) * yRoots[y] +
          a[5];

        if (Math.abs(test) < norm0) {
          test =
            (b[0] * xRoots[x] + b[1] * yRoots[y] + b[3]) * xRoots[x] +
            (b[2] * yRoots[y] + b[4]) * yRoots[y] +
            b[5];

          if (Math.abs(test) < norm1) {
            intersections.push(
              new Point2d(
                Number.parseFloat(xRoots[x].toFixed(2)),
                Number.parseFloat(yRoots[y].toFixed(2)),
              ),
            );
          }
        }
      }
    }

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
      return this.getIntersectionWithEllipse(item);
    }
  }
}
