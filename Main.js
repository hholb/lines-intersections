import {LineSegment2D, Point2D} from "./PointsAndLines.js";

let points = [];
let lines = [];

/**
 Clear the canvas and reset the points and lines arrays.
 */
function clearCanvas() {
    console.log("Clearing canvas");
    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = [];
    points = [];
}

/**
 Resize the canvas to equal its display size.
 */
function resizeCanvas() {
    const canvas = document.getElementById("main-canvas");
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    const dpr = devicePixelRatio || 1;

    if (needResize) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
    }


    clearCanvas();
    draw();
}

/**
 Find intersections between all line segments on the canvas.
 */
async function findIntersections() {
    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');
    if (lines.length < 2) {
        await drawNoIntersectionsMessage();
        return;
    }
    console.log("Finding intersections...");
    let intersectionCount = 0;
    for (const line1 of lines) {
        for (const other of lines) {
            if (line1 === other) {
                break;
            }
            const intersection = line1.getIntersectionPoint(other);
            if (intersection === undefined) {

            } else {
                intersectionCount++;
                const path = new Path2D();
                const circleRadius = Math.max(canvas.clientWidth / 130, 8);
                path.arc(intersection.x, intersection.y, circleRadius, 0, 2 * Math.PI);
                ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}`;
                ctx.stroke(path);
            }
        }
    }
    if (intersectionCount < 1) {
        await drawNoIntersectionsMessage();
    }
}

/**
 Draw a message on the canvas saying no intersections were found.
 Clear the canvas after a delay.
 */
async function drawNoIntersectionsMessage() {
    console.log("Did not find any intersection points.");
    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');
    const text = "No Intersections Found.";
    const x = canvas.clientWidth / 2.75;
    const y = canvas.clientHeight - 20;

    ctx.font = "20px Arial";
    ctx.fillText(text, x, y);

    // Wait a couple seconds and clear the canvas.
    await new Promise(resolve => setTimeout(() => {
        clearCanvas();
    }, 2000));
}

/**
 Create a new point object and add it to the points array.
 */
function createPoint(event) {
    const point = new Point2D(event.offsetX, event.offsetY);
    console.log(`Creating point at: ${point.x}, ${point.y}`);
    points.push(point);
}

/**
 Draw each point from the points array on the canvas.
 */
function drawPoints() {
    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext('2d');
    for (const point of points) {
        console.log(`Drawing Point(${point.x}, ${point.y}`);
        const path = new Path2D();
        const pointRadius = Math.max(canvas.clientWidth / 150, 5);
        path.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
        ctx.fill(path);
    }
}

/**
 Create a generator that yields paris of points.
 */
function* makePointsGenerator() {
    if (points.length < 2) return;
    for (let i = 1; i < points.length; i += 2) {
        yield {point1: points[i - 1], point2: points[i]};
    }
}

/**
 Create LineSegments from each pair of points in the points array.
 */
function createLineSegments() {
    if (points.length % 2 !== 0) {
        console.log("Uneven number of points. Cannot determine where to create line segments.");
        return;
    }
    lines = [];
    const pointsIter = makePointsGenerator();
    for (const {point1, point2} of pointsIter) {
        const line = new LineSegment2D(point1, point2);
        lines.push(line);
    }
}

/**
 Draw each LineSegment in the lines array to the canvas.
 */
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
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
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