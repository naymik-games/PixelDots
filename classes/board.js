class Board {
  constructor(scene, width, height, numColors) {
    this.width = width;
    this.height = height
    this.scene = scene
    this.dots = [];
    this.overlay = []
    this.underlay = []
    this.idCount = 0
    this.selectedColor = null
    this.selectedDots = []
    this.gems = []
    this.squareCompleted = false
    this.numColors = numColors
    this.redrawTheseColumns = {};
    this.growFire = true;
    this.tally = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    var columnUnderlay = []
    for (var yAxis = 0; yAxis < this.height; yAxis++) {
      var dot = this.addDot(xAxis, yAxis);
      column.push(dot);
      columnOverlay.push({ coordinates: [xAxis, yAxis], image: null, type: 0, strength: 3, color: 8 })
      columnUnderlay.push({ coordinates: [xAxis, yAxis], image: null, type: 0, strength: 3, color: 8 })
    }
    this.dots.push(column);
    this.overlay.push(columnOverlay)
    this.underlay.push(columnUnderlay)

  };
  addDot(x, y) {
    var num = Phaser.Math.Between(0, dotColors.length - 1);
    var id = this.idCount;
    var dot = new Dot(id, x, y, num, this, this.scene.dotSize)

    var dotImg = this.scene.dots.get();
    // console.log(dotImg)
    dotImg.setTexture('dot2', 0)
    dotImg.setTint(dotColors[dot.color]).setDepth(1)
    dotImg.displayWidth = this.scene.spriteSize
    dotImg.displayHeight = this.scene.spriteSize
    let posX = this.scene.xOffset + this.scene.dotSize * x + this.scene.dotSize / 2;
    dotImg.setPosition(posX, -game.config.height / 2);
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
    //var rand = Phaser.Math.Between(1, 100)
    if (this.scene.allowDrop && Phaser.Math.Between(1, 100) < 11 && this.findCount(7) < this.scene.dropStartCount) {
      this.setDrop(x, 0)
    } else if (this.scene.allowBomb && Phaser.Math.Between(1, 100) < 11 && this.findCount(8) < this.scene.bombStartCount) {
      this.setBomb(x, 0)
    } else if (this.scene.allowWild && Phaser.Math.Between(1, 100) < 9 && this.findCount(12) < this.scene.wildStartCount) {
      this.setWild(x, 0)
    } else if (this.scene.allowGem && Phaser.Math.Between(1, 100) < 8 && this.findCount(14) < this.scene.gemStartCount) {
      this.setGem(x, 0)
    } else if (this.scene.allowRover && Phaser.Math.Between(1, 100) < 9 && this.findCount(11) < this.scene.roverStartCount) {
      this.setRover(x, 0)
    }
    //   dot.image.displayWidth = this.scene.spriteSize
    //  dot.image.displayHeight = this.scene.spriteSize
    // dot.image.setPosition(posX, posY)
    this.dots[x].unshift(dot);
    //this.newDots.push({x: x, y:0})
  }
  setSlime(coordinates) {
    var x = coordinates[0]
    var y = coordinates[1]
    if (this.underlay[x][y].type != 13) {
      console.log('adding slime ' + x + ', ' + y)
      this.underlay[x][y].selectable = false

      this.underlay[x][y].type = 13
      let xpos = this.scene.xOffset + this.scene.dotSize * x + this.scene.dotSize / 2;
      let ypos = this.scene.yOffset + this.scene.dotSize * y + this.scene.dotSize / 2
      var slime = this.scene.add.image(xpos, ypos, 'blank').setTint(0x685570).setAlpha(.7)
      slime.displayWidth = this.scene.dotSize
      slime.displayHeight = this.scene.dotSize
      this.underlay[x][y].image = slime
      this.underlay[x][y].image.setDepth(0)
      this.tally[13]++
    }

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
    if (this.overlay[coordinates[0]][coordinates[1]].type == 9) {
      console.log('ice ice baby')
      if (this.overlay[coordinates[0]][coordinates[1]].strength > 0) {
        this.overlay[coordinates[0]][coordinates[1]].strength--


      } else {
        this.overlay[coordinates[0]][coordinates[1]].type = 0
        this.tally[9]++
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
  deleteWildSquare() {
    this.selectedDots.forEach(function (dot) {
      if (dot.color == -1) {
        dot.explode();
      }

    });
    this.selectedDots.forEach(function (dot) {
      if (dot.color == -1) {
        dot.destroy();
      }
    });
  }
  deleteArrayOfDots(array) {
    array.forEach(function (dot) {

      dot.explode();
    });
    array.forEach(function (dot) {
      dot.destroy();
    });
  }
  deleteAllDotsofColor() {
    this.deleteWildSquare()
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
        let posX = board.scene.xOffset + board.scene.dotSize * x + board.scene.dotSize / 2;
        let posY = board.scene.yOffset + board.scene.dotSize * dot.coordinates[1] + board.scene.dotSize / 2
        /* board.scene.tweens.add({
          targets: dot.image,
          x: posX,
          y: posY,
          duration: 50 * dot.coordinates[1],
          ease: 'cubit'
        }) */
        dot.image.setPosition(posX, posY)
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
        if (dot.type == 11) container.push(dot);
      });
    });
    return container;

  }
  findFire() {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.type == 15) {
          var n = dot.neighbors()
          for (var i = 0; i < n.length; i++) {
            if (n[i].type < 6) {
              container.push(n[i]);
            }
          }

        }

      });
    });
    return container;

  }
  findCount(type) {
    var container = 0;
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.type == type) container++;
      });
    });
    return container;

  }

  findDrops() {
    var drops = []
    for (var c = 0; c < this.width; c++) {
      if (this.dots[c][this.height - 1].type == 7) {
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
  findColumn(col) {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.coordinates[0] == col) container.push(dot);
      });
    });
    return container;

  }
  findRow(row) {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.coordinates[1] == row) container.push(dot);
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

    if (this.canSelectDot(dot) && this.rightColor(dot) && this.isNeighbor(dot) && this.notAlreadySelected(dot) && this.notBlocked(dot)) {
      return true
    } /* else if (dot.color == -1 && this.isNeighbor(dot) && this.notAlreadySelected(dot) && this.canSelectDot(dot) && this.notBlocked(dot)) {
      //this.board.selectedColor = dot.color;
      return true
    } else if (this.lastSelectedDot().color == -1 && this.isNeighbor(dot) && this.notAlreadySelected(dot) && this.canSelectDot(dot) && this.notBlocked(dot)) {
      //this.board.selectedColor = dot.color;
      return true
    } */
  }



  connects(dot1, dot2) {
    if (dot1 == undefined || dot2 == undefined) { return }
    //return this.b.board[dot1.row][dot1.col].value === this.b.board[dot2.row][dot2.col].value && this.b.areNext(dot1, dot2)
    if (dot1.type == 14 || dot2.type == 14) { return false }
    if (this.b.board[dot1.row][dot1.col].value === this.b.board[dot2.row][dot2.col].value && this.b.areNext(dot1, dot2)) {
      return true
    } else if (this.valueAt(dot1.row, dot1.col) == gameOptions.wildValue && this.b.areNext(dot1, dot2)) {
      this.b.setValue(dot1.row, dot1.col, this.b.valueAt(dot2.row, dot2.col))
      return true
    } else if (this.valueAt(dot2.row, dot2.col) == gameOptions.wildValue && this.b.areNext(dot1, dot2)) {
      this.b.setValue(dot2.row, dot2.col, this.b.valueAt(dot1.row, dot1.col))
      return true
    }


    //return false
  }



  rightColor(dot) {
    if (dot.type == 14) { return false }
    if (this.selectedColor == -1) {
      if (dot.color > -1) {
        this.selectedColor = dot.color
      }
      return true
    } else if (dot.color == -1) {
      return true

    } else {
      return dot.color == this.selectedColor
    }

  }
  canSelectDot(dot) {
    return dot.selectable
  }
  notBlocked(dot) {
    if (this.overlay[dot.coordinates[0]][dot.coordinates[1]].type == 10) {
      return false
    }
    return true
  }
  isNeighbor(dot) {
    var neighbors = this.lastSelectedDot().neighbors();
    return neighbors.includes(dot);

  }
  randomNeighbor(dot) {
    var neighbors = dot.neighbors();
    var found = false
    //var temp = sample(neighbors)
    // console.log(temp)
    while (!found) {
      var temp = sample(neighbors)
      if (this.validCoordinates(temp.coordinates[0], temp.coordinates[1])) {
        found = true

      }
    }
    return temp
  }
  notAlreadySelected(dot) {
    return !this.selectedDots.includes(dot);

  }
  moveRover(rover) {
    var num = Phaser.Math.Between(0, dotColors.length - 1)
    rover.image.setTint(dotColors[num])
    rover.color = num
    /* var randomNum = randomExcludedNumber(dotColors.length, num);
    var n = rover.neighbors()
    for (var i = 0; i < n.length; i++) {
      if (n[i].type < 6) {
        //var num = Phaser.Math.Between(0, dotColors.length - 1)
        n[i].image.setTint(dotColors[randomNum])
        n[i].color = randomNum
      }
    } */
    //var swap = this.swapItems(rover.coordinates[0], rover.coordinates[1], target.coordinates[0], target.coordinates[1])
    // this.dots[rover.coordinates[0]][rover.coordinates[1]].image.setAlpha(.6)
    //this.dots[target.coordinates[0]][target.coordinates[1]].image.setAlpha(.6)
    //console.log(swap)
    //rover
    // this.dots[swap[1].col][swap[1].row].image.setAlpha(.6)
    //this.dots[swap[0].col][swap[0].row].image.setAlpha(.6)


    // this.dots[swap[0].col][swap[0].row].image.setAlpha(.6)
    //  let xpos = this.xOffset + this.dotSize * randX + this.dotSize / 2;
    //  let ypos = this.yOffset + this.dotSize * randY + this.dotSize / 2
    /*  var r = this.scene.tweens.add({
       targets: this.dots[swap[1].col][swap[1].row].image,
       x: this.scene.xOffset + this.scene.dotSize * swap[0].col + this.scene.dotSize / 2,
       y: this.scene.yOffset + this.scene.dotSize * swap[0].row + this.scene.dotSize / 2,
       duration: 500,
     })
     var t = this.scene.tweens.add({
       targets: this.dots[swap[0].col][swap[0].row].image,
       x: this.scene.xOffset + this.scene.dotSize * swap[1].col + this.scene.dotSize / 2,
       y: this.scene.yOffset + this.scene.dotSize * swap[1].row + this.scene.dotSize / 2,
       duration: 500
     }) */

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
  swapItems(col, row, col2, row2) {
    let tempObject = Object.assign(this.dots[col][row]);
    this.dots[col][row] = Object.assign(this.dots[col2][row2]);
    this.dots[col2][row2] = Object.assign(tempObject);
    /* let tempObject = this.dots[col][row];
    this.dots[col][row] = this.dots[col2][row2];
    this.dots[col2][row2] = tempObject */
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
  addDrop(count) {
    var placed = 0
    while (placed < count) {
      var randX = Phaser.Math.Between(0, this.width - 1)
      var randY = Phaser.Math.Between(0, this.height - 2)
      if (this.dots[randX][randY].type < 6) {
        this.setDrop(randX, randY)
        placed++
      }
    }
  }
  setDrop(randX, randY) {
    this.dots[randX][randY].selectable = false
    this.dots[randX][randY].color = 6
    this.dots[randX][randY].type = 7
    this.dots[randX][randY].image.setTexture('arrow').setTint(0xF1C40F)
  }

  addBomb(count) {
    var placedB = 0
    while (placedB < count) {
      var randX = Phaser.Math.Between(0, this.width - 1)
      var randY = Phaser.Math.Between(0, this.height - 1)
      if (this.dots[randX][randY].type < 6) {
        this.setBomb(randX, randY)
        placedB++
      }
    }
  }
  setBomb(randX, randY) {
    this.dots[randX][randY].strength = 3
    this.dots[randX][randY].type = 8
    this.dots[randX][randY].image.setTexture('bomb', 3)
  }
  addWild(count) {
    var placedR = 0
    while (placedR < count) {
      var randX = Phaser.Math.Between(0, this.width - 1)
      var randY = Phaser.Math.Between(0, this.height - 1)
      if (this.dots[randX][randY].type < 6) {
        this.setWild(randX, randY)

        placedR++
      }
    }
  }
  setWild(randX, randY) {
    this.dots[randX][randY].color = -1
    this.dots[randX][randY].type = 12
    this.dots[randX][randY].image.setTexture('wild').clearTint()
  }
  addGem(count) {
    var placed = 0
    while (placed < count) {
      var randX = Phaser.Math.Between(0, this.width - 1)
      var randY = Phaser.Math.Between(0, this.height - 1)
      if (this.dots[randX][randY].type < 6) {
        this.setGem(randX, randY)
        placed++
      }
    }
  }
  setGem(randX, randY) {
    this.dots[randX][randY].selectable = false
    this.dots[randX][randY].type = 14
    this.dots[randX][randY].image.setTexture('gem')
  }
  addRover(count) {
    var placedR = 0
    while (placedR < count) {
      var randX = Phaser.Math.Between(0, this.width - 1)
      var randY = Phaser.Math.Between(0, this.height - 1)
      if (this.dots[randX][randY].type < 6) {
        this.setRover(randX, randY)
        placedR++
      }
    }
  }
  setRover(randX, randY) {
    this.dots[randX][randY].strength = 3
    this.dots[randX][randY].type = 11
    this.dots[randX][randY].image.setTexture('rover', 3)
  }
}