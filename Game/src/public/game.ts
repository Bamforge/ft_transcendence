// Locate the canvas element and its context
const gameCanvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = gameCanvas.getContext('2d');

if (!ctx) {
  throw new Error('Failed to get 2D context');
}

// Draw a simple rectangle
ctx.fillStyle = '#FF5722';
ctx.fillRect(50, 50, 200, 100);

// Draw some text
ctx.font = '24px sans-serif';
ctx.fillStyle = '#000';
ctx.fillText('Hello, Fastify!', 60, 120);
