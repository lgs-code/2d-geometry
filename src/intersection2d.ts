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
import { Arc2d } from "./arc2d";
import { Sector2d } from "./sector2d";
import { Polynomial } from "./polynomial";

/**
 * Provides a common location for exposing intersection functions.
 * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection}
 * @see {@link https://en.wikipedia.org/wiki/Intersection_(geometry)}
 */
export namespace Intersection2d {
  function removeDuplicatedPoints(points: Point2d[]): Point2d[] {
    const map = new Map();
    for (const item of points) {
      map.set(`(${item.x}x${item.y})`, item);
    }
    return [...map.values()];
  }

  /**
   * Gets intersection points between a line and a shape.
   * @param line The reference line.
   * @param shape The reference shape.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
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

      case Arc2d:
        return getArcLineIntersections(shape as Arc2d, line);

      case Sector2d:
        return getSectorLineIntersections(shape as Sector2d, line);
    }

    return removeDuplicatedPoints(intersections);
  }

  /**
   * Gets intersection points between a polygon and a shape.
   * @param polygon The reference polygon.
   * @param shape The reference shape.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
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

      case Arc2d:
        const arc = shape as Arc2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getArcLineIntersections(arc, edge));
        });
        break;

      case Sector2d:
        const sector = shape as Sector2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getSectorLineIntersections(sector, edge));
        });
        break;
    }

    return removeDuplicatedPoints(intersections);
  }

  /**
   * Gets intersection points between a circle and a shape.
   * @param circle The reference circle.
   * @param shape The reference shape.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
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

      case Arc2d:
        return getArcCircleIntersections(shape as Arc2d, circle);

      case Sector2d:
        return getSectorCircleIntersections(shape as Sector2d, circle);
    }

    return removeDuplicatedPoints(intersections);
  }

  /**
   * Gets intersection points between an ellipse and a shape.
   * @param ellipse The reference ellipse.
   * @param shape The reference shape.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
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

      case Arc2d:
        return getEllipseArcIntersections(ellipse, shape as Arc2d);

      case Sector2d:
        return getEllipseSectorIntersections(ellipse, shape as Sector2d);
    }

    return intersections;
  }

  /**
   * Gets intersection points between an arc and a shape.
   * @param arc The reference arc.
   * @param shape The reference shape.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  function getArcIntersections(arc: Arc2d, shape: IShape2d): Point2d[] {
    let intersections: Point2d[] = [];

    switch (shape.constructor) {
      case Line2d:
        return getArcLineIntersections(arc, shape as Line2d);

      case Polygon2d:
      case Triangle2d:
      case Quadiralteral2d:
      case Rect2d:
      case Square2d:
        const polygon = shape as Polygon2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getArcLineIntersections(arc, edge));
        });
        break;

      case Circle2d:
        return getArcCircleIntersections(arc, shape as Circle2d);

      case Ellipse2d:
        return getArcEllipseIntersections(arc, shape as Ellipse2d);

      case Arc2d:
        return getArcArcIntersections(arc, shape as Arc2d);

      case Sector2d:
        return getArcSectorIntersections(arc, shape as Sector2d);
    }

    return intersections;
  }

  /**
   * Gets intersection points between a sector and a shape.
   * @param sector The reference sector.
   * @param shape The reference shape.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  function getSectorIntersections(
    sector: Sector2d,
    shape: IShape2d,
  ): Point2d[] {
    let intersections: Point2d[] = [];

    switch (shape.constructor) {
      case Line2d:
        return getSectorLineIntersections(sector, shape as Line2d);

      case Polygon2d:
      case Triangle2d:
      case Quadiralteral2d:
      case Rect2d:
      case Square2d:
        const polygon = shape as Polygon2d;
        polygon.edges.forEach((edge: Line2d) => {
          intersections.push(...getSectorLineIntersections(sector, edge));
        });
        break;

      case Circle2d:
        return getSectorCircleIntersections(sector, shape as Circle2d);

      case Ellipse2d:
        return getSectorEllipseIntersections(sector, shape as Ellipse2d);

      case Arc2d:
        return getArcSectorIntersections(shape as Arc2d, sector);

      case Sector2d:
        return getSectorSectorIntersections(sector, shape as Sector2d);
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
      case Arc2d:
        return getArcIntersections(shape1 as Arc2d, shape2);
      case Sector2d:
        return getSectorIntersections(shape1 as Sector2d, shape2);
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
      return [getSegmentSegmentIntersection(secant, line)];
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

  /**
   * Checks if a point is located in between the lines define
   * @param point The reference point.
   * @param from The starting point defining the sector to look in.
   * @param to The ending point defining the sector to look in.
   * @param center The center point defining the sector to look in.
   * @param angle The angle of the area (optional).
   * @returns true if the point is in the area defined by the points.
   */
  export function isPointInRadar(
    point: Point2d,
    from: Point2d,
    to: Point2d,
    center: Point2d,
    angle?: number,
  ): boolean {
    const fromAngle: number = Line2d.getAngleBetween(
      center.x,
      center.y,
      from.x,
      from.y,
      center.x,
      center.y,
      point.x,
      point.y,
      false,
    );

    const toAngle: number = Line2d.getAngleBetween(
      center.x,
      center.y,
      to.x,
      to.y,
      center.x,
      center.y,
      point.x,
      point.y,
      false,
    );

    if (!angle) {
      angle = Line2d.getAngleBetween(
        center.x,
        center.y,
        from.x,
        from.y,
        center.x,
        center.y,
        to.x,
        to.y,
        false,
      );
    }

    return fromAngle + toAngle === angle;
  }

