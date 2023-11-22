import { Point2d } from "./point2d";
import { Polygon2d } from "./polygon2d";
import { Circle2d } from "./circle2d";
import { Ellipse2d } from "./ellipse2d";
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

  /**
   * Gets the length of the line starting at (x1,y1) and closing at (x2,y2).
   * @param x1 x coordinate of start of the line.
   * @param y1 y coordinate of start of the line.
   * @param x2 x coordinate of end of the line.
   * @param y2 y coordinate of end of the line.
   * @returns The length.
   */
  public static getLength(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number {
    return Point2d.getDistance(x1, y1, x2, y2);
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
    return Line2d.getLength(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }

  /**
   * Gets the center of the line.
   */
  get centroid(): Point2d {
    return new Point2d(
      (this.p1.x + this.p2.x) / 2,
      (this.p1.y + this.p2.y) / 2,
    );
  }

  /**
   * Checks if the line is vertical.
   * @returns true is this is the case.
   */
  get isVertical(): boolean {
    return this.p2.x - this.p1.x === 0;
  }

  /**
   * Checks if the line is horizontal.
   * @returns true is this is the case.
   */
  get isHorizontal(): boolean {
    return this.p2.y - this.p1.y === 0;
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

  private dot(line: Line2d): number {
    // make the two lines same origin
    const vt = new Vector2d(this.p1.x - line.p1.x, this.p1.y - line.p1.y);
    const lp = line.clone();
    lp.translate(vt);

    const v1 = new Vector2d(this.p2.x, this.p2.y);
    const v2 = new Vector2d(lp.p2.x, lp.p2.y);

    return v1.dot(v2);
  }

  /**
   * Does the current line goes in the same direction as the given one.
   * @param line The comparision line.
   * @returns true if this is the case, otherwise false.
   */
  goesSameDirection(line: Line2d): boolean {
    return this.dot(line) > 0;
  }

  /**
   * Gets the angle between the given line.
   * @param line The reference line.
   * @param interiorAngle A value indicating if this is the interior that is expected.
   * @returns The angle.
   */
  angleTo(line: Line2d, interiorAngle: boolean = true): number {
    const dAx = this.p2.x - this.p1.x;
    const dAy = this.p2.y - this.p1.y;
    const dBx = line.p2.x - line.p1.x;
    const dBy = line.p2.y - line.p1.y;

    const angleRad = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    const angleDeg = Number.parseFloat((angleRad * (180 / Math.PI)).toFixed(2));

    if (angleDeg == 0) {
      return 0;
    }

    if (interiorAngle) {
      if (this.p2.x <= line.p1.x && Math.abs(angleDeg) <= 90) {
        return 180 - angleDeg;
      }

      if (angleDeg < 0) {
        return 180 + angleDeg;
      }
    }

    return angleDeg;
  }

  /**
   * Gets a line having the given angle to the current one.
   * @param angle The desired angle.
   * @param length The length of the line (default value is 20)
   * @returns The resulting line.
   */
  getLineAtAngle(angle: number, length: number = 20): Line2d {
    if (this.isHorizontal && (angle === 0 || Math.abs(angle) === 360)) {
      return new Line2d(
        this.p1.clone(),
        new Point2d(this.p1.x + length, this.p1.y),
      );
    }

    if (this.isVertical) {
      if (angle === 0 || Math.abs(angle) === 360) {
        return new Line2d(
          this.p1.clone(),
          new Point2d(this.p1.x, this.p1.y + length),
        );
      } else if (Math.abs(angle) === 180) {
        return new Line2d(
          this.p1.clone(),
          new Point2d(this.p1.x, this.p1.y - length),
        );
      }
    }

    const angleRad = angle * (Math.PI / 180);
    const invert = this.isVertical;

    const x = Number.parseFloat(
      (this.p1.x + Math.cos(angleRad) * length).toFixed(3),
    );

    const y = Number.parseFloat(
      (this.p1.y + Math.sin(angleRad) * length).toFixed(3),
    );

    return new Line2d(
      this.p1.clone(),
      new Point2d(invert ? -y : x, invert ? x : y),
    );
  }

  /**
   * Gets the orthogonal line passing through the given point.
   * @param p3 The point to pass through.
   * @returns The orthogonal line.
   */
  getOrthogonalLineThrough(p3: Point2d): Line2d {
    const p1 = this.p1;
    const p2 = this.p2;

    let p4 = new Point2d();

    if (this.isHorizontal) {
      p4.x = p3.x;
      p4.y = p1.y;
    } else if (this.isVertical) {
      p4.x = p1.x;
      p4.y = p3.y;
    } else {
      var gradientofThis = (p1.y - p2.y) / (p1.x - p2.x);
      var interceptOfThis = p1.y - gradientofThis * p1.x;

      var gradientOfOrtho = -1 / gradientofThis;
      var interceptOfOrtho = p3.y - gradientOfOrtho * p3.x;

      p4.x =
        (interceptOfThis - interceptOfOrtho) /
        (gradientOfOrtho - gradientofThis);
      p4.y = gradientOfOrtho * p4.x + interceptOfOrtho;
    }

    return new Line2d(p4, p3);
  }

  /**
   * Gets the orthogonal line passing starting at given point on the line.
   * @param p3 The point to start from.
   * @param length Expected length of the line (default value is 20)
   * @param clockwise A value indicating the direction of the line (default value is false)
   * @returns The orthogonal line.
   */
  getOrthogonalLineFrom(
    p3: Point2d,
    length: number = 20,
    clockwise: boolean = false,
  ): Line2d {
    const p1 = this.p1;
    const p2 = this.p2;

    if (!this.isOnLine(p3)) {
      return null;
    }

    let p4 = new Point2d();

    if (this.isHorizontal) {
      p4.x = p3.x;
      p4.y = p1.y + (clockwise === true ? -length : length);
    } else if (this.isVertical) {
      p4.x = p1.x + (clockwise === true ? length : -length);
      p4.y = p3.y;
    } else {
      const a = this.angleTo(
        new Line2d(
          p1,
          new Point2d(p1.x + length * (clockwise === true ? -1 : 1), p1.y),
        ),
        false,
      );
      const teta = (90 - a) / (180 / Math.PI);

      p4.x = Number.parseFloat((p3.x + length * Math.cos(teta)).toFixed(2));
      p4.y = Number.parseFloat((p3.y + length * Math.sin(teta)).toFixed(2));
    }

    return new Line2d(p3, p4);
  }

  /**
   * Is the current line perpendicular to the given one.
   * @param line The comparision line.
   * @returns true if this the case, otherwise false.
   */
  isOrthogonalTo(line: Line2d): boolean {
    let m1: number, m2: number;

    // both lines have infinite slope
    if (this.isVertical && line.isVertical) {
      return false;
    }

    // only line 1 has infinite slope
    if (this.isVertical) {
      m2 = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);

      return m2 === 0;
    }

    // only line 2 has infinite slope
    if (line.isVertical) {
      m1 = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);

      return m1 === 0;
    }

    // find slopes of the lines
    m1 = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
    m2 = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);

    // Check if their product is -1
    return m1 * m2 === -1;
  }

  /**
   * Checks if the given point is in the line.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on the line.
   */
  isOnLine(point: Point2d, threshold: number = 0): boolean {
    return Math.round(this.distanceTo(point)) <= threshold;
  }

  /**
   * Checks if the given point is in the line.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on the line.
   */
  isOnSegment(point: Point2d, threshold: number = 0): boolean {
    return (
      this.isOnLine(point, threshold) &&
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
   * Checks if the given quadrilateral intersect with the current line.
   * @param rect The reference quadrilateral.
   * @returns true if both intersect.
   */
  doesIntersect(polygon: Polygon2d): boolean;
  /**
   * Checks if the given circle intersect with the current line.
   * @param circle The reference circle.
   * @returns true if both intersect.
   */
  doesIntersect(circle: Circle2d): boolean;
  /**
   * Checks if the given ellipse intersect with the current line.
   * @param circle The reference ellipse.
   * @returns true if both intersect.
   */
  doesIntersect(ellipse: Ellipse2d): boolean;
  doesIntersect(item: Line2d | Polygon2d | Circle2d | Ellipse2d): boolean {
    if (item instanceof Line2d) {
      return this.getIntersectionWithSegment(item) !== null;
    } else if (item instanceof Polygon2d) {
      return item.doesIntersect(this);
    } else if (item instanceof Circle2d) {
      return item.doesIntersect(this);
    } else {
      // instanceof Ellipse2d
      return item.doesIntersect(this);
    }
  }

  private getDenominator(line: Line2d): number {
    return (
      (this.p1.x - this.p2.x) * (line.p1.y - line.p2.y) -
      (this.p1.y - this.p2.y) * (line.p1.x - line.p2.x)
    );
  }

  /**
   * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection}
   * @see {@link https://en.wikipedia.org/wiki/Intersection_(geometry)}
   */
  getIntersectionWithLine(line: Line2d): Point2d {
    if (this.isParallelTo(line)) {
      return null;
    }

    const denom = this.getDenominator(line);
    const deta = this.p1.x * this.p2.y - this.p1.y * this.p2.x;
    const detb = line.p1.x * line.p2.y - line.p1.y * line.p2.x;

    const px =
      (deta * (line.p1.x - line.p2.x) - (this.p1.x - this.p2.x) * detb) / denom;

    const py =
      (deta * (line.p1.y - line.p2.y) - (this.p1.y - this.p2.y) * detb) / denom;

    return new Point2d(
      Number.parseFloat(px.toFixed(2)),
      Number.parseFloat(py.toFixed(2)),
    );
  }

  getIntersectionWithSegment(line: Line2d): Point2d {
    const theoricalPoint = this.getIntersectionWithLine(line);
    return theoricalPoint != null &&
      this.isOnSegment(theoricalPoint) &&
      line.isOnSegment(theoricalPoint)
      ? theoricalPoint
      : null;
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
      const p = this.getIntersectionWithSegment(item);
      return p !== null ? [p] : [];
    } else if (item instanceof Polygon2d) {
      return item.getIntersectionPoints(this);
    } else if (item instanceof Circle2d) {
      return item.getIntersectionPoints(this);
    } else {
      // instanceof Ellipse2d
      return item.getIntersectionPoints(this);
    }
  }
}
