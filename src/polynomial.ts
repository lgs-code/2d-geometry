/* istanbul ignore file */

export class Polynomial {
  static TOLERANCE: number = 1e-6;
  static ACCURACY: number = 6;

  private _values: number[];

  constructor(...args: number[]) {
    this._values = [...args].reverse();
  }

  get degree(): number {
    return this._values.length - 1;
  }

  simplify(): void {
    for (let i = this.degree; i >= 0; i--) {
      if (Math.abs(this._values[i]) <= Polynomial.TOLERANCE) {
        this._values.pop();
      } else {
        break;
      }
    }
  }

  getLinearRoot(): number[] {
    const results: number[] = [];

    if (this._values[1] !== 0) {
      results.push(-this._values[0] / this._values[1]);
    }

    return results;
  }

  getQuadraticRoots(): number[] {
    const results: number[] = [];

    if (this.degree === 2) {
      const a = this._values[2];
      const b = this._values[1] / a;
      const c = this._values[0] / a;
      const d = b * b - 4 * c;

      if (d > 0) {
        const e = Math.sqrt(d);
        results.push(0.5 * (-b + e));
        results.push(0.5 * (-b - e));
      } else if (d === 0) {
        results.push(0.5 * -b);
      }
    }

    return results;
  }

  getCubicRoots(): number[] {
    const results: number[] = [];

    if (this.degree === 3) {
      const c3 = this._values[3];
      const c2 = this._values[2] / c3;
      const c1 = this._values[1] / c3;
      const c0 = this._values[0] / c3;
      const a = (3 * c1 - c2 * c2) / 3;
      const b = (2 * c2 * c2 * c2 - 9 * c1 * c2 + 27 * c0) / 27;
      const offset = c2 / 3;
      const halfB = b / 2;
      let discrim = (b * b) / 4 + (a * a * a) / 27;

      if (Math.abs(discrim) <= Polynomial.TOLERANCE) {
        discrim = 0;
      }

      if (discrim > 0) {
        const e = Math.sqrt(discrim);

        let root;
        let tmp = -halfB + e;

        if (tmp >= 0) root = Math.pow(tmp, 1 / 3);
        else root = -Math.pow(-tmp, 1 / 3);

        tmp = -halfB - e;

        if (tmp >= 0) root += Math.pow(tmp, 1 / 3);
        else root -= Math.pow(-tmp, 1 / 3);

        results.push(root - offset);
      } else if (discrim < 0) {
        const distance = Math.sqrt(-a / 3);
        const angle = Math.atan2(Math.sqrt(-discrim), -halfB) / 3;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const sqrt3 = Math.sqrt(3);

        results.push(2 * distance * cos - offset);
        results.push(-distance * (cos + sqrt3 * sin) - offset);
        results.push(-distance * (cos - sqrt3 * sin) - offset);
      } else {
        let tmp;

        if (halfB >= 0) tmp = -Math.pow(halfB, 1 / 3);
        else tmp = Math.pow(-halfB, 1 / 3);

        results.push(2 * tmp - offset);
        results.push(-tmp - offset);
      }
    }
    return results;
  }

  getQuarticRoots(): number[] {
    const results: number[] = [];

    if (this.degree === 4) {
      const c4 = this._values[4];
      const c3 = this._values[3] / c4;
      const c2 = this._values[2] / c4;
      const c1 = this._values[1] / c4;
      const c0 = this._values[0] / c4;

      const resolveRoots = new Polynomial(
        1,
        -c2,
        c3 * c1 - 4 * c0,
        -c3 * c3 * c0 + 4 * c2 * c0 - c1 * c1,
      ).getCubicRoots();

      const y = resolveRoots[0];

      let discrim = (c3 * c3) / 4 - c2 + y;

      if (Math.abs(discrim) <= Polynomial.TOLERANCE) {
        discrim = 0;
      }

      if (discrim > 0) {
        const e = Math.sqrt(discrim);
        const t1 = (3 * c3 * c3) / 4 - e * e - 2 * c2;
        const t2 = (4 * c3 * c2 - 8 * c1 - c3 * c3 * c3) / (4 * e);

        let plus = t1 + t2;
        let minus = t1 - t2;

        if (Math.abs(plus) <= Polynomial.TOLERANCE) {
          plus = 0;
        }
        if (Math.abs(minus) <= Polynomial.TOLERANCE) {
          minus = 0;
        }

        if (plus >= 0) {
          const f = Math.sqrt(plus);
          results.push(-c3 / 4 + (e + f) / 2);
          results.push(-c3 / 4 + (e - f) / 2);
        }

        if (minus >= 0) {
          const f = Math.sqrt(minus);
          results.push(-c3 / 4 + (f - e) / 2);
          results.push(-c3 / 4 - (f + e) / 2);
        }
      } else if (discrim < 0) {
      } else {
        let t2 = y * y - 4 * c0;
        if (t2 >= -Polynomial.TOLERANCE) {
          if (t2 < 0) t2 = 0;
          t2 = 2 * Math.sqrt(t2);

          let t1 = (3 * c3 * c3) / 4 - 2 * c2;
          if (t1 + t2 >= Polynomial.TOLERANCE) {
            const d = Math.sqrt(t1 + t2);
            results.push(-c3 / 4 + d / 2);
            results.push(-c3 / 4 - d / 2);
          }

          if (t1 - t2 >= Polynomial.TOLERANCE) {
            const d = Math.sqrt(t1 - t2);
            results.push(-c3 / 4 + d / 2);
            results.push(-c3 / 4 - d / 2);
          }
        }
      }
    }
    return results;
  }

  getRoots(): number[] {
    this.simplify();

    switch (this.degree) {
      case 1:
        return this.getLinearRoot();

      case 2:
        return this.getQuadraticRoots();

      case 3:
        return this.getCubicRoots();

      case 4:
        return this.getQuarticRoots();

      default:
        return [];
    }
  }
}