  /**
   * Gets intersection points between a line and an arc.
   * @param line The reference line.
   * @param arc The reference arc.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getLineArcIntersections(line: Line2d, arc: Arc2d): Point2d[] {
    return getArcLineIntersections(arc, line);
  }

  /**
   * Gets intersection points between an arc and a line.
   * @param arc The reference arc.
   * @param line The reference line.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getArcLineIntersections(arc: Arc2d, line: Line2d): Point2d[] {
    const intersections: Point2d[] = arc.isCircular
      ? getCircleLineIntersections(
          new Circle2d(arc.center, arc.from.distanceTo(arc.center)),
          line,
        )
      : getEllipseLineIntersections(
          new Ellipse2d(
            arc.center,
            arc.from.distanceTo(arc.center) * 2,
            arc.to.distanceTo(arc.center) * 2,
          ),
          line,
        );

    return intersections.filter((point: Point2d) =>
      isPointInRadar(point, arc.from, arc.to, arc.center, arc.angle),
    );
  }

  /**
   * Gets intersection points between a circle and an arc.
   * @param circle The reference circle.
   * @param arc The reference arc.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getCircleArcIntersections(
    circle: Circle2d,
    arc: Arc2d,
  ): Point2d[] {
    return getArcCircleIntersections(arc, circle);
  }

  /**
   * Gets intersection points between an arc and a circle.
   * @param arc The reference arc.
   * @param circle The reference circle.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getArcCircleIntersections(
    arc: Arc2d,
    circle: Circle2d,
  ): Point2d[] {
    const intersections: Point2d[] = arc.isCircular
      ? getCircleCircleIntersections(
          new Circle2d(arc.center, arc.from.distanceTo(arc.center)),
          circle,
        )
      : getEllipseCircleIntersections(
          new Ellipse2d(
            arc.center,
            arc.from.distanceTo(arc.center) * 2,
            arc.to.distanceTo(arc.center) * 2,
          ),
          circle,
        );

    return intersections.filter((point: Point2d) =>
      isPointInRadar(point, arc.from, arc.to, arc.center, arc.angle),
    );
  }

  /**
   * Gets intersection points between an ellipse and an arc.
   * @param ellipse The reference ellipse.
   * @param arc The reference arc.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getEllipseArcIntersections(
    ellipse: Ellipse2d,
    arc: Arc2d,
  ): Point2d[] {
    return getArcEllipseIntersections(arc, ellipse);
  }

  /**
   * Gets intersection points between an arc and an ellipse.
   * @param arc The reference arc.
   * @param ellipse The reference ellipse.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getArcEllipseIntersections(
    arc: Arc2d,
    ellipse: Ellipse2d,
  ): Point2d[] {
    const intersections: Point2d[] = arc.isCircular
      ? getCircleEllipseIntersections(
          new Circle2d(arc.center, arc.from.distanceTo(arc.center)),
          ellipse,
        )
      : getEllipseEllipseIntersections(
          new Ellipse2d(
            arc.center,
            arc.from.distanceTo(arc.center) * 2,
            arc.to.distanceTo(arc.center) * 2,
          ),
          ellipse,
        );

    return removeDuplicatedPoints(
      intersections.filter((point: Point2d) =>
        isPointInRadar(point, arc.from, arc.to, arc.center, arc.angle),
      ),
    );
  }

  /**
   * Gets intersection points between two arcs.
   * @param arc1 The first reference arc.
   * @param arc2 The second reference arc.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getArcArcIntersections(arc1: Arc2d, arc2: Arc2d): Point2d[] {
    const arc1Circular = arc1.isCircular;
    const arc2Circular = arc2.isCircular;

    let intersections: Point2d[] = [];

    if (arc1Circular && !arc2Circular) {
      intersections = getCircleEllipseIntersections(
        new Circle2d(arc1.center, arc1.from.distanceTo(arc1.center)),
        new Ellipse2d(
          arc2.center,
          arc2.from.distanceTo(arc2.center) * 2,
          arc2.to.distanceTo(arc2.center) * 2,
        ),
      );
    }

    if (!arc1Circular && arc2Circular) {
      intersections = getEllipseCircleIntersections(
        new Ellipse2d(
          arc1.center,
          arc1.from.distanceTo(arc1.center) * 2,
          arc1.to.distanceTo(arc1.center) * 2,
        ),
        new Circle2d(arc2.center, arc2.from.distanceTo(arc2.center)),
      );
    }

    if (arc1Circular && arc2Circular) {
      intersections = getCircleCircleIntersections(
        new Circle2d(arc1.center, arc1.from.distanceTo(arc1.center)),
        new Circle2d(arc2.center, arc2.from.distanceTo(arc2.center)),
      );
    }

    return removeDuplicatedPoints(
      intersections.filter(
        (point: Point2d) =>
          isPointInRadar(point, arc1.from, arc1.to, arc1.center, arc1.angle) &&
          isPointInRadar(point, arc2.from, arc2.to, arc2.center, arc2.angle),
      ),
    );
  }

  /**
   * Gets intersection points between a line and a sector.
   * @param line The reference line.
   * @param sector The reference sector.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getLineSectorIntersections(
    line: Line2d,
    sector: Sector2d,
  ): Point2d[] {
    return getSectorLineIntersections(sector, line);
  }

  /**
   * Gets intersection points between a sector and a line.
   * @param sector The reference sector.
   * @param line The reference line.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getSectorLineIntersections(
    sector: Sector2d,
    line: Line2d,
  ): Point2d[] {
    const arcIntersections: Point2d[] = getArcLineIntersections(sector, line);

    const fromIntersection: Point2d = getSegmentSegmentIntersection(
      new Line2d(sector.center, sector.from),
      line,
    );
    if (fromIntersection !== null) {
      arcIntersections.push(fromIntersection);
    }

    const toIntersection: Point2d = getSegmentSegmentIntersection(
      new Line2d(sector.center, sector.to),
      line,
    );
    if (toIntersection !== null) {
      arcIntersections.push(toIntersection);
    }

    return removeDuplicatedPoints(arcIntersections);
  }

  /**
   * Gets intersection points between a circle and a sector.
   * @param circle The reference circle.
   * @param sector The reference sector.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getCircleSectorIntersections(
    circle: Circle2d,
    sector: Sector2d,
  ): Point2d[] {
    return getSectorCircleIntersections(sector, circle);
  }

  /**
   * Gets intersection points between a sector and a circle.
   * @param sector The reference sector.
   * @param circle The reference circle.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getSectorCircleIntersections(
    sector: Sector2d,
    circle: Circle2d,
  ): Point2d[] {
    const arcIntersections: Point2d[] = getArcCircleIntersections(
      sector,
      circle,
    );

    const fromIntersections: Point2d[] = getLineCircleIntersections(
      new Line2d(sector.center, sector.from),
      circle,
    );

    const toIntersections: Point2d[] = getLineCircleIntersections(
      new Line2d(sector.center, sector.to),
      circle,
    );

    return removeDuplicatedPoints(
      arcIntersections.concat(fromIntersections, toIntersections),
    );
  }

  /**
   * Gets intersection points between an ellipse and a sector.
   * @param ellipse The reference ellipse.
   * @param sector The reference sector.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getEllipseSectorIntersections(
    ellipse: Ellipse2d,
    sector: Sector2d,
  ): Point2d[] {
    return getSectorEllipseIntersections(sector, ellipse);
  }

  /**
   * Gets intersection points between a sector and an ellipse.
   * @param sector The reference sector.
   * @param ellipse The reference ellipse.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getSectorEllipseIntersections(
    sector: Sector2d,
    ellipse: Ellipse2d,
  ): Point2d[] {
    const arcIntersections: Point2d[] = getArcEllipseIntersections(
      sector,
      ellipse,
    );

    const fromIntersections: Point2d[] = getLineEllipseIntersections(
      new Line2d(sector.center, sector.from),
      ellipse,
    );

    const toIntersections: Point2d[] = getLineEllipseIntersections(
      new Line2d(sector.center, sector.to),
      ellipse,
    );

    return removeDuplicatedPoints(
      arcIntersections.concat(fromIntersections, toIntersections),
    );
  }

  /**
   * Gets intersection points between an arc and a sector.
   * @param arc The reference arc.
   * @param sector The reference sector.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getArcSectorIntersections(
    arc: Arc2d,
    sector: Sector2d,
  ): Point2d[] {
    return getSectorArcIntersections(sector, arc);
  }

  /**
   * Gets intersection points between a sector and an arc.
   * @param sector The reference sector.
   * @param arc The reference arc.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getSectorArcIntersections(
    sector: Sector2d,
    arc: Arc2d,
  ): Point2d[] {
    const arcIntersections: Point2d[] = getArcArcIntersections(sector, arc);

    const fromIntersections: Point2d[] = getLineArcIntersections(
      new Line2d(sector.center, sector.from),
      arc,
    );

    const toIntersections: Point2d[] = getLineArcIntersections(
      new Line2d(sector.center, sector.to),
      arc,
    );

    return removeDuplicatedPoints(
      arcIntersections.concat(fromIntersections, toIntersections),
    );
  }

  /**
   * Gets intersection points between two sectors.
   * @param sector1 The first reference sector.
   * @param sector2 The second reference sector.
   * @returns An array of intersection points if any, otherwise an empty array.
   */
  export function getSectorSectorIntersections(
    sector1: Sector2d,
    sector2: Sector2d,
  ): Point2d[] {
    const arcIntersections: Point2d[] = getArcArcIntersections(
      sector1,
      sector2,
    );
    const sector1Lines: Line2d[] = [
      new Line2d(sector1.center, sector1.from),
      new Line2d(sector1.center, sector1.to),
    ];

    const sector2Lines: Line2d[] = [
      new Line2d(sector2.center, sector2.from),
      new Line2d(sector2.center, sector2.to),
    ];

    const lineIntersections: Point2d[] = [];
    sector1Lines.forEach((s1) => {
      const match1 = getSegmentSegmentIntersection(s1, sector2Lines[0]);
      if (match1 !== null) {
        lineIntersections.push(match1);
      }

      const match2 = getSegmentSegmentIntersection(s1, sector2Lines[1]);
      if (match2 !== null) {
        lineIntersections.push(match2);
      }
    });

    return removeDuplicatedPoints(arcIntersections.concat(lineIntersections));
  }
}
