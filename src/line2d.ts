import { Point2d } from "./point2d";
import { Vector2d } from "./vector2d";
import { IShape2d } from "./ishape2d";
import { Intersection2d } from "./intersection2d";

/**
 * Defines a line in two-dimensional coordinates.
 */
export class Line2d implements IShape2d {
  private _p1: Point2d;
  private _p2: Point2d;

  constructor(p1: Point2d, p2: Point2d) {
    this._p1 = p1;
    this._p2 = p2;
  }

  /**
   * Gets the length of the line starting at (x1,y1) and closing at (x2,y2).
   * @param p1x x coordinate of start of the line.
   * @param p1y y coordinate of start of the line.
   * @param p2x x coordinate of end of the line.
   * @param p2y y coordinate of end of the line.
   * @returns The length.
   */
  public static getLength(
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
  ): number {
    return Point2d.getDistance(p1x, p1y, p2x, p2y);
  }

  private static reorder(l1: Line2d, l2: Line2d): Line2d {
    const ac = Line2d.getLength(l2.p1.x, l2.p1.y, l1.p1.x, l1.p1.y); // A->C
    const ad = Line2d.getLength(l2.p1.x, l2.p1.y, l1.p2.x, l1.p2.y); // A->D
    const bc = Line2d.getLength(l2.p2.x, l2.p2.y, l1.p1.x, l1.p1.y); // A->C
    const bd = Line2d.getLength(l2.p2.x, l2.p2.y, l1.p2.x, l1.p2.y); // A->D

    const min = Math.min(ac, ad, bc, bd);

    switch (min) {
      case bc:
      case ad:
        return new Line2d(l1.p2, l1.p1);

      case ac:
      case bd:
      default:
        return l1;
    }
  }

  /**
   * Gets the angle between two lines.
   * @param p1x x-coordinate of the starting point of the first line.
   * @param p1y y-coordinate of the starting point of the first line.
   * @param p2x x-coordinate of the ending point of the first line.
   * @param p2y y-coordinate of the ending point of the first line.
   * @param p3x x-coordinate of the starting point of the second line.
   * @param p3y y-coordinate of the starting point of the second line.
   * @param p4x x-coordinate of the ending point of the second line.
   * @param p4y y-coordinate of the ending point of the second line.
   * @param keepOrientation A value indicating if we keep the orientation, aka knowing if the angle is clockwise or not.
   */
  public static getAngleBetween(
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    p3x: number,
    p3y: number,
    p4x: number,
    p4y: number,
    keepOrientation: boolean = true,
  ): number {
    let l1 = new Line2d(new Point2d(p1x, p1y), new Point2d(p2x, p2y));
    let l2 = Line2d.reorder(
      new Line2d(new Point2d(p3x, p3y), new Point2d(p4x, p4y)),
      l1,
    );

    const dAx = l1.p2.x - l1.p1.x;
    const dAy = l1.p2.y - l1.p1.y;
    const dBx = l2.p2.x - l2.p1.x;
    const dBy = l2.p2.y - l2.p1.y;

    const angleRad = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    const angleDeg = Number.parseFloat((angleRad * (180 / Math.PI)).toFixed(2));

    return keepOrientation ? angleDeg : Math.abs(angleDeg);
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
   * @param keepOrientation A value indicating if we keep the orientation, aka knowing if the angle is clockwise or not.
   * @returns The angle.
   */
  angleTo(line: Line2d, keepOrientation: boolean = true): number {
    return Line2d.getAngleBetween(
      this.p1.x,
      this.p1.y,
      this.p2.x,
      this.p2.y,
      line.p1.x,
      line.p1.y,
      line.p2.x,
      line.p2.y,
      keepOrientation,
    );
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

    if (!this.isOnLine(p3)) {
      return null!;
    }

    let p4 = new Point2d();

    if (this.isHorizontal) {
      p4.x = p3.x;
      p4.y = p1.y + (clockwise === true ? -length : length);
    } else if (this.isVertical) {
      p4.x = p1.x + (clockwise === true ? length : -length);
      p4.y = p3.y;
    } else {
      const a = this.angleTo(new Line2d(p1, new Point2d(p1.x + length, p1.y)));

      const teta = (90 - a) / (180 / Math.PI);

      p4.x = Number.parseFloat(
        (p3.x + length * Math.cos(teta) * (clockwise ? -1 : 1)).toFixed(2),
      );
      p4.y = Number.parseFloat(
        (p3.y + length * Math.sin(teta) * (clockwise ? -1 : 1)).toFixed(2),
      );
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
    return Intersection2d.isPointOnLine(point, this, threshold);
  }

  /**
   * Checks if the given point is in the line.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on the line.
   */
  isOnEdge(point: Point2d, threshold: number = 0): boolean {
    return Intersection2d.isPointOnSegment(point, this, threshold);
  }

  /**
   * Checks if the line is parallel to another one.
   * @param line The reference line.
   * @returns true both lines are parallel.
   */
  isParallelTo(line: Line2d): boolean {
    return Intersection2d.areLinesParallel(this, line);
  }

  /**
   * Checks if the current line intersect with the given shape.
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
