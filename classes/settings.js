let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}
let gameMode
//0 moves
//1 time
//2 zen
//3 level
//4 custom
let gameModeNames = ['MOVES', 'TIME', 'ZEN', 'LEVEL', 'CUSTOM']
let levelConfig
loadFont("PixelFont", "assets/fonts/mago1.ttf");
loadFont("PixelFontWide", "assets/fonts/mago3.ttf");
function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
    document.fonts.add(loaded);
  }).catch(function (error) {
    return error;
  });
}
loadFont("PixelFontWide", "assets/fonts/mago3.ttf");



let colors = [0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86]
let dotAllColors = [0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86];
let dotColors = []
let colorGroups = [[0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86],
[0x641e16, 0x1a5276, 0x6C3483, 0x0e6655, 0x9c640c, 0xAEB6BF],
[0xe7d4be, 0x2b312e, 0x536b7b, 0x8d756b, 0xc3544b, 0xf4b675],
[0xfff2cc, 0xf4b675, 0x99a4ad, 0x7c7474, 0x916455, 0x758E4F],
[0x4da167, 0x61707d, 0x9d69a3, 0xf5fbef, 0xe85d75, 0xB87D4B],
[0x758E4F, 0x86BBD8, 0xF6AE2D, 0x33658A, 0xF26419, 0xA1869E],
[0xcb9831, 0x555220, 0x8f4a29, 0xcc4444, 0xe8c472, 0xf5fbef],]
let gameSettings;
var defaultValues = {
  mostDots: [0, 0, 0, 0, 0],
  completed: 0,
  unlocked: 1,
  totalSquares: 0,
  totalDots: 0,
  group: 0,
  currentLevel: 0,
  colorSet: 0
}

function sample(array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
}
function randomExcludedNumber(numLength, excludeNumber) {
  var randNumber = excludeNumber;
  while (randNumber == excludeNumber) {
    randNumber = Math.floor(Math.random() * numLength)
  }
  return randNumber;
}
function getLastElement(array) {
  return getLaterElements(array, 1);
}

function getSecondToLastElement(array) {
  return getLaterElements(array, 2);
}

function getLaterElements(array, index) {
  return array[array.length - index];
}

function deleteAt(array, index) {
  array.splice(index, 1);
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
let lbData
lbFlag = false
let defaultGame = {
  w: 6,
  h: 6,
  mL: 30,
  c: 5,
  aD: false,
  dS: 5,
  aB: false,
  bS: 5,
  aI: false,
  iS: 5,
  aBl: false,
  blS: 4,
  aR: false,
  rS: 1,
  aW: false,
  wS: 3,
  aSl: false,
  aG: false,
  gS: 3,
  aF: false,
  fS: 3,
  aBallF: false,
  ballS: 3,
  square: true,
  blocks: []
}

let levels = [
  {
    id: 0, w: 8, h: 12, mL: 25, c: 5, aD: false, dS: 5, aB: false, bS: 5, aI: false, iS: 7, aBl: true, blS: 2, aR: false, rS: 1, aW: false, wS: 3, aSl: false, aG: false, gS: 3, aF: false, fS: 3, aBall: false, ballS: 3, square: true, win: { color0: 10, color1: 10, }, blocks: [{ "x": 1, "y": 2 }, { "x": 1, "y": 3 }]
  },
  {
    id: 1, w: 6, h: 8, mL: 25, c: 5, aD: false, dS: 5, aB: false, bS: 5, aI: false, iS: 7, aBl: false, blS: 5, aR: false, rS: 0, aW: false, wS: 3, aSl: false, aG: false, gS: 2, aF: false, fS: 3, aBall: true, ballS: 3, square: true, win: { color0: 10, color1: 10, balls: 2 }, blocks: []
  },
  {
    id: 2, w: 6, h: 10, mL: 25, c: 5, aD: false, dS: 5, aB: false, bS: 5, aI: false, iS: 7, aBl: false, blS: 5, aR: false, rS: 0, aW: false, wS: 3, aSl: false, aG: false, gS: 3, aF: true, fS: 7, aBall: false, ballS: 3, square: true, win: { color2: 10, color3: 10 }, blocks: []
  },
  {
    id: 3, w: 4, h: 8, mL: 25, c: 5, aD: false, dS: 5, aB: false, bS: 5, aI: false, iS: 7, aBl: false, blS: 5, aR: false, rS: 0, aW: false, wS: 3, aSl: false, aG: false, gS: 3, aF: false, fS: 3, aBall: false, ballS: 3, square: true, win: { color4: 10, color2: 10 }, blocks: []
  },
  {
    id: 4, w: 6, h: 8, mL: 25, c: 5, aD: true, dS: 5, aB: false, bS: 5, aI: false, iS: 7, aBl: false, blS: 5, aR: false, rS: 0, aW: false, wS: 3, aSl: false, aG: false, gS: 3, aF: false, fS: 3, aBall: false, ballS: 3, square: true, win: { color4: 10, color2: 10, drop: 4 }, blocks: []
  },
  {
    id: 5, w: 6, h: 8, mL: 25, c: 5, aD: true, dS: 5, aB: false, bS: 5, aI: false, iS: 7, aBl: false, blS: 5, aR: false, rS: 0, aW: false, wS: 3, aSl: false, aG: false, gS: 3, aF: false, fS: 3, aBall: false, ballS: 3, square: true, win: { color4: 10, color2: 10, drop: 4 }, blocks: []
  }
]