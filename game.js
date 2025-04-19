/**
 * Character Class
 * 
 * This class represents a character that can move around in a 2D space
 * and interact with other objects. It includes basic movement controls
 * and collision detection.
 */
class Character {
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
    update() {
        // Direct position update with smoother movement
        if (this.direction.x < 0) this.x = Math.max(this.boundary.minX, this.x - 10);
        if (this.direction.x > 0) this.x = Math.min(this.boundary.maxX, this.x + 10);
        if (this.direction.y < 0) this.y = Math.max(this.boundary.minY, this.y - 10);
        if (this.direction.y > 0) this.y = Math.min(this.boundary.maxY, this.y + 10);
    }

    /**
     * Sets the movement direction
     * @param {number} x - Horizontal direction (-1 = left, 1 = right, 0 = no movement)
     * @param {number} y - Vertical direction (-1 = up, 1 = down, 0 = no movement)
     */
    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
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

/**
 * Game Class
 * 
 * Handles the visualization and game loop for our character
 */
class Game {
    /**
     * Creates a new game instance
     * @param {string} canvasId - The ID of the canvas element
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size to match window
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create character with extreme speed
        this.character = new Character(400, 300, 5000, {  // Changed speed to 5000 for extreme movement
            minX: 0,
            maxX: this.canvas.width,
            minY: 0,
            maxY: this.canvas.height
        });
        
        this.objects = [
            {x: 100, y: 100},
            {x: 200, y: 200},
            {x: 300, y: 300}
        ];

        // Set up keyboard controls
        this.setupControls();
        
        // Performance tracking
        this.lastTime = performance.now();
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = performance.now();
    }

    /**
     * Resizes the canvas to match the window size
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.8;
        
        // Update character boundaries
        if (this.character) {
            this.character.boundary = {
                minX: 0,
                maxX: this.canvas.width,
                minY: 0,
                maxY: this.canvas.height
            };
        }
    }

    /**
     * Sets up keyboard event listeners for character control
     */
    setupControls() {
        // Track pressed keys
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };

        document.addEventListener('keydown', (event) => {
            if (this.keys.hasOwnProperty(event.key)) {
                this.keys[event.key] = true;
                this.updateCharacterDirection();
            }
        });

        document.addEventListener('keyup', (event) => {
            if (this.keys.hasOwnProperty(event.key)) {
                this.keys[event.key] = false;
                this.updateCharacterDirection();
            }
        });
    }

    /**
     * Updates the character's direction based on pressed keys
     */
    updateCharacterDirection() {
        let x = 0;
        let y = 0;

        if (this.keys.ArrowLeft) x = -1;
        if (this.keys.ArrowRight) x = 1;
        if (this.keys.ArrowUp) y = -1;
        if (this.keys.ArrowDown) y = 1;

        this.character.setDirection(x, y);
    }

    /**
     * Draws the game state to the canvas
     */
    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the character
        this.ctx.fillStyle = 'blue';
        this.ctx.beginPath();
        this.ctx.arc(this.character.getX(), this.character.getY(), 20, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw objects
        this.ctx.fillStyle = 'red';
        for (const obj of this.objects) {
            this.ctx.beginPath();
            this.ctx.arc(obj.x, obj.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Draw FPS counter
        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`FPS: ${Math.round(this.fps)}`, 10, 20);
    }

    /**
     * Updates the game state
     * @param {number} deltaTime - Time elapsed since last update
     */
    update() {
        this.character.update();
        
        // Check for collisions
        for (const obj of this.objects) {
            if (this.character.isCollidingWith(obj)) {
                console.log("Collision detected!");
            }
        }

        // Update FPS counter
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
    }

    /**
     * Main game loop
     */
    gameLoop() {
        const now = performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Starts the game
     */
    start() {
        this.gameLoop();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new Game('renderCanvas');
    game.start();
}); 