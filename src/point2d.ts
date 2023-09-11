import { Vector2d } from "./vector2d";

/**
 * Defines a point in two-dimensional coordinates.
 */
export class Point2d {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  clone(): Point2d {
    return new Point2d(this.x, this.y);
  }

  add(value: Point2d): void {
    this.x += value.x;
    this.y += value.y;
  }

  substract(value: Point2d): void {
    this.x -= value.x;
    this.y -= value.y;
  }

  multiply(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
  }

  divide(scalar: number): void {
    this.x /= scalar;
    this.y /= scalar;
  }

  /**
   * Returns the distance to the given point.
   * @param value The point to get the distance from.
   */
  distanceTo(value: Point2d): number {
    return Number.parseFloat(
      Math.hypot(value.x - this.x, value.y - this.y).toFixed(2),
    );
  }

  /**
   * Translates the point using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void {
    this.x += vector.vx;
    this.y += vector.vy;
  }

  /**
   * Rotates the point by the given angle in degree, around a point.
   * @param angle The rotation angle.
   * @param origin The origin from which the rotation is supposed to be done.
   */
  rotate(angle: number, origin: Point2d = new Point2d()): void {
    if (angle === 0 || angle === 360) {
      return;
    }

    let angleRad = (angle * Math.PI) / 180;

    // make the rotation point as the new origin
    let xo = this.x - origin.x;
    let yo = this.y - origin.y;

    // rotate
    let xp = xo * Math.cos(angleRad) - yo * Math.sin(angleRad);
    let yp = yo * Math.cos(angleRad) + xo * Math.sin(angleRad);

    // round them properly
    xp = Number.parseFloat(xp.toFixed(2));
    yp = Number.parseFloat(yp.toFixed(2));

    // move back the origin [0,0]
    this.x = xp + origin.x;
    this.y = yp + origin.y;
  }
}
