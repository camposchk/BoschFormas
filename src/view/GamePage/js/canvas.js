import {
  Balance,
  Gravitable,
  renderBalance,
  renderBall,
  renderSquare,
  renderTriangle,
  renderStar,
  renderPentagon
} from "./balance.js";

const CANVAS = document.getElementById("canvas");
var balance1 = new Balance(0, 0);
var balance2 = new Balance(0, 0);
var balX1 = width / 2;
var balX2 = 200 * scale;
var balY = height / 3;
var cursor = { x: 0, y: 0 };
var width = window.innerWidth - 50;
var height = window.innerHeight - 100;
var scale = width / 750;
var offX = 0;
var plate1Off = balX1 - balX2
var plate2Off = balX1 + balX2
var figCount = 0
var figSize = 15

function getCursorPosition(event) {
  const rect = CANVAS.getBoundingClientRect();
  cursor.x = event.clientX - rect.left;
  cursor.y = event.clientY - rect.top;
}

function addFigure(fig)
{
  var func = renderBall
  switch (fig) {
    case 'square':
      func = renderSquare
      break;
    case 'triangle':
      func = renderTriangle
      break;
    case 'star':
      func = renderStar
      break;
    case 'pentagon':
      func = renderPentagon
      break;
    default:
      break;
  }

  if (cursor.x < width / 2)
  {
    var pos1 = balance1.currPos / 2;
    var tilt1x = ((Math.abs(pos1) * 50) * scale)
    var tilt1y = pos1 * 75;

    if (cursor.x < width / 6)
      balance1.leftPlate.push(
        new Gravitable(cursor.x - (plate1Off + offX - 50 * scale + tilt1x), cursor.y + (-210 + tilt1y) * scale, figSize, figSize, func)
      );
    else if (cursor.x > width / 3)
      balance1.rightPlate.push(
        new Gravitable(cursor.x - (plate1Off - offX - 50 * scale - tilt1x), cursor.y - (210 + tilt1y) * scale, figSize, figSize, func)
      );
  }
  else{
    var pos2 = balance2.currPos / 2;
    var tilt2x = ((Math.abs(pos2) * 50) * scale)
    var tilt2y = pos2 * 75;

    if (cursor.x < width * 2 / 3)
      balance2.leftPlate.push(
        new Gravitable(cursor.x - (plate2Off + offX - 50 * scale + tilt2x), cursor.y + (-210 + tilt2y) * scale, figSize, figSize, func)
      );
    else if (cursor.x > width * 5 / 6)
      balance2.rightPlate.push(
        new Gravitable(cursor.x - (plate2Off - offX - 50 * scale + tilt2y), cursor.y - (210 + tilt2y) * scale, figSize, figSize, func)
      );
  }
}

function resizeCanvas() {
  if (window.innerHeight > 720)
    height = window.innerHeight * 0.8;
  width = (height * 4) / 3;
  // width = window.innerWidth * 0.75;
  CANVAS.width = width;
  CANVAS.height = height;
  // scale = width / 750;
  scale = width / 740;
  offX = -100 * scale

  balX1 = width / 2;
  balX2 = 200 * scale;
  balY = height / 3;
  plate1Off = balX1 - balX2 
  plate2Off = balX1 + balX2 
}
window.addEventListener("resize", resizeCanvas, false);
CANVAS.addEventListener("mousemove", function (e) {
  getCursorPosition(e);
  figCount++
});

function init() {
  window.requestAnimationFrame(draw);
}

function draw() {
  const ctx = CANVAS.getContext("2d");
  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

  ctx.fillStyle = "darkgoldenrod";
  ctx.strokeStyle = "darkgoldenrod";
  
  
  renderBalance(ctx, plate1Off, balY, scale, balance1);
  renderBalance(ctx, plate2Off, balY, scale, balance2);

  ctx.font = "20px arial";
  // ctx.fillText(cursor.x, 10, 20);
  // ctx.fillText(cursor.y, 10, 40);
  // ctx.fillText(plate1Off + (offX - 50 * scale), 10, 60);
  // ctx.fillText(plate2Off - (offX + 50 * scale), 10, 80);
  // ctx.fillText(figCount, 10, 100);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  window.requestAnimationFrame(draw);
}

resizeCanvas();
init();

window.tiltRight = () => {
  balance1.bal = 1;
};
window.unTilt = () => {
  balance1.bal = 0;
};
window.tiltLeft = () => {
  balance1.bal = -1;
};
window.addFig = (e, fig) => {
  // addFigure(fig)
  getCursorPosition(e)
  addFigure(fig)
}
