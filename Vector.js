export class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(vec1, vec2) {
        return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    static subtract(vec1, vec2) {
        return new Vector2D(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    static normalize(vec2) {
        const magnitude = Vector2D.magnitude(vec2);
        return new Vector2D(vec2.x / magnitude, vec2.y / magnitude);
    }

    static magnitude(vec2) {
        return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
    }

    static dot(vec1, vec2) {
        const vec1Norm = Vector2D.normalize(vec1);
        const vec2Norm = Vector2D.normalize(vec2);
        return vec1Norm.x * vec2Norm.x + vec1Norm.y * vec2Norm.y;
    }

    static cross(vec1, vec2) {
        const vec1Norm = Vector2D.normalize(vec1);
        const vec2Norm = Vector2D.normalize(vec2);
        return vec1.x * vec2.y - vec1.y * vec2.x;
    }
}
