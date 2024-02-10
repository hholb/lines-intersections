import {Vector2D} from "./Vector.js";

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Return a new Vector2D(x, y) resulting from the subtraction of p1 from p2.
    static subtract(p1, p2) {
        return new Vector2D(p2.x - p1.x, p2.y - p1.y);
    }
}

export class LineSegment {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }

    intersectsWith(other) {
        return this.getIntersectionPoint(other) !== undefined;
    }

    getIntersectionPoint(other) {
        const x1 = this.point1.x;
        const x2 = this.point2.x;
        const y1 = this.point1.y;
        const y2 = this.point2.y;

        const x3 = other.point1.x;
        const x4 = other.point2.x;
        const y3 = other.point1.y;
        const y4 = other.point2.y;

        const v1 = Vector2D.normalize(Point.subtract(this.point1, this.point2));
        const v2 = Vector2D.normalize(Point.subtract(other.point1, other.point2));

        const v1CrossV2 = Vector2D.cross(v1, v2);
        if (v1CrossV2 === 0) {
            console.log("Vectors are collinear, no intersections possible.");
            return;
        }

        // Solve:
        // x1 + t1(x2 - x1) = x3 + t2(x4 - x3) and
        // y1 + t1(y2 - y1) = y3 + t2(y4 - y3)
        // to find t1 and t2 in terms of the points.
        const t2Numerator = ((y1 - y3) * (x2 - x1) + (x3 - x1) * (y2 - y1)) / ((x2 - x1) * (y4 - y3));
        const t2Denominator = 1 - ((x4 - x3) * (y2 - y1)) / ((x2 - x1) * (y4 - y3));
        const t2 = t2Numerator / t2Denominator;
        const t1 = ((x3 - x1) + t2 * (x4 - x3)) / (x2 - x1);

        console.log(`t1: ${t1}, t2: ${t2}`);

        // Check if t1 or t2 are outside the line segments.
        if (t1 < 0 || t1 > 1) {
            console.log("Intersection is outside of line segment.");
            return;
        }
        if (t2 < 0 || t2 > 1) {
            console.log("Intersection is outside of line segment.");
            return;
        }

        // We have an intersections! plug t1 back into the parametric equations.
        const xIntersect = x1 + t1 * (x2 - x1);
        const yIntersect = y1 + t1 * (y2 - y1);
        console.log(`Found intersect at Point(${xIntersect}, ${yIntersect}`);
        return new Point(xIntersect, yIntersect);
    }
}
