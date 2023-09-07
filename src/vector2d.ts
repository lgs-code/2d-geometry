/**
 * Defines a vector in two-dimensional coordinates.
 */
export class Vector2d {
  vx: number;
  vy: number;

  constructor(vx: number = 0, vy: number = 0) {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * Creates a Vector from its polar coordinates.
   * @param magnitude The magnitude or length.
   * @param angle The angle in degrees.
   * @returns The Vector in Cartesian coordinates.
   */
  public static fromPolarCoordinates(
    magnitude: number,
    angle: number,
  ): Vector2d {
    let angleRad = (angle * Math.PI) / 180;
    let vx = magnitude * Math.cos(angleRad);
    let vy = magnitude * Math.sin(angleRad);

    return new Vector2d(
      Number.parseFloat(vx.toFixed(2)),
      Number.parseFloat(vy.toFixed(2)),
    );
  }

  /**
   * Gets the magnitude, or length, of the vector.
   */
  get magnitude(): number {
    return Number.parseFloat(Math.hypot(this.vx - 0, this.vy - 0).toFixed(2));
  }

  /**
   * Gets the angle, in degrees, from the x axis.
   */
  get angle(): number {
    return Number.parseFloat(
      (Math.atan(this.vy / this.vx) * (180 / Math.PI)).toFixed(2),
    );
  }

  add(value: Vector2d): void {
    this.vx += value.vx;
    this.vy += value.vy;
  }

  substract(value: Vector2d): void {
    this.vx -= value.vx;
    this.vy -= value.vy;
  }

  multiply(scalar: number): void {
    this.vx *= scalar;
    this.vy *= scalar;
  }

  divide(scalar: number): void {
    this.vx /= scalar;
    this.vy /= scalar;
  }

  dot(value: Vector2d): number {
    return this.vx * value.vx + this.vy * value.vy;
  }
}
