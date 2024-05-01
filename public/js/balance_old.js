export class Balance {
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

export class Gravitable {
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

export function renderBalString(ctx, left, up, down, right) {
  ctx.beginPath();
  ctx.moveTo(left, down);
  ctx.lineTo(up, left);
  ctx.lineTo(right, down);
  ctx.stroke();
}

export function renderPlate(ctx, plateX, plateY, size, items, string) {
  ctx.save();
  ctx.translate(plateX, plateY);

  // RENDER ITEMS
  gravity(ctx, -size * 0.5, -size * 0.23, size, size, items);

  // STRING LEFT
  renderBalString(ctx, string[0], string[1], string[2], string[3]);

  // PLATE
  ctx.rotate(-0.875);
  ctx.beginPath();
  ctx.arc(0, 0, size, 1.75, Math.PI);
  ctx.fill();
  ctx.restore();
}

export function renderBubble(ctx, x, y, count) {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.font = "11px arial";
  ctx.fillText(count, x - 3, y - 26);
  ctx.fillStyle = "rgb(255, 255, 255, 0.85)";

  ctx.beginPath();
  ctx.ellipse(x, y - 30, 10, 7, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

export function renderSquare(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;

  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  // ctx.strokeRect(-h, -w, h * 2, w * 2)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#E00420";
  ctx.fillRect(-w, -h, w * 2, h * 2);
  ctx.restore();
}

export function renderTriangle(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;

  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  // ctx.strokeRect(-h, -w, h * 2, w * 2)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#B14EFF";
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(w, h);
  ctx.lineTo(-w, h);
  ctx.fill();
  ctx.restore();
}

export function renderStar(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;

  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  // ctx.strokeRect(-h, -w, h * 2, w * 2)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#EC9513";
  ctx.beginPath();
  var step = Math.PI * 2 * 0.2;
  for (let i = 0.5; i < 5; i++) {
    if (i == 0) ctx.moveTo(Math.sin(i * step) * h, Math.cos(i * step) * h);
    else ctx.lineTo(Math.sin(i * step) * h, Math.cos(i * step) * h);
    ctx.lineTo(
      Math.sin(step * (i + 0.5)) * h * 0.55,
      Math.cos((i + 0.5) * step) * h * 0.55
    );
  }
  // ctx.lineTo(-w, h)
  ctx.fill();
  ctx.restore();
}
export function renderPentagon(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;

  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  // ctx.strokeRect(-h, -w, h * 2, w * 2)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#1F93FF";
  ctx.beginPath();
  var step = Math.PI * 2 * 0.2;
  for (let i = 0.5; i < 5; i++) {
    if (i == 0) ctx.moveTo(Math.sin(i * step) * h, Math.cos(i * step) * h);
    else ctx.lineTo(Math.sin(i * step) * h, Math.cos(i * step) * h);
  }
  // ctx.lineTo(-w, h)
  ctx.fill();
  ctx.restore();
}

export function renderBall(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;
  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  //   ctx.strokeRect(-h, -w, 2 * h, 2 * w)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#00C92C";
  ctx.beginPath();
  ctx.arc(0, 0, h, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

export function gravity(ctx, x, y, width, height, gravitables) {
  ctx.save();
  ctx.translate(x, y);

  for (const [key, gravitable] of Object.entries(gravitables)) {
    gravitable.draw(gravitable.count, ctx, gravitable);

    gravitable.move(0, 0.1);
    if (gravitable.bottom() > height)
      gravitable.bounceY(height - gravitable.height);
    if (gravitable.right() > width)
      gravitable.bounceX(width - gravitable.width);
    if (gravitable.x < gravitable.width) gravitable.bounceX(gravitable.width);
  }
  ctx.restore();
}

export function renderBalance(ctx, x, y, scale, balance) {
  balance.tilt(0.05);
  var pos = balance.currPos / 2;

  var xOffSet = Math.abs(pos) * 50 - 100;
  var yOffSet = pos * 75;

  var scaledX = balance.x * scale;
  var scaledY = balance.y * scale;

  var bs = [-50 * scale, 0 * scale, 80 * scale, 50 * scale];
  var plateSize = 100 * scale;

  ctx.save();
  ctx.translate(x, y);

  // AXIS
  ctx.save();
  ctx.translate(scaledX, scaledY);
  ctx.rotate(pos);
  ctx.beginPath();
  ctx.roundRect(-100 * scale, -5 * scale, 200 * scale, 10 * scale, 5 * scale);
  ctx.fill();
  ctx.restore();

  // LEFT PLATE
  renderPlate(
    ctx,
    xOffSet * scale,
    (50 - yOffSet) * scale,
    plateSize,
    balance.leftPlate,
    bs
  );

  // RIGHT PLATE
  renderPlate(
    ctx,
    (balance.x - xOffSet) * scale,
    (balance.y + 50 + yOffSet) * scale,
    plateSize,
    balance.rightPlate,
    bs
  );

  // AXIS BALL
  ctx.beginPath();
  ctx.arc(scaledX, scaledY, 10 * scale, 0, 2 * Math.PI);
  ctx.fill();

  // ctx.fillRect();
  ctx.beginPath();
  ctx.roundRect(
    (balance.x - 5) * scale,
    scaledY,
    10 * scale,
    200 * scale,
    5 * scale
  );
  ctx.fill();

  ctx.restore();
}
