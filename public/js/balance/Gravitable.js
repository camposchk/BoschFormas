export default class Gravitable {
  constructor(x, y, width, height, drawFunc) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 10 - 5;
    this.vy = 0;
    this.rot = 0;
    this.bounciness = 0.6;
    this.width = width;
    this.height = height;
    this.count = 0;
    this.bottom = () => {
      return this.y + this.height;
    };
    this.right = () => {
      return this.x + this.width;
    };
    this.move = (ax, ay) => {
      this.vx += ax;
      this.vy += ay;
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.vx / 2;
    };
    this.bounceX = (ix) => {
      this.x = ix;
      this.vx *= -this.bounciness;
    };
    this.bounceY = (iy) => {
      this.y = iy;
      this.vy *= -this.bounciness;
      this.vx *= 0.8;
    };
    this.draw = drawFunc;
  }
}