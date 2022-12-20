let game;



window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },

    scene: [preloadGame, startGame, selectGame, playGame, UI, endGame, endGameChal, levelBuilder, options]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {



  }
  create() {
    dotColors = []

    this.boardWidth = levelConfig.w;
    this.boardHeight = levelConfig.h;
    this.moveLimit = levelConfig.mL;
    this.numColors = levelConfig.c
    this.allowDrop = levelConfig.aD
    this.dropStartCount = levelConfig.dS
    this.dropGoal = levelConfig.dG
    this.allowBomb = levelConfig.aB
    this.bombStartCount = levelConfig.bS
    this.bombGoal = levelConfig.bG
    this.allowIce = levelConfig.aI
    this.iceStartCount = levelConfig.iS
    this.iceGoal = levelConfig.iG
    this.allowBlock = levelConfig.aBl
    this.blockStartCount = levelConfig.blS
    this.allowRover = levelConfig.aR
    this.roverStartCount = levelConfig.rS
    this.allowSquares = levelConfig.square
    this.allowWild = levelConfig.aW
    this.wildStartCount = levelConfig.wS
    this.allowSlime = levelConfig.aSl
    this.allowGem = levelConfig.aG
    this.gemStartCount = levelConfig.gS
    this.allowFire = levelConfig.aF
    this.fireStartCount = levelConfig.fS

    let dotAllColors = colorGroups[gameSettings.colorSet]
    if ((gameMode == 0 || gameMode == 1) && lbFlag == false) {
      this.dotSize = 125
      this.spriteSize = 85
    } else {
      this.dotSize = 95
      this.spriteSize = 75
    }


    this.board = [];
    this.idCount = 0;
    this.selected = null;
    this.scoreList = [];
    this.score = 0;
    this.xOffset = (game.config.width - (this.boardWidth * this.dotSize)) / 2
    this.yOffset = 200
    this.timeStarted = false



    this.oneDot = false
    this.oneColor = false


    for (var i = 0; i < this.numColors; i++) {
      dotColors.push(dotAllColors[i])
    }
    this.cameras.main.setBackgroundColor(0x191919);

    this.dots = this.add.group({

      maxSize: (this.boardWidth * this.boardHeight) + 20,

    });
    ///this.dots.createMultiple(this.boardWidth * this.boardHeight, 'dot2');

    this.board = new Board(this, this.boardWidth, this.boardHeight, this.numColors);
    this.board.makeBoard()
    console.log(this.board)
    this.drawBoard();
    //return this.board;


    this.squareBox = this.add.graphics();
    //this.squareBox.lineStyle(10, 0x00ff00, 1);
    // this.squareBox.fillStyle(0x000000, 0);

    this.squareBox.lineStyle(5, 0xfafafa, 1);

    this.squareBox.strokeRoundedRect(this.xOffset - 10, this.yOffset - 10, (this.dotSize * this.boardWidth) + 20, (this.dotSize * this.boardHeight) + 20, 15);
    // this.squareBox.fillRoundedRect(this.xOffset - 10, this.yOffset - 10, (this.dotSize * this.boardWidth) + 20, (this.dotSize * this.boardHeight + 20), 15);



    this.input.on("pointerdown", this.dotSelect, this);
    this.input.on("pointermove", this.dotMove, this);
    this.input.on("pointerup", this.dotUp, this);


    const config1 = {
      key: 'burst1',
      frames: 'burst',
      frameRate: 20,
      repeat: 0
    };
    this.anims.create(config1);
    this.bursts = this.add.group({
      defaultKey: 'burst',
      maxSize: 30
    });
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);

  }
  update() {

  }
  dotSelect(pointer) {
    this.board.growFire = true
    this.lineArray = []
    this.rectArray = []
    this.board.extraDots = []
    let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
    let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);
    if (!this.board.validCoordinates(col, row)) { return }
    if (this.board.dots[col][row].type == 14) { return }
    console.log(this.board.dots[col][row])
    if (gameMode == 1) {
      if (!this.timeStarted) {
        this.events.emit('time');
        this.timeStarted = true
      }
    }

    if (this.oneDot) {
      this.board.dots[col][row].activate()
      this.board.destroyDots();
      this.board.moves++
      this.addScore()
      this.useOneDot()
      return
    }
    if (this.oneColor) {
      this.board.dots[col][row].activate()
      this.board.activateSquare(this.board.dots[col][row])
      this.board.destroyDots();
      this.moves++
      this.addScore()
      this.useOneColor()
      return
    }

    console.log('row ' + row + ' col ' + col)
    //if (!dot.selectable) { return }
    this.board.dots[col][row].activate();

    if (this.board.dots[col][row].color == -1) {
      this.board.selectedColor = -1
    } else {
      this.board.selectedColor = this.board.dots[col][row].color;
    }

    this.board.dragging = true;
  }
  dotMove(pointer) {
    if (this.board.dragging) {
      let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
      let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);
      if (!this.board.validCoordinates(col, row)) { return }
      var coor = [col, row]
      var dot = this.board.findDot(coor)
      // if (!dot.selectable) { return }
      if (this.board.validDrag(dot) && !this.board.squareCompleted) {
        //new dot
        var line = this.add.line(null, null, this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, dot.image.x, dot.image.y, dotColors[this.board.selectedColor]).setOrigin(0);
        line.setLineWidth(10)
        this.lineArray.push(line)
        var rect = this.add.rectangle(dot.image.x, dot.image.y, 20, 20, dotColors[this.board.selectedColor])
        this.rectArray.push(rect)
        dot.activate();

      } else if (this.board.secondToLast(dot) && !this.board.squareCompleted) {
        //backtrack
        var line = this.lineArray.pop()
        line.setAlpha(0).destroy()
        var rect = this.rectArray.pop()
        rect.setAlpha(0).destroy()
        this.board.deactivateLastDot();
      } else if (this.allowSquares && this.board.rightColor(dot) && this.board.isNeighbor(dot) && this.board.completeSquare(dot)) {
        //square
        var line = this.add.line(null, null, this.board.secondToLastSelectedDot().image.x, this.board.secondToLastSelectedDot().image.y, this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, dotColors[this.board.selectedColor]).setOrigin(0);
        line.setLineWidth(10)
        this.lineArray.push(line)
        var rect = this.add.rectangle(this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, 20, 20, dotColors[this.board.selectedColor])
        this.rectArray.push(rect)
        this.board.activateSquare(dot);
        this.squareBox.lineStyle(15, dotColors[this.board.selectedColor], 1);
        this.squareBox.strokeRoundedRect(this.xOffset - 10, this.yOffset - 10, (this.dotSize * this.boardWidth) + 20, (this.dotSize * this.boardHeight) + 20, 15);
      }
    }
  }
  dotUp() {
    if (!this.board.dragging) { return }

    if (this.board.selectedDots.length > 1) {
      this.board.gems = []
      if (this.board.squareCompleted) {
        this.board.tally[6]++
        this.squareBox.clear()
        this.squareBox.lineStyle(5, 0xfafafa, 1);
        this.squareBox.strokeRoundedRect(this.xOffset - 10, this.yOffset - 10, (this.dotSize * this.boardWidth) + 20, (this.dotSize * this.boardHeight) + 20, 15);
      }
      this.board.destroyDots();


      if (this.lineArray.length > 0) {
        this.lineArray.forEach(function (line) {
          line.destroy()
        }.bind(this))
        this.lineArray = []
      }
      if (this.rectArray.length > 0) {
        this.rectArray.forEach(function (rect) {
          rect.destroy()
        }.bind(this))
        this.rectArray = []
      }

      ///////
      if (this.allowDrop) {
        var drops = this.board.findDrops()
        console.log(drops.length)
        while (drops.length > 0) {
          this.board.processDrops(drops)
          this.board.destroyDots()
          drops = this.board.findDrops()
          // this.addScore()
        }
      }
      //////=
      if (this.allowBomb) {
        console.log(this.board.extraDots.length)
        if (this.board.extraDots.length > 0) {
          var neighbors = []
          for (var i = 0; i < this.board.extraDots.length; i++) {
            var dot = this.board.findDot(this.board.extraDots[i])
            neighbors.push(...dot.neighbors())

          }
          console.log(neighbors)
          this.board.selectedDots = neighbors
          //this.explodeAll(neighbors)
          this.board.destroyDots()
        }
      }
      if (this.allowGem) {
        console.log(this.board.gems)
        if (this.board.gems.length > 0) {
          for (let i = 0; i < this.board.gems.length; i++) {
            const gem = this.board.gems[i];
            var col = this.board.findColumn(gem[0])
            this.board.selectedDots = col
            //this.explodeAll(neighbors)
            this.board.destroyDots()
          }

        }
      }
      //////////
      if (this.allowFire && this.board.growFire) {
        var fires = this.board.findFire()

        if (fires.length > 0) {
          console.log(fires)
          //for (var f = 0; f < fires.length; f++) {
          var n = Phaser.Math.RND.pick(fires)
          n.type = 15
          n.color = 7
          n.image.setTexture('fire')
          n.image.setTint(0xff0000)
          n.selectable = false
          var tween = this.tweens.add({
            targets: n,
            alpha: 0,
            duration: 200,
            yoyo: true,
          })
          //}


        }

      }
      if (this.allowRover) {
        var rovers = this.board.findRovers()
        console.log(rovers)
        if (rovers.length > 0) {
          var n = this.board.randomNeighbor(rovers[0])
          this.board.moveRover(rovers[0], n)

        }

      }
      this.board.moves++
      this.addScore()
    } else {
      this.board.resetBoard();
    }

    this.board.dragging = false;



  }
  drawBoard() {
    if (this.allowFire) {
      var placed = 0
      while (placed < this.fireStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 1)
        if (this.board.dots[randX][randY].type < 6) {
          this.board.dots[randX][randY].selectable = false
          this.board.dots[randX][randY].color = 6
          this.board.dots[randX][randY].type = 15
          this.board.dots[randX][randY].image.setTexture('fire').setTint(0xff0000)
          placed++
        }
      }
    }
    if (this.allowGem) {
      var placed = 0
      while (placed < this.gemStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 1)
        if (this.board.dots[randX][randY].type < 6) {
          this.board.dots[randX][randY].selectable = false

          this.board.dots[randX][randY].type = 14
          this.board.dots[randX][randY].image.setTexture('gem')
          placed++
        }
      }
    }
    if (this.allowSlime) {
      this.board.underlay[0][0].selectable = false

      this.board.underlay[0][0].type = 13
      let xpos = this.xOffset + this.dotSize * 0 + this.dotSize / 2;
      let ypos = this.yOffset + this.dotSize * 0 + this.dotSize / 2
      var slime = this.add.image(xpos, ypos, 'blank').setTint(0x685570).setAlpha(.7)
      slime.displayWidth = this.dotSize
      slime.displayHeight = this.dotSize
      this.board.underlay[0][0].image = slime
      this.board.underlay[0][0].image.setDepth(0)
      this.board.tally[13]++
    }
    if (this.allowWild) {
      console.log('making rovers')
      var placedR = 0
      while (placedR < this.wildStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 1)
        if (this.board.dots[randX][randY].type < 6) {

          this.board.dots[randX][randY].color = -1
          this.board.dots[randX][randY].type = 12
          this.board.dots[randX][randY].image.setTexture('wild').clearTint()
          placedR++
        }
      }
    }

    if (this.allowRover) {
      console.log('making rovers')
      var placedR = 0
      while (placedR < this.roverStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 2)
        if (this.board.dots[randX][randY].type < 6) {
          this.board.dots[randX][randY].strength = 3
          this.board.dots[randX][randY].type = 11
          this.board.dots[randX][randY].image.setTexture('rover', 3)
          placedR++
        }
      }
    }

    if (this.allowBomb) {
      console.log('making bombs')
      var placedB = 0
      while (placedB < this.bombStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 2)
        if (this.board.dots[randX][randY].type < 6) {
          this.board.dots[randX][randY].strength = 3
          this.board.dots[randX][randY].type = 8
          this.board.dots[randX][randY].image.setTexture('bomb', 3)
          placedB++
        }
      }
    }
    if (this.allowDrop) {
      var placed = 0
      while (placed < this.dropStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 2)
        if (this.board.dots[randX][randY].type < 6) {
          this.board.dots[randX][randY].selectable = false
          this.board.dots[randX][randY].color = 6
          this.board.dots[randX][randY].type = 7
          this.board.dots[randX][randY].image.setTexture('arrow').setTint(0xF1C40F)
          placed++
        }
      }
    }
    if (this.allowIce) {
      var placed = 0
      while (placed < this.iceStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 1)
        if (this.board.overlay[randX][randY].type < 6) {
          this.board.overlay[randX][randY].selectable = false
          this.board.overlay[randX][randY].strength = 3
          this.board.overlay[randX][randY].type = 9
          let xpos = this.xOffset + this.dotSize * randX + this.dotSize / 2;
          let ypos = this.yOffset + this.dotSize * randY + this.dotSize / 2
          var ice = this.add.image(xpos, ypos, 'ice', 3)
          ice.displayWidth = this.dotSize
          ice.displayHeight = this.dotSize
          this.board.overlay[randX][randY].image = ice

          placed++
        }
      }
    }
    if (this.allowBlock) {
      var placed = 0
      while (placed < this.blockStartCount) {
        var randX = Phaser.Math.Between(0, this.boardWidth - 1)
        var randY = Phaser.Math.Between(0, this.boardHeight - 1)
        if (this.board.overlay[randX][randY].type < 6) {
          this.board.overlay[randX][randY].selectable = false

          this.board.overlay[randX][randY].type = 10
          let xpos = this.xOffset + this.dotSize * randX + this.dotSize / 2;
          let ypos = this.yOffset + this.dotSize * randY + this.dotSize / 2
          var block = this.add.image(xpos, ypos, 'block')
          block.displayWidth = this.spriteSize
          block.displayHeight = this.spriteSize
          this.board.overlay[randX][randY].image = block

          placed++
        }
      }
    }



    for (var i = 0; i < this.boardHeight; i++) {
      for (var j = 0; j < this.boardWidth; j++) {
        // var xpos = i*64 + 160;
        //  var ypos = 550 - j*64;
        let xpos = this.xOffset + this.dotSize * j + this.dotSize / 2;
        let ypos = this.yOffset + this.dotSize * i + this.dotSize / 2
        var dot = this.board.dots[j][i];
        //  console.log(dot)
        if (dot.image.x !== xpos || dot.image.y !== ypos) {
          //   var t = this.game.add.tween(dot).to({x: xpos, y: ypos}, 300).start();
          var t = this.tweens.add({
            targets: dot.image,
            x: xpos,
            y: ypos,
            duration: 300
          })
        }
      }
    }

  }
  validCoordinates = function (x, y) {
    return x >= 0 && y >= 0 && x < this.boardWidth && y < this.boardHeight;
  }
  explodeAll(array) {
    for (let i = 0; i < array.length; i++) {
      const dot = array[i];
      this.explode(dot.coordinates[0], dot.coordinates[0])

    }
  }
  explode(x, y) {
    // let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
    // let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(3).setDepth(3);
    explosion.x = this.board.dots[x][y].image.x;
    explosion.y = this.board.dots[x][y].image.y;
    explosion.play('burst1');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);
    }, this);
  }
  damageEmit(objX, objY) {
    var particlesColor = this.add.particles("star");
    //.setTint(0x7d1414);
    var emitter = particlesColor.createEmitter({
      // particle speed - particles do not move
      // speed: 1000,
      //frame: { frames: [0, 1, 2, 3], cycle: true },

      speed: {
        min: -500,
        max: 500
      },
      // particle scale: from 1 to zero
      scale: {
        start: .6,
        end: 0
      },
      // particle alpha: from opaque to transparent
      alpha: {
        start: 1,
        end: 1
      },
      // particle frequency: one particle every 100 milliseconds
      frequency: 3,
      // particle lifespan: 1 second
      lifespan: 1000
    });
    //emitter.tint.onChange(0x7d1414);
    emitter.explode(40, objX, objY);

  }


  addScore() {
    this.events.emit('score');
  }
  useOneDot() {
    this.events.emit('oneDot');
  }
  useOneColor() {
    this.events.emit('oneColor');
  }
  shuffleBoard() {
    this.board.reassignColors()
  }

}
