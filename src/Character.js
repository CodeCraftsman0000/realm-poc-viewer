/**
 * Character Class
 * 
 * This class represents a character that can move around in a 2D space
 * and interact with other objects. It includes basic movement controls
 * and collision detection.
 */
export class Character {
    /**
     * Creates a new character at the specified position
     * @param {number} startX - The initial x-coordinate
     * @param {number} startY - The initial y-coordinate
     * @param {number} speed - Movement speed (default: 10)
     * @param {Object} boundary - Optional boundary limits
     */
    constructor(startX = 0, startY = 0, speed = 10, boundary) {
        this.x = startX;
        this.y = startY;
        this.speed = speed;
        this.direction = { x: 0, y: 0 };
        this.boundary = boundary || {
            minX: -Infinity,
            maxX: Infinity,
            minY: -Infinity,
            maxY: Infinity
        };
    }

    /**
     * Updates the character's position based on current direction and speed
     * @param {number} deltaTime - Time elapsed since last update (in milliseconds)
     */
    update(deltaTime) {
        // Calculate movement with higher precision
        const movementX = this.direction.x * this.speed * (deltaTime / 1000);
        const movementY = this.direction.y * this.speed * (deltaTime / 1000);
        
        // Calculate new position with sub-pixel precision
        let newX = this.x + movementX;
        let newY = this.y + movementY;
        
        // Apply boundaries
        newX = Math.max(this.boundary.minX, Math.min(this.boundary.maxX, newX));
        newY = Math.max(this.boundary.minY, Math.min(this.boundary.maxY, newY));
        
        // Update position with sub-pixel precision
        this.x = newX;
        this.y = newY;
    }

    /**
     * Sets the movement direction
     * @param {number} x - Horizontal direction (-1 = left, 1 = right, 0 = no movement)
     * @param {number} y - Vertical direction (-1 = up, 1 = down, 0 = no movement)
     */
    setDirection(x, y) {
        // Normalize the direction vector for smooth diagonal movement
        const length = Math.sqrt(x * x + y * y);
        if (length > 0) {
            this.direction.x = x / length;
            this.direction.y = y / length;
        } else {
            this.direction.x = 0;
            this.direction.y = 0;
        }
    }

    /**
     * Checks if this character is colliding with another object
     * @param {Object} other - The other object to check collision with
     * @param {number} radius - The collision radius (default: 32)
     * @returns {boolean} true if objects are colliding
     */
    isCollidingWith(other, radius = 32) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < radius * 2;
    }

    /**
     * Gets the current x-coordinate of the character
     * @returns {number} The x-coordinate
     */
    getX() {
        return this.x;
    }

    /**
     * Gets the current y-coordinate of the character
     * @returns {number} The y-coordinate
     */
    getY() {
        return this.y;
    }

    /**
     * Gets the current position of the character
     * @returns {Object} An object containing the x and y coordinates
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }

    /**
     * Gets the current speed
     * @returns {number} The character's speed
     */
    getSpeed() {
        return this.speed;
    }

    /**
     * Sets a new speed for the character
     * @param {number} newSpeed - The new speed value
     */
    setSpeed(newSpeed) {
        this.speed = Math.max(0, newSpeed);
    }
} 