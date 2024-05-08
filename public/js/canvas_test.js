import Balance from "./balance/Balance.js"
import Gravitable from "./balance/Gravitable.js"
import renderBalance from "./balance/renderBalance.js"
import renderBall from "./balance/renderBall.js"
import renderSquare from "./balance/renderSquare.js"
import renderTriangle from "./balance/renderTriangle.js"
import renderStar from "./balance/renderStar.js"
import renderPentagon from "./balance/renderPentagon.js"

const CANVAS = document.getElementById("canvas");
var balance1 = new Balance(0, 0);
var balX1 = width / 2;
var balX2 = 200 * scale;
var balY = height / 3;
var cursor = { x: 0, y: 0 };
let lastFig;
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
    default:
      break;
  }

  var pos1 = balance1.currPos / 2;
  var tilt1x = Math.abs(pos1) * 50 * scale;
  var tilt1y = pos1 * 75;
  currBal = 1;
  if (cursor.x < width / 2) {
    if (!balance1.leftPlate[fig]) {
      balance1.leftPlate[fig] = new Gravitable(
        cursor.x - (plate1Off + offX - 50 * scale + tilt1x),
        cursor.y + (-105 * scale + tilt1y) * scale,
        figSize,
        figSize,
        func
      );
    }

    balance1.leftPlate[fig].count++;
    return 1;
  } else {
    if (!balance1.rightPlate[fig]) {
      balance1.rightPlate[fig] = new Gravitable(
        cursor.x - (plate1Off + offX - 150 * scale - tilt1x),
        cursor.y - (105 * scale + tilt1y) * scale,
        figSize,
        figSize,
        func
      );

      lastFig = balance1.rightPlate[fig]
    }
    balance1.rightPlate[fig].count++;
    return 1;
  }
}


function resizeCanvas() {
  // if (window.innerHeight > 720) height = window.innerHeight * 0.5;
  // width = (height * 6) / 3;
  if (window.innerWidth > 720) width = window.innerWidth * 0.5;
  height = (width * 3) / 6;

  // width = window.innerWidth * 0.75;
  CANVAS.width = width;
  CANVAS.height = height;
  // scale = width / 750;
  scale = width / 740;
  offX = -100 * scale;

  balX1 = width / 2;
  balX2 = 0;
  balY = height / 3;
  plate1Off = balX1 + balX2;
  plate2Off = balX1 - balX2;
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

  renderBalance(ctx, ((width / 2) + 6.625), balY, scale, balance1);
  ctx.font = "20px arial";

  // ctx.save();
  // ctx.fillStyle = "lime"
  // var pos1 = balance1.currPos / 2;
  // var tilt1x = Math.abs(pos1) * 50 * scale;
  // let temp = (plate1Off + offX + 150 * scale - tilt1x)
  
  // ctx.beginPath();
  // ctx.arc(temp, 0, 20, 0, 2 * Math.PI);
  // ctx.fill();

  // ctx.fillText(cursor.x, 10, 40);
  // ctx.fillText(temp, 10, 60);
  // ctx.fillText(cursor.x - temp, 10, 80);
  // ctx.restore();

  // ctx.fillText(plate2Off - (offX + 50 * scale), 10, 80);
  // ctx.fillText(figCount, 10, 100);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  window.requestAnimationFrame(draw);
}

function arrangeFigs(gravitables) {
  let step = (100 * scale) / 6;
  let count = step;
  for (const [key, gravitable] of Object.entries(gravitables)) {
    gravitable.x = count;
    gravitable.rot = 0;
    console.log(count);
    count += step;
  }
}

window.arrangeBalances = () => {
  arrangeFigs(balance1.leftPlate);
  arrangeFigs(balance1.rightPlate);
};

resizeCanvas();

init();

window.tilt = (value) => {
  let balance = balance1;
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
  return addFigure(fig);
};

const figures = ["square", "ellipse", "triangle", "pentagon", "star"];
window.getPlatesBal = () => {
  let counts = [];
  let balance = balance1;
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
  balance.leftPlate = {};
  balance.rightPlate = {};
}

window.emptyBalances = () => {
  emptyBalance(balance1);
  balance1.bal = 0;
};
