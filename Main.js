import {Vector2D} from "./Vector.js";

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Return a new Vector2D(x, y) resulting from the subtraction of p1 from p2.
    static subtract(p1, p2) {
        return new Vector2D(p2.x - p1.x, p2.y - p1.y);
    }
}

class LineSegment {
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

let points = [];
let lines = [];

function clearCanvas() {
    console.log("Clearing canvas");
    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    lines = [];
}

// Find intersections between all line segments on the canvas.
function findIntersection() {
    if (lines.length < 2) {
        console.log('Not enough line segments to have any intersections.');
        return;
    }
    console.log("Finding intersections...");
    for (const line1 of lines) {
        for (const other of lines) {
            if (line1 === other) {
                break;
            }
            const line = line1;
            const intersection = line.getIntersectionPoint(other);
            if (intersection === undefined) {
                console.log("Did not find any intersection points.");
            } else {
                const canvas = document.getElementById("main-canvas");
                const ctx = canvas.getContext('2d');
                const path = new Path2D();
                path.arc(intersection.x, intersection.y, 5, 0, 2 * Math.PI);
                ctx.stroke(path);
            }
        }
    }
}

function drawPoint(event) {
    const point = new Point(event.offsetX, event.offsetY);
    points.push(point);

    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');

    console.log(`Drawing point at: ${point.x}, ${point.y}`);
    const path = new Path2D();
    path.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fill(path);
}

function drawLine() {
    if (points.length !== 2) {
        console.log("Not enough points to draw a line segment.");
        return;
    }

    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');

    const point1 = points.shift();
    const point2 = points.shift();
    const line = new LineSegment(point1, point2);
    lines.push(line);

    console.log(`Drawing line segment between Point(${point1.x}, ${point1.y}) and Point(${point2.x}, ${point2.y})`);
    const path = new Path2D();
    path.moveTo(line.point1.x, line.point1.y);
    path.lineTo(line.point2.x, line.point2.y);
    ctx.stroke(path);
}

function initialize() {
    // setup button handlers
    const clearButton = document.getElementById("clear-canvas-button");
    clearButton.onclick = clearCanvas;
    const intersectionButton = document.getElementById("find-intersection-button");
    intersectionButton.onclick = findIntersection;

    // setup canvas interaction handlers
    const canvas = document.getElementById("main-canvas");
    canvas.addEventListener("pointerdown", drawPoint);
    canvas.addEventListener("pointerup", drawLine);
}

function main() {
    initialize();
}

window.onload = () => {
    main();
};