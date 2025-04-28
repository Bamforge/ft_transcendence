interface Position {
	x: number;
	y: number;
  }
  
  type Velocity = { x: number; y: number };
  
  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  const c = canvas.getContext('2d') as CanvasRenderingContext2D;
  
  canvas.width = 1000;
  canvas.height = 500;
  
  class Paddle {
	position: Position;
	velocity: Velocity;
	width: number;
	height: number;
  
	constructor({ position }: { position: Position }) {
		this.position = position;
		this.velocity = { x: 0, y: 0 };
		this.width = 10;
		this.height = 100;
	}
  
	draw() {
		c.fillStyle = 'black';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
  
	update() {
		this.draw();
		if (
			this.position.y + this.velocity.y > 0 &&
			this.position.y + this.height + this.velocity.y < canvas.height
		) {
			this.position.y += this.velocity.y;
		}
	}
  }
  
  class Ball {
	position: Position;
	velocity: Velocity;
	width: number;
	height: number;
  
	constructor({ position }: { position: Position }) {
		this.position = position;
		const speed = 2;
		const direction = {
			x: Math.random() - 0.5 >= 0 ? -speed : speed,
			y: Math.random() - 0.5 >= 0 ? -speed : speed,
		};
		this.velocity = direction;
		this.width = 10;
		this.height = 10;
	}
  
	draw() {
		c.fillStyle = 'black';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
  
	update() {
		this.draw();
		const rightSide = this.position.x + this.width + this.velocity.x;
		const leftSide = this.position.x + this.velocity.x;
		const bottomSide = this.position.y + this.height;
		const topSide = this.position.y;
  
		// Paddle 1 collision
		if (
			leftSide <= paddle1.position.x + paddle1.width &&
			bottomSide >= paddle1.position.y &&
			topSide <= paddle1.position.y + paddle1.height
		) {
			this.velocity.x = -this.velocity.x;
		}
  
		// Paddle 2 collision
		if (
			rightSide >= paddle2.position.x &&
			bottomSide >= paddle2.position.y &&
			topSide <= paddle2.position.y + paddle2.height
		) {
			this.velocity.x = -this.velocity.x;
		}
  
		// Reverse y direction at top and bottom boundaries
		if (
			this.position.y + this.height + this.velocity.y >= canvas.height ||
			this.position.y + this.velocity.y <= 0
		) {
			this.velocity.y = -this.velocity.y;
		}
  
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
  }
  
  const paddle1 = new Paddle({
	position: {
		x: 10,
		y: 100,
	},
  });
  
  const paddle2 = new Paddle({
	position: {
		x: canvas.width - 20, // 10 * 2, where 10 is paddle width
		y: 100,
	},
  });
  
  const ball = new Ball({
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2,
	},
  });
  
  function animate(): void {
	requestAnimationFrame(animate);
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);
	paddle1.update();
	paddle2.update();
	ball.update();
  }
  
  animate();
  
  addEventListener('keydown', (event: KeyboardEvent) => {
	const speed = 6;
	switch (event.key) {
		case 'w':
			paddle1.velocity.y = -speed;
			break;
		case 's':
			paddle1.velocity.y = speed;
			break;
		case 'ArrowUp':
			paddle2.velocity.y = -speed;
			break;
		case 'ArrowDown':
			paddle2.velocity.y = speed;
			break;
	}
  });
  