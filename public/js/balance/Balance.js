export default class Balance {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.leftPlate = {};
    this.rightPlate = {};
    this.currPos = 0;
    this.bal = 0;
    this.tilt = (step) => {
      if (this.currPos < this.bal) {
        this.currPos += step;
        if (this.currPos > 0.99) this.currPos = 1;
      }
      if (this.currPos > this.bal) {
        this.currPos -= step;
        if (this.currPos < -0.99) this.currPos = -1;
      }
      if (Math.abs(this.currPos) < 0.01) this.currPos = 0;
    };
  }
}