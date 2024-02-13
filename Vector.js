/**
 A 2-dimensional vector with components [x, y].
 */
export class Vector2D {
    /**
     Create a new Vector2D with the given values for x and y.
     @param x {Number} x component
     @param y {Number} y component
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Add vec1 to vec2.
     * @param vec1 {Vector2D}
     * @param vec2 {Vector2D}
     * @returns {Vector2D}
     */
    static add(vec1, vec2) {
        return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    /**
     * Subtract vec2 from vec1.
     * @param vec1 {Vector2D}
     * @param vec2 {Vector2D}
     * @returns {Vector2D}
     */
    static subtract(vec1, vec2) {
        return new Vector2D(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    /**
     * Normalize the given vector.
     * @param vec {Vector2D}
     * @returns {Vector2D}
     */
    static normalize(vec) {
        const magnitude = Vector2D.magnitude(vec);
        return new Vector2D(vec.x / magnitude, vec.y / magnitude);
    }

    /**
     * Compute the magnitude of the given vector.
     * @param vec {Vector2D}
     * @returns {number}
     */
    static magnitude(vec) {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }

    /**
     * Compute the dot product of the given vectors.
     * @param vec1 {Vector2D}
     * @param vec2 {Vector2D}
     * @returns {number}
     */
    static dot(vec1, vec2) {
        const vec1Norm = Vector2D.normalize(vec1);
        const vec2Norm = Vector2D.normalize(vec2);
        return vec1Norm.x * vec2Norm.x + vec1Norm.y * vec2Norm.y;
    }

    /**
     * Compute the cross product of the given vectors.
     * @param vec1 {Vector2D}
     * @param vec2 {Vector2D}
     * @returns {number}
     */
    static cross(vec1, vec2) {
        const vec1Norm = Vector2D.normalize(vec1);
        const vec2Norm = Vector2D.normalize(vec2);
        return vec1Norm.x * vec2Norm.y - vec1Norm.y * vec2Norm.x;
    }
}
