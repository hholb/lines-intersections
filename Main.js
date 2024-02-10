import {Point, LineSegment} from "./PointsAndLines.js";

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

function resizeCanvas() {
    const canvas = document.getElementById("main-canvas");
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    draw();
}

// Find intersections between all line segments on the canvas.
function findIntersections() {
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

function createPoint(event) {
    const point = new Point(event.offsetX, event.offsetY);
    console.log(`Creating point at: ${point.x}, ${point.y}`);
    points.push(point);
}

function drawPoints() {
    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');
    for (const point of points) {
        console.log(`Drawing Point(${point.x}, ${point.y}`);
        const path = new Path2D();
        path.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill(path);
    }
}

function* makePointsGenerator() {
    if (points.length < 2) return;
    for (let i = 1; i < points.length; i += 2) {
        yield {point1: points[i - 1], point2: points[i]};
    }
}

function createLineSegments(event) {
    if (points.length % 2 !== 0) {
        console.log("Uneven number of points. Cannot determine where to create line segments.");
        return;
    }
    lines = [];
    const pointsIter = makePointsGenerator();
    for (const {point1, point2} of pointsIter) {
        const line = new LineSegment(point1, point2);
        lines.push(line);
    }
}

function drawLines() {
    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');

    for (const line of lines) {
        const point1 = line.point1;
        const point2 = line.point2;
        console.log(`Drawing line segment between Point(${point1.x}, ${point1.y}) and Point(${point2.x}, ${point2.y})`);
        const path = new Path2D();
        path.moveTo(line.point1.x, line.point1.y);
        path.lineTo(line.point2.x, line.point2.y);
        ctx.stroke(path);
    }
}

function draw() {
    drawPoints();
    drawLines();
}

function main() {
    // setup button handlers
    const clearButton = document.getElementById("clear-canvas-button");
    clearButton.onclick = clearCanvas;
    const intersectionButton = document.getElementById("find-intersection-button");
    intersectionButton.onclick = findIntersections;

    // setup canvas interaction handlers
    const canvas = document.getElementById("main-canvas");
    canvas.addEventListener("pointerdown", createPoint);
    canvas.addEventListener("pointerdown", draw);
    canvas.addEventListener("pointerup", createLineSegments);
    canvas.addEventListener("pointerup", drawLines);
    window.addEventListener('resize', resizeCanvas);
}

window.onload = () => {
    resizeCanvas();
    main();
};