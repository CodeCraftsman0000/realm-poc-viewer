/**
 * Game Class
 * 
 * Handles the visualization and game loop for our character
 */
export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private character: Character;
    private objects: {x: number, y: number}[];

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.character = new Character(400, 300, 5, {
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
    }

    private setupControls(): void {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowUp':
                    this.character.setDirection(0, -1);
                    break;
                case 'ArrowDown':
                    this.character.setDirection(0, 1);
                    break;
                case 'ArrowLeft':
                    this.character.setDirection(-1, 0);
                    break;
                case 'ArrowRight':
                    this.character.setDirection(1, 0);
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                this.character.setDirection(0, 0);
            }
        });
    }

    private draw(): void {
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
    }

    public update(deltaTime: number): void {
        this.character.update(deltaTime);
        
        // Check for collisions
        for (const obj of this.objects) {
            if (this.character.isCollidingWith(obj)) {
                console.log("Collision detected!");
            }
        }
    }

    public gameLoop(): void {
        this.update(16); // 16ms = ~60fps
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    public start(): void {
        this.gameLoop();
    }
} 