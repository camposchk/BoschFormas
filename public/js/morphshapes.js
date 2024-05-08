var tweenTriangulo1 = KUTE.to(
  "#triangle",
  { path: "#five" },
  { duration: 500 }
);
var tweenTriangulo2 = KUTE.to(
  "#triangle",
  { path: "#triangle" },
  { duration: 500 }
);

tweenTriangulo1.start();

setTimeout(function () {
  tweenTriangulo2.start();
}, 1200);

var tweenQuadrado1 = KUTE.to(
  "#square",
  { path: "#five" },
  { duration: 500 }
);
var tweenQuadrado2 = KUTE.to(
  "#square",
  { path: "#square" },
  { duration: 500 }
);

tweenQuadrado1.start();

setTimeout(function () {
  tweenQuadrado2.start();
}, 1200);

var tweenEllipse1 = KUTE.to(
  "#ellipse",
  { path: "#five" },
  { duration: 500 },
  { morphPrecision: 1 }
);
var tweenEllipse2 = KUTE.to(
  "#ellipse",
  { path: "#ellipse" },
  { duration: 500 }
);

tweenEllipse1.start();

setTimeout(function () {
  tweenEllipse2.start();
}, 1200);

var tweenStar1 = KUTE.to("#star", { path: "#five" }, { duration: 500 });
var tweenStar2 = KUTE.to("#star", { path: "#star" }, { duration: 500 });

if(tweenStar1.element)
{
  tweenStar1.start();
  
  setTimeout(function () {
    tweenStar2.start();
  }, 1200);
}

var tweenPentagono1 = KUTE.to(
  "#pentagon",
  { path: "#five" },
  { duration: 500 }
);
var tweenPentagono2 = KUTE.to(
  "#pentagon",
  { path: "#pentagon" },
  { duration: 500 }
);

if(tweenPentagono1.element)
{
  tweenPentagono1.start();
  
  setTimeout(function () {
    tweenPentagono2.start();
  }, 1200);
}

function animate(arrastos, forma) {
  var mapeamento = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
  };

  var pathString = mapeamento[arrastos];

  if (pathString) {
    var tweenForma1 = KUTE.to(
      "#" + forma,
      { path: "#" + pathString },
      { duration: 500 }
    );
    var tweenForma2 = KUTE.to(
      "#" + forma,
      { path: "#" + forma },
      { duration: 500 }
    );

    tweenForma1.start();

    setTimeout(function () {
      tweenForma2.start();
    }, 1200);
  } else {
    console.log("Valor de arrastos inválido");
  }
}