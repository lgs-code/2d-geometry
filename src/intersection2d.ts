import { IShape2d } from "./ishape2d";
import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Vector2d } from "./vector2d";
import { Polygon2d } from "./polygon2d";
import { Triangle2d } from "./triangle2d";
import { Quadiralteral2d } from "./quadrilateral2d";
import { Rect2d } from "./rect2d";
import { Square2d } from "./square2d";
import { Circle2d } from "./circle2d";
import { Ellipse2d } from "./ellipse2d";
import { Polynomial } from "./polynomial";

/**
 * Provides a common location for exposing intersection functions.
 * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection}
 * @see {@link https://en.wikipedia.org/wiki/Intersection_(geometry)}
 */
export namespace Intersection2d {
  function getLineIntersections(line: Line2d, shape: IShape2d): Point2d[] {
    let intersections: Point2d[] = [];

    switch (shape.constructor) {
      case Line2d:
        const point = getSegmentSegmentIntersection(shape as Line2d, line);
        if (point !== null) intersections.push(point);
        break;

      case Polygon2d:
      case Triangle2d:
      case Quadiralteral2d:
      case Rect2d:
      case Square2d:
        const polygon = shape as Polygon2d;
        polygon.edges.forEach((edge1: Line2d) => {
          const point = getSegmentSegmentIntersection(edge1, line);
          if (point !== null) intersections.push(point);
        });
        break;

      case Circle2d:
        return getLineCircleIntersections(line, shape as Circle2d);

      case Ellipse2d:
        return getLineEllipseIntersections(line, shape as Ellipse2d);
    }

    return intersections;
  }

