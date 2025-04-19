/**
 * Character Class
 * 
 * This class represents a character that can move around in a 2D space
 * and interact with other objects. It includes basic movement controls
 * and collision detection.
 */
export class Character {
    // Current position of the character
    private x: number;
    private y: number;
    
    // Movement properties
    private speed: number;
    private direction: { x: number, y: number };
    
    // Boundary properties
    private boundary: {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    };

    /**
     * Creates a new character at the specified position
     * @param startX - The initial x-coordinate
     * @param startY - The initial y-coordinate
     * @param speed - Movement speed (default: 5)
     * @param boundary - Optional boundary limits
     */
    constructor(
        startX: number = 0,
        startY: number = 0,
        speed: number = 5,
        boundary?: {
            minX: number;
            maxX: number;
            minY: number;
            maxY: number;
        }
    ) {
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
     * @param deltaTime - Time elapsed since last update (in milliseconds)
     */
    update(deltaTime: number): void {
        const movementX = this.direction.x * this.speed * (deltaTime / 1000);
        const movementY = this.direction.y * this.speed * (deltaTime / 1000);
        
        // Calculate new position
        let newX = this.x + movementX;
        let newY = this.y + movementY;
        
        // Apply boundaries
        newX = Math.max(this.boundary.minX, Math.min(this.boundary.maxX, newX));
        newY = Math.max(this.boundary.minY, Math.min(this.boundary.maxY, newY));
        
        this.x = newX;
        this.y = newY;
    }

    /**
     * Sets the movement direction
     * @param x - Horizontal direction (-1 = left, 1 = right, 0 = no movement)
     * @param y - Vertical direction (-1 = up, 1 = down, 0 = no movement)
     */
    setDirection(x: number, y: number): void {
        // Normalize the direction vector
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
     * @param other - The other object to check collision with
     * @param radius - The collision radius (default: 32)
     * @returns true if objects are colliding
     */
    isCollidingWith(other: { x: number, y: number }, radius: number = 32): boolean {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < radius * 2;
    }

    /**
     * Gets the current x-coordinate of the character
     * @returns The x-coordinate
     */
    getX(): number {
        return this.x;
    }

    /**
     * Gets the current y-coordinate of the character
     * @returns The y-coordinate
     */
    getY(): number {
        return this.y;
    }

    /**
     * Gets the current position of the character
     * @returns An object containing the x and y coordinates
     */
    getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    /**
     * Gets the current speed
     * @returns The character's speed
     */
    getSpeed(): number {
        return this.speed;
    }

    /**
     * Sets a new speed for the character
     * @param newSpeed - The new speed value
     */
    setSpeed(newSpeed: number): void {
        this.speed = Math.max(0, newSpeed);
    }
} 