/**
 * Defines a vector in two-dimensional coordinates.
 */
export class Vector2d {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
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
    let x = magnitude * Math.cos(angleRad);
    let y = magnitude * Math.sin(angleRad);

    return new Vector2d(
      Number.parseFloat(x.toFixed(2)),
      Number.parseFloat(y.toFixed(2)),
    );
  }

  /**
   * Gets the magnitude, or length, of the vector.
   */
  get magnitude(): number {
    return Number.parseFloat(Math.hypot(this.x - 0, this.y - 0).toFixed(2));
  }

  /**
   * Gets the angle, in degrees, from the x axis.
   */
  get angle(): number {
    return Number.parseFloat(
      (Math.atan(this.y / this.x) * (180 / Math.PI)).toFixed(2),
    );
  }

  add(value: Vector2d): void {
    this.x += value.x;
    this.y += value.y;
  }

  substract(value: Vector2d): void {
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

  dot(value: Vector2d): number {
    return this.x * value.x + this.y * value.y;
  }
}
