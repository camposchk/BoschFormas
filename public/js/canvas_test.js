import {
  Balance,
  Gravitable,
  renderBalance,
  renderBall,
  renderSquare,
  renderTriangle,
  renderStar,
  renderPentagon,
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
var plate1Off = balX1 - balX2;
var plate2Off = balX1 + balX2;
var figCount = 0;
var figSize = 15;
var currBal = 0;

function getCursorPosition(event) {
  const rect = CANVAS.getBoundingClientRect();
  cursor.x = event.clientX - rect.left;
  cursor.y = event.clientY - rect.top;
}

function addFigure(fig) {
  var func = renderBall;
  switch (fig) {
    case "square":
      func = renderSquare;
      break;
    case "triangle":
      func = renderTriangle;
      break;
    case "star":
      func = renderStar;
      break;
    case "pentagon":
      func = renderPentagon;
      break;
    default:
      break;
  }
  
  if (cursor.x < width / 2) {
    var pos1 = balance1.currPos / 2;
    var tilt1x = Math.abs(pos1) * 50 * scale;
    var tilt1y = pos1 * 75;
    currBal = 1

    if (cursor.x < width / 6) {
      if (!balance1.leftPlate[fig]) {
        balance1.leftPlate[fig] = new Gravitable(
          cursor.x - (plate1Off + offX - 50 * scale + tilt1x),
          cursor.y + (-210 + tilt1y) * scale,
          figSize,
          figSize,
          func
        );
      }
      balance1.leftPlate[fig].count++;
      return 1
    } else if (cursor.x > width / 3) {
      if (!balance1.rightPlate[fig]) {
        balance1.rightPlate[fig] = new Gravitable(
          cursor.x - (plate1Off - offX - 50 * scale - tilt1x),
          cursor.y - (210 + tilt1y) * scale,
          figSize,
          figSize,
          func
        );
      }
      balance1.rightPlate[fig].count++;
      return 1
    }
  } else {
    var pos2 = balance2.currPos / 2;
    var tilt2x = Math.abs(pos2) * 50 * scale;
    var tilt2y = pos2 * 75;
    currBal = 2

    if (cursor.x < (width * 2) / 3) {
      if (!balance2.leftPlate[fig]) {
        balance2.leftPlate[fig] = new Gravitable(
          cursor.x - (plate2Off + offX - 50 * scale + tilt2x),
          cursor.y + (-210 + tilt2y) * scale,
          figSize,
          figSize,
          func
        );
      }
      balance2.leftPlate[fig].count++;
      return 2
    } else if (cursor.x > (width * 5) / 6) {
      if (!balance2.rightPlate[fig]) {
        balance2.rightPlate[fig] = new Gravitable(
          cursor.x - (plate2Off - offX - 50 * scale + tilt2y),
          cursor.y - (210 + tilt2y) * scale,
          figSize,
          figSize,
          func
        );
      }
      balance2.rightPlate[fig].count++;
      return 2
    }
  }
}

function resizeCanvas() {
  if (window.innerHeight > 720) height = window.innerHeight * 0.8;
  width = (height * 4) / 3;
  // width = window.innerWidth * 0.75;
  CANVAS.width = width;
  CANVAS.height = height;
  // scale = width / 750;
  scale = width / 740;
  offX = -100 * scale;

  balX1 = width / 2;
  balX2 = 200 * scale;
  balY = height / 3;
  plate1Off = balX1 - balX2;
  plate2Off = balX1 + balX2;
}
window.addEventListener("resize", resizeCanvas, false);
CANVAS.addEventListener("mousemove", function (e) {
  getCursorPosition(e);
  figCount++;
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

function arrangeFigs(gravitables) {
    let step = 100 * scale / 6
    let count = step
    for (const [key, gravitable] of Object.entries(gravitables)) {
        gravitable.x = count
        gravitable.rot = 0
        console.log(count)  
        count += step
    }
}

window.arrangeBalances = () => {
    arrangeFigs(balance1.leftPlate)
    arrangeFigs(balance1.rightPlate)
    arrangeFigs(balance2.leftPlate)
    arrangeFigs(balance2.rightPlate)
}

resizeCanvas();

init();

window.tilt = (value) => {
  let balance = currBal == 1 ? balance1 : balance2
  switch (value) {
    case -1:
      balance.bal = -1;
      break;
    case 0:
      balance.bal = 0;
      break;
    case 1:
      balance.bal = 1;
      break;
    default:
      break;
  }
};
window.addFig = (e, fig) => {
  // addFigure(fig)
  getCursorPosition(e);
  addFigure(fig);
};

const figures = ["square", "ellipse", "triangle", "pentagon", "star"];
window.getPlatesBal = () => {
  let counts = [];
  let balance = currBal == 1 ? balance1 : balance2
  for (let i = 0; i < figures.length; i++) {
    if (balance.leftPlate[figures[i]])
      counts.push(balance.leftPlate[figures[i]].count);
    else counts.push(0);
  }
  for (let i = 0; i < figures.length; i++) {
    if (balance.rightPlate[figures[i]])
      counts.push(balance.rightPlate[figures[i]].count);
    else counts.push(0);
  }
  return counts;
};

function emptyBalance(balance) {
    balance.leftPlate = {}
    balance.rightPlate = {}
}

window.emptyBalances = () => {
    emptyBalance(balance1)
    emptyBalance(balance2)
}