  function getPolygonIntersections(
    polygon: Polygon2d,
    shape: IShape2d,
  ): Point2d[] {
    let intersections: Point2d[] = [];

    switch (shape.constructor) {
      case Line2d:
        const line = shape as Line2d;
        polygon.edges.forEach((edge: Line2d) => {
          const point = getSegmentSegmentIntersection(edge, line);
          if (point !== null) intersections.push(point);
        });
        break;

      case Polygon2d:
      case Triangle2d:
      case Quadiralteral2d:
      case Rect2d:
      case Square2d:
        const polygon2 = shape as Polygon2d;
        polygon.edges.forEach((edge1: Line2d) => {
          polygon2.edges.forEach((edge2: Line2d) => {
            const point = getSegmentSegmentIntersection(edge1, edge2);
            if (point !== null) intersections.push(point);
          });
        });
        break;

      case Circle2d:
        const circle = shape as Circle2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getCircleLineIntersections(circle, edge));
        });
        break;

      case Ellipse2d:
        const ellipse = shape as Ellipse2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getEllipseLineIntersections(ellipse, edge));
        });
        break;
    }

    return intersections;
  }

  function getCircleIntersections(
    circle: Circle2d,
    shape: IShape2d,
  ): Point2d[] {
    let intersections: Point2d[] = [];

    switch (shape.constructor) {
      case Line2d:
        return getCircleLineIntersections(circle, shape as Line2d);

      case Polygon2d:
      case Triangle2d:
      case Quadiralteral2d:
      case Rect2d:
      case Square2d:
        const polygon = shape as Polygon2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getCircleLineIntersections(circle, edge));
        });
        break;

      case Circle2d:
        return getCircleCircleIntersections(circle, shape as Circle2d);

      case Ellipse2d:
        return getCircleEllipseIntersections(circle, shape as Ellipse2d);
    }

    return intersections;
  }

  function getEllipseIntersections(
    ellipse: Ellipse2d,
    shape: IShape2d,
  ): Point2d[] {
    let intersections: Point2d[] = [];

    switch (shape.constructor) {
      case Line2d:
        return getEllipseLineIntersections(ellipse, shape as Line2d);

      case Polygon2d:
      case Triangle2d:
      case Quadiralteral2d:
      case Rect2d:
      case Square2d:
        const polygon = shape as Polygon2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getEllipseLineIntersections(ellipse, edge));
        });
        break;

      case Circle2d:
        return getEllipseCircleIntersections(ellipse, shape as Circle2d);

      case Ellipse2d:
        return getEllipseEllipseIntersections(ellipse, shape as Ellipse2d);
    }

    return intersections;
  }

  /**
   * Gets intersection points between two shapes.
   * @param shape1 The first shape.
   * @param shape2 The second shape.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getIntersections(
    shape1: IShape2d,
    shape2: IShape2d,
  ): Point2d[] {
    switch (shape1.constructor) {
      case Line2d:
        return getLineIntersections(shape1 as Line2d, shape2);
      case Polygon2d:
      case Triangle2d:
      case Quadiralteral2d:
      case Rect2d:
      case Square2d:
        return getPolygonIntersections(shape1 as Polygon2d, shape2);
      case Circle2d:
        return getCircleIntersections(shape1 as Circle2d, shape2);
      case Ellipse2d:
        return getEllipseIntersections(shape1 as Ellipse2d, shape2);
    }

    /* istanbul ignore next */
    return [];
  }

  /**
   * Gets the distance of a point to a given line.
   * @param point The reference point.
   * @param line The reference line.
   * @returns The distance of the point.
   */
  export function getPointDistanceTo(point: Point2d, line: Line2d): number {
    return (
      Math.abs(
        (line.p2.x - line.p1.x) * (line.p1.y - point.y) -
          (line.p1.x - point.x) * (line.p2.y - line.p1.y),
      ) / Math.sqrt((line.p2.x - line.p1.x) ** 2 + (line.p2.y - line.p1.y) ** 2)
    );
  }

  /**
   * Checks if the given point is on the line.
   * @param point The reference point.
   * @param line The reference line.
   * @param threshold A value used as a threshold / range to check if the point is on the line.
   */
  export function isPointOnLine(
    point: Point2d,
    line: Line2d,
    threshold: number = 0,
  ): boolean {
    return Math.round(getPointDistanceTo(point, line)) <= threshold;
  }

  /**
   * Checks if the given point is on the segment.
   * @param point The reference point.
   * @param line The reference line.
   * @param threshold A value used as a threshold / range to check if the point is on the line.
   */
  export function isPointOnSegment(
    point: Point2d,
    line: Line2d,
    threshold: number = 0,
  ): boolean {
    return (
      isPointOnLine(point, line, threshold) &&
      point.x >= Math.min(line.p1.x, line.p2.x) &&
      point.x <= Math.max(line.p1.x, line.p2.x) &&
      point.y >= Math.min(line.p1.y, line.p2.y) &&
      point.y <= Math.max(line.p1.y, line.p2.y)
    );
  }

  function getLinesDenominator(line1: Line2d, line2: Line2d): number {
    return (
      (line1.p1.x - line1.p2.x) * (line2.p1.y - line2.p2.y) -
      (line1.p1.y - line1.p2.y) * (line2.p1.x - line2.p2.x)
    );
  }

  /**
   * Checks if two lines are parallel.
   * @param line1 The first reference line.
   * @param line2 The second reference line.
   * @returns true if the lines are parallel, otherwise false.
   */
  export function areLinesParallel(line1: Line2d, line2: Line2d): boolean {
    return getLinesDenominator(line1, line2) === 0;
  }

  /**
   * Get the intersection point between two lines.
   * @param line1 The first reference line.
   * @param line2 The second reference line.
   * @returns A point if any intersection is found, otherwize null;
   */
  export function getLineLineIntersection(
    line1: Line2d,
    line2: Line2d,
  ): Point2d {
    const denom = getLinesDenominator(line1, line2);

    if (denom === 0) {
      return null!;
    }

    const deta = line1.p1.x * line1.p2.y - line1.p1.y * line1.p2.x;
    const detb = line2.p1.x * line2.p2.y - line2.p1.y * line2.p2.x;

    const px =
      (deta * (line2.p1.x - line2.p2.x) - (line1.p1.x - line1.p2.x) * detb) /
      denom;

    const py =
      (deta * (line2.p1.y - line2.p2.y) - (line1.p1.y - line1.p2.y) * detb) /
      denom;

    return new Point2d(
      Number.parseFloat(px.toFixed(2)),
      Number.parseFloat(py.toFixed(2)),
    );
  }

  /**
   * Get the intersection point between two segments.
   * @param line1 The first reference segment.
   * @param line2 The second reference segment.
   * @returns A point if any intersection is found, otherwize null;
   */
  export function getSegmentSegmentIntersection(
    line1: Line2d,
    line2: Line2d,
  ): Point2d {
    const theoricalPoint = Intersection2d.getLineLineIntersection(line1, line2);
    return theoricalPoint != null &&
      isPointOnSegment(theoricalPoint, line1) &&
      isPointOnSegment(theoricalPoint, line2)
      ? theoricalPoint
      : null!;
  }

  /**
   * Gets intersection points between a line and a circle.
   * @param line The reference line.
   * @param circle The reference circle.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getLineCircleIntersections(
    line: Line2d,
    circle: Circle2d,
  ): Point2d[] {
    return getCircleLineIntersections(circle, line);
  }

  /**
   * Gets intersection points between a circle and a line.
   * @param line The reference circle.
   * @param circle The reference line.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getCircleLineIntersections(
    circle: Circle2d,
    line: Line2d,
  ): Point2d[] {
    const c = circle.center;
    const r = circle.radius;
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
      return [getLineLineIntersection(secant, line)];
    }

    const e = Math.sqrt(deter);
    const u1 = (-b + e) / (2 * a);
    const u2 = (-b - e) / (2 * a);

    if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
      // if (u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1) => line is outside
      // otherwise => line is inside
      return [];
    }

    const intersections: Point2d[] = [];

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

  /**
   * Gets intersection points between a circle and another circle.
   * @param circle1 The first reference circle.
   * @param circle2 The second reference circle.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getCircleCircleIntersections(
    circle1: Circle2d,
    circle2: Circle2d,
  ): Point2d[] {
    const c1 = circle1.center;
    const r1 = circle1.radius;
    const c2 = circle2.center;
    const r2 = circle2.radius;

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

    const intersections: Point2d[] = [];

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
   * Gets intersection points between a line and an ellipse.
   * @param line The reference line.
   * @param ellipse The reference ellipse.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getLineEllipseIntersections(
    line: Line2d,
    ellipse: Ellipse2d,
  ): Point2d[] {
    return getEllipseLineIntersections(ellipse, line);
  }

  /**
   * Gets intersection points between an ellipse and a line.
   * @param ellipse The reference ellipse.
   * @param line The reference line.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getEllipseLineIntersections(
    ellipse: Ellipse2d,
    line: Line2d,
  ): Point2d[] {
    const dir = new Vector2d(line.p2.x - line.p1.x, line.p2.y - line.p1.y);
    const diff = new Vector2d(
      line.p1.x - ellipse.center.x,
      line.p1.y - ellipse.center.y,
    );
    const rx = ellipse.width / 2;
    const ry = ellipse.height / 2;
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

  /**
   * Gets intersection points between a circle and an ellipse.
   * @param circle The reference circle.
   * @param ellipse The reference ellipse.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getCircleEllipseIntersections(
    circle: Circle2d,
    ellipse: Ellipse2d,
  ): Point2d[] {
    return getEllipseCircleIntersections(ellipse, circle);
  }

  /**
   * Gets intersection points between an ellipse and a circle.
   * @param ellipse The reference ellipse.
   * @param circle The reference circle.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getEllipseCircleIntersections(
    ellipse: Ellipse2d,
    circle: Circle2d,
  ): Point2d[] {
    return getEllipseEllipseIntersections(
      ellipse,
      new Ellipse2d(circle.center, circle.diameter, circle.diameter),
    );
  }

  function bezout(arg1: number[], arg2: number[]): Polynomial {
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

  /**
   * Gets intersection points between an ellipse and antoher ellipse.
   * @param ellipse1 The first reference ellipse.
   * @param ellipse2 The second reference ellipse.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getEllipseEllipseIntersections(
    ellipse1: Ellipse2d,
    ellipse2: Ellipse2d,
  ): Point2d[] {
    const c1 = ellipse1.center;
    const rx1 = ellipse1.width / 2;
    const ry1 = ellipse1.height / 2;

    const c2 = ellipse2.center;
    const rx2 = ellipse2.width / 2;
    const ry2 = ellipse2.height / 2;

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

    const yPoly = bezout(a, b);
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
}
