"use strict";
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('myCanvas');
/** @type {CanvasRenderingContext2D} */
const c = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;
/**
 * Classe représentant une raquette (paddle) du jeu Pong.
 */
class Paddle {
    position;
    velocity;
    width;
    height;
    /**
     * Crée une nouvelle raquette.
     * @constructor
     * @param {{ position: Position }} param0 - Position initiale de la raquette
     */
    constructor({ position }) {
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.width = 10;
        this.height = 100;
    }
    /**
     * Dessine la raquette sur le canvas.
     * @returns {void}
     */
    draw() {
        c.fillStyle = 'black';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    /**
     * Met à jour la position de la raquette et la dessine.
     * @returns {void}
     */
    update() {
        this.draw();
        if (this.position.y + this.velocity.y > 0 &&
            this.position.y + this.height + this.velocity.y < canvas.height) {
            this.position.y += this.velocity.y;
        }
    }
}
/**
 * Classe représentant la balle du jeu Pong.
 */
class Ball {
    position;
    velocity;
    width;
    height;
    /**
     * Crée une nouvelle balle.
     * @constructor
     * @param {{ position: Position }} param0 - Position initiale de la balle
     */
    constructor({ position }) {
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
    /**
     * Dessine la balle sur le canvas.
     * @returns {void}
     */
    draw() {
        c.fillStyle = 'black';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    /**
     * Met à jour la position de la balle, gère les collisions et la dessine.
     * @returns {void}
     */
    update() {
        this.draw();
        const rightSide = this.position.x + this.width + this.velocity.x;
        const leftSide = this.position.x + this.velocity.x;
        const bottomSide = this.position.y + this.height;
        const topSide = this.position.y;
        // Collision avec la raquette 1
        if (leftSide <= paddle1.position.x + paddle1.width &&
            bottomSide >= paddle1.position.y &&
            topSide <= paddle1.position.y + paddle1.height) {
            this.velocity.x = -this.velocity.x;
        }
        // Collision avec la raquette 2
        if (rightSide >= paddle2.position.x &&
            bottomSide >= paddle2.position.y &&
            topSide <= paddle2.position.y + paddle2.height) {
            this.velocity.x = -this.velocity.x;
        }
        // Inverse la direction verticale aux bords supérieur et inférieur
        if (this.position.y + this.height + this.velocity.y >= canvas.height ||
            this.position.y + this.velocity.y <= 0) {
            this.velocity.y = -this.velocity.y;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
/** @type {Paddle} */
const paddle1 = new Paddle({
    position: {
        x: 10,
        y: 100,
    },
});
/** @type {Paddle} */
const paddle2 = new Paddle({
    position: {
        x: canvas.width - 20, // 10 * 2, où 10 est la largeur de la raquette
        y: 100,
    },
});
/** @type {Ball} */
const ball = new Ball({
    position: {
        x: canvas.width / 2,
        y: canvas.height / 2,
    },
});
/**
 * Boucle principale d'animation du jeu.
 * @returns {void}
 */
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    paddle1.update();
    paddle2.update();
    ball.update();
}
animate();
/**
 * Gère les événements clavier pour déplacer les raquettes.
 * @param {KeyboardEvent} event - L'événement clavier
 * @returns {void}
 */
addEventListener('keydown', (event) => {
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
