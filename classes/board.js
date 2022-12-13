class Board {
  constructor(scene, width, height, numColors) {
    this.width = width;
    this.height = height
    this.scene = scene
    this.dots = [];
    this.overlay = []
    this.idCount = 0
    this.selectedColor = null
    this.selectedDots = []
    this.squareCompleted = false
    this.numColors = numColors
    this.redrawTheseColumns = {};
    this.tally = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    //this.specialTally = [0, 0, 0, 0]
    this.moves = 0
    //this.squareTally = 0
    this.newDots = []
    this.extraDots = []
  }

  makeBoard() {

    for (var xAxis = 0; xAxis < this.width; xAxis++) {
      this.makeColumn(xAxis);
    }
    // return html + htmlEnd;


  };

  makeColumn(xAxis) {

    var column = [];
    var columnOverlay = []
    for (var yAxis = 0; yAxis < this.height; yAxis++) {
      var dot = this.addDot(xAxis, yAxis);
      column.push(dot);
      columnOverlay.push({ coordinates: [xAxis, yAxis], image: null, type: 0, strength: 3, color: 8 })
    }
    this.dots.push(column);
    this.overlay.push(columnOverlay)

  };
  addDot(x, y) {
    var num = Phaser.Math.Between(0, dotColors.length - 1);
    var id = this.idCount;
    var dot = new Dot(id, x, y, num, this, this.scene.dotSize)

    var dotImg = this.scene.dots.get();
    // console.log(dotImg)
    dotImg.setTexture('dot2', 0)
    dotImg.setTint(dotColors[dot.color])
    dotImg.displayWidth = this.scene.spriteSize
    dotImg.displayHeight = this.scene.spriteSize
    dotImg.setPosition(game.config.width / 2, -game.config.height / 2);
    dot.image = dotImg
    // dot.events.onInputDown.add(this.clickDot, this);
    // dot.events.onInputUp.add(this.upDot, this);
    // dot.events.onInputOver.add(this.overDot, this);

    this.idCount++;
    return dot;
  }
  createNewDot(x) {
    var dot = this.addDot(x, 0);
    let posX = this.scene.xOffset + this.scene.dotSize * x + this.scene.dotSize / 2;
    let posY = this.scene.yOffset + this.scene.dotSize * 0 + this.scene.dotSize / 2

    //  let posX = this.scene.xOffset + this.scene.dotSize * x + this.scene.dotSize / 2;
    //  let posY = -150
    //dot.image.setTint(dotColors[dot.color])
    dot.image.setVisible(true)
    dot.image.setActive(true)
    dot.image.setAlpha(1)
    //   dot.image.displayWidth = this.scene.spriteSize
    //  dot.image.displayHeight = this.scene.spriteSize
    dot.image.setPosition(posX, posY)
    this.dots[x].unshift(dot);
    //this.newDots.push({x: x, y:0})
  }
  resetBoard() {
    this.selectedDots.forEach(function (dot) {
      dot.deactivate();
    });
    this.selectedDots = [];
    this.selectedColor = "none";
    this.redrawTheseColumns = {};
  }
  ///////OVERLAY
  checkIce(coordinates) {
    if (this.overlay[coordinates[0]][coordinates[1]].type == 3) {
      console.log('ice ice baby')
      if (this.overlay[coordinates[0]][coordinates[1]].strength > 0) {
        this.overlay[coordinates[0]][coordinates[1]].strength--


      } else {
        this.overlay[coordinates[0]][coordinates[1]].type = 0
        this.tally[8]++
        this.scene.addScore()
      }
      this.overlay[coordinates[0]][coordinates[1]].image.setFrame(this.overlay[coordinates[0]][coordinates[1]].strength)
    }

  }

  ///////REMOVING
  destroyDots() {
    if (this.squareCompleted) {
      this.deleteAllDotsofColor();
    } else {
      this.deleteSelectedDots();
    }
    this.resetAfterDestroying();
  }
  deleteSelectedDots() {
    this.selectedDots.forEach(function (dot) {

      dot.explode();
    });
    this.selectedDots.forEach(function (dot) {
      dot.destroy();
    });
  }
  deleteAllDotsofColor() {
    var color = this.selectedColor;
    var dotsOfColor = this.findAllByColor(color);
    dotsOfColor.forEach(function (dot) {
      dot.explode();
    });
    dotsOfColor.forEach(function (dot) {
      dot.destroy();
    });
  }
  resetAfterDestroying() {
    this.selectedDots = [];
    this.selectedColor = "none";
    this.squareCompleted = false;
    this.redrawColumns();
    //  this.updateScore();
    // this.addListeners();
    //  $(".bounce").removeClass("bounce");
    this.redrawTheseColumns = {};
  }
  redrawColumns = function () {
    var board = this;
    for (var x in board.redrawTheseColumns) {
      var column = board.dots[x];
      // var newHTML = "";
      column.forEach(function (dot) {
        //  newHTML += dot.html();
      });
      //$("#column-" + x).html(newHTML);
    }
    //this.bounceDots();
  }
  ////////////
  findRovers() {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.type == 6) container.push(dot);
      });
    });
    return container;

  }


  findDrops() {
    var drops = []
    for (var c = 0; c < this.width; c++) {
      if (this.dots[c][this.height - 1].type == 1) {
        drops.push({ x: c, y: this.height - 1 })
      }
    }
    return drops

  }
  processDrops(drops) {
    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      //this.dots[drop.x][drop.y].image.setAlpha(.5)
      var dot = this.dots[drop.x][drop.y]
      this.selectedDots.push(dot)

      this.scene.explode(drop.x, drop.y)
    }

  }



  findDots(coords) {
    var foundDots = [];
    var board = this;
    coords.forEach(function (coordinates) {
      var found = board.findDot(coordinates);
      if (found) foundDots.push(found);
    });
    //console.log(foundDots)
    return foundDots;
  }
  findDot(coordinates) {
    //var x = col
    //var y = row
    var x = coordinates[0];
    var y = coordinates[1];
    if (this.validCoordinates(x, y)) {
      return this.dots[x][y];
    } else {
      return false;
    }
  }
  findAllByColor = function (color) {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.color == color) container.push(dot);
      });
    });
    return container;
  };
  findBoardColors() {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        container.push(dot.color);
      });
    });


    return container;
  }
  reassignColors() {
    var container = this.findBoardColors()
    console.log(container)
    container = shuffle(container)

    this.dots.forEach(function (column) {
      column.forEach(function (dot, index) {
        var color = container.pop()
        dot.color = color
        dot.image.setTint(dotColors[color])
      });
    });

  }

  validCoordinates(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
  validDrag(dot) {
    return this.rightColor(dot) && this.isNeighbor(dot) && this.notAlreadySelected(dot) && this.canSelectDot(dot) && this.notBlocked(dot);
  }

  rightColor(dot) {
    return dot.color == this.selectedColor;
  }
  canSelectDot(dot) {
    return dot.selectable
  }
  notBlocked(dot) {
    if (this.overlay[dot.coordinates[0]][dot.coordinates[1]].type == 4) {
      return false
    }
    return true
  }
  isNeighbor(dot) {
    var neighbors = this.lastSelectedDot().neighbors();
    return neighbors.includes(dot);

  }

  notAlreadySelected(dot) {
    return !this.selectedDots.includes(dot);

  }
  sameDot = function (dotA, dotB) {
    return dotA.coordinates[0] == dotB.coordinates[0] && dotA.coordinates[1] == dotB.coordinates[1];
  }
  secondToLast(dot) {
    var secondToLastDot = getSecondToLastElement(this.selectedDots);
    return secondToLastDot == dot;
  }
  lastSelectedDot() {
    //console.log(getLastElement(this.selectedDots));
    return getLastElement(this.selectedDots);
  }
  secondToLastSelectedDot() {
    return getSecondToLastElement(this.selectedDots)
  }
  deactivateLastDot() {
    var lastDot = getLastElement(this.selectedDots);
    lastDot.deactivate();
    this.selectedDots.pop();
  }
  activateSquare(dot) {
    this.selectedDots.push(dot);
    this.squareCompleted = true;
    this.scene.cameras.main.shake(50)
    var allColor = this.findAllByColor(this.selectedColor)
    //console.log(allColor.length)
    allColor.forEach(function (dot) {
      dot.image.setAlpha(.5)
    });
  }

  completeSquare(dot) {
    if (this.selectedDots.includes(dot)) {
      var tempDots = this.selectedDots;
      tempDots.push(dot);
      var index = tempDots.indexOf(dot);
      var circle = tempDots.slice(index, tempDots.length);
      console.log(circle)
      if (circle.length >= 5) return true;
    }
    return false;
  }
  swapItems(row, col, row2, col2) {
    let tempObject = Object.assign(this.board[row][col]);
    this.board[row][col] = Object.assign(this.board[row2][col2]);
    this.board[row2][col2] = Object.assign(tempObject);
    return [{
      row: row,
      col: col,
      deltaRow: row - row2,
      deltacol: col - col2
    },
    {
      row: row2,
      col: col2,
      deltaRow: row2 - row,
      deltacol: col2 - col
    }]
  }
}