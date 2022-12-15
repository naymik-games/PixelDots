class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {


  }
  create() {

    this.Main = this.scene.get('playGame');

    this.score = 0;
    if (gameMode != 3) {
      this.modeText = this.add.text(450, 50, gameModeNames[gameMode], { fontFamily: 'PixelFont', fontSize: '100px', color: '#FaFaFa', align: 'left' }).setOrigin(.5)
      this.totalText = this.add.text(775, 50, '0', { fontFamily: 'PixelFont', fontSize: '120px', color: '#F0B060', align: 'left' }).setOrigin(.5)
      this.bestText = this.add.text(775, 125, gameSettings.mostDots[gameMode], { fontFamily: 'PixelFont', fontSize: '70px', color: '#FF0000', align: 'left' }).setOrigin(.5)
    }

    this.scoreText = this.add.text(125, 50, '0', { fontFamily: 'PixelFont', fontSize: '120px', color: '#F0B060', align: 'left' }).setOrigin(.5)
    if (gameMode == 0 || gameMode == 2 || gameMode == 3) {
      this.goalText = this.add.text(125, 125, '/' + this.Main.moveLimit, { fontFamily: 'PixelFont', fontSize: '70px', color: '#F0B060', align: 'left' }).setOrigin(.5)
    }

    //this.squareText1 = this.add.text(850, 1600, '0', { fontFamily: 'PixelFont', fontSize: '100px', color: '#F0B060', align: 'left' }).setOrigin(1, .5).setAlpha(1)



    if (gameMode == 1) {
      this.initialTime = 60;
      this.timeText = this.add.text(450, 115, this.formatTime(this.initialTime), { fontFamily: 'PixelFont', fontSize: '100px', color: '#F0B060', align: 'left' }).setOrigin(.5)

    }
    /////////////////////////////// 
    // BUTTONS FOR POWER UPS
    /////////////////////////////
    this.onDotText = this.add.text(50, 1450, '1 DOT', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    this.onDotText.on('pointerdown', function () {
      if (this.Main.oneDot) {
        this.onDotText.setColor('#ffffff')
        this.Main.oneDot = false
      } else {
        this.onDotText.setColor('#ff0000')
        this.Main.oneDot = true
      }
    }, this)
    this.oneColorTextd = this.add.text(350, 1450, '1 COLOR', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    this.oneColorTextd.on('pointerdown', function () {
      if (this.Main.oneColor) {
        this.oneColorTextd.setColor('#ffffff')
        this.Main.oneColor = false
      } else {
        this.oneColorTextd.setColor('#ff0000')
        this.Main.oneColor = true
      }
    }, this)
    this.shuffleText = this.add.text(650, 1450, 'SHUFFLE', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    this.shuffleText.on('pointerdown', function () {
      this.Main.shuffleBoard()
    }, this)

    //////////////////////////////
    //bottom tally
    this.tallyContainer = this.add.container()
    var dotSize = 125
    this.xOffset = (game.config.width - (dotColors.length * dotSize)) / 2
    var tallyBG = this.add.image(450, 775, 'blank').setTint(0x393939).setAlpha(.8)
    tallyBG.displayWidth = 850
    tallyBG.displayHeight = 500

    this.tallyContainer.add(tallyBG)
    this.tallyArray = []
    for (var i = 0; i < this.Main.board.tally.length; i++) {
      if (i < 6) {
        var x = i
        var tX = this.xOffset + dotSize * x + dotSize / 2
        var tTextY = 650
        var tIconY = 660
      } else if (i < 12) {
        var x = i - 6
        var tX = this.xOffset + dotSize * x + dotSize / 2
        var tTextY = 800
        var tIconY = 810
      } else {
        var x = i - 12
        var tX = this.xOffset + dotSize * x + dotSize / 2
        var tTextY = 950
        var tIconY = 960
      }

      var testDot = this.add.image(tX, tIconY, 'dot2').setTint(dotColors[i])
      testDot.displayWidth = this.Main.spriteSize * .50
      testDot.displayHeight = this.Main.spriteSize * .50
      this.tallyContainer.add(testDot)
      var tallyText = this.add.text(tX, tTextY - (this.Main.spriteSize * .50) / 1.5, '0', { fontFamily: 'PixelFont', fontSize: '90px', color: '#F0B060', align: 'left' }).setOrigin(.5, 1)
      this.tallyContainer.add(tallyText)
      this.tallyArray.push(tallyText)
    }
    this.tallyContainer.setAlpha(1)
    this.tallyContainer.setPosition(0, -1640)

    if (gameMode == 3) {
      this.setupGoals()
      this.onLevelText = this.add.text(640, 1580, 'LV ' + (gameSettings.currentLevel + 1), { fontFamily: 'PixelFont', fontSize: '125px', color: '#F0B060', align: 'left' }).setOrigin(0, .5)

    }




    this.end = this.add.container(900, 0)
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0xfafafa, 1)
    this.graphics.fillRect(0, 0, 900, 1500);
    this.end.add(this.graphics)
    var scoreleText = this.add.text(225, 700, '145', { fontFamily: 'PixelFont', fontSize: '250px', color: '#000000', align: 'left' }).setOrigin(.5).setInteractive()
    this.end.add(scoreleText)
    //this. graphics.strokeRect(x, y, width, height);



    /////////////////////////////////////////
    //EVENTS
    /////////////////////////////////////////
    this.Main.events.on('oneDot', function () {
      this.Main.oneDot = false
      this.onDotText.setColor('#ffffff')
    }, this);
    this.Main.events.on('oneColor', function () {
      this.Main.oneColor = false
      this.oneColorTextd.setColor('#ffffff')
    }, this);

    this.Main.events.on('score', function () {
      this.scoreText.setText(this.Main.board.moves)
      //  this.squareText.setText(this.Main.board.tally[10])
      var total = 0
      for (var i = 0; i < this.Main.board.tally.length; i++) {
        this.tallyArray[i].setText(this.Main.board.tally[i])
        if (i < 6) {
          total += this.Main.board.tally[i]
        }

      }
      if (gameMode != 3) {
        this.totalText.setText(total)
      }

      if (gameMode == 3) {
        this.winConditions();
      }
      if (this.Main.board.moves == this.Main.moveLimit && gameMode != 1) {

        var txt = 'Game Over ' + total + ' Dots Collected'
        this.scene.pause()
        this.scene.pause('playGame')
        if (gameMode != 3) {
          this.scene.launch('endGame')
        } else {
          this.scene.launch('endGameChal', { result: 'Fail' })
        }

        //this.loadEnd()
      }
      //console.log('dots ' + string)

    }, this);
    this.Main.events.on('time', function () {
      this.timedEvent.paused = false;
    }, this)
    /////////////////////////////
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true, paused: true });


    /////////////////////////////
    this.makeMenu()


  }

  update() {

  }
  onEvent() {
    this.initialTime -= 1; // One second
    this.timeText.setText(this.formatTime(this.initialTime));
    if (this.initialTime == 0) {
      this.scene.pause()
      this.scene.pause('playGame')
      this.scene.launch('endGame')
    }
  }
  loadEnd() {
    var tween = this.tweens.add({
      targets: this.end,
      x: 0,
      duration: 500
    })
  }
  formatTime(seconds) {
    // Minutes
    var minutes = Math.floor(seconds / 60);
    // Seconds
    var partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, '0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
  }
  tweenCount(count, icon) {
    var cx = count.x;
    var cy = count.y;
    this.damageEmit(cx, cy);
    var tween = this.tweens.add({
      targets: count,
      // y: '-= 75',
      alpha: 0,
      duration: 300,
      onCompleteScope: this,
      onComplete: function () {

        var check = this.add.image(cx, cy, 'check').setOrigin(0, .5).setScale(.4).setAlpha(0).setTint(0x62cc7e);
        var tweencheck = this.tweens.add({
          targets: check,
          alpha: 1,
          duration: 300,
        })
      }
    });
    var tweenicon = this.tweens.add({
      targets: icon,
      // alpha:0,
      scale: 1,
      duration: 200,
      yoyo: true
    })


  }
  setupGoals() {
    // console.log(levels[onLevel].length);
    //  for (var i = 0; i < levels[onLevel].length; i++) {
    var i = 0;
    var j = 0;
    var x = 0;
    var y = 65;
    this.winCount = 0;
    this.winComplete = 0;
    var xOffsetT = 250
    var xOffsetI = 310
    var xSpace = 175
    var labelSize = 45
    var labelColor = 0xfafafa
    var winC = levelConfig.win


    Object.entries(winC).forEach(([key, value]) => {



      if (key == 'color0') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.color0Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(.35).setAlpha(1).setTint(dotColors[0]);
        this.color0Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.color0Goal = value;
        this.color0Text.setText(value);
        this.color0Win = true;
        this.winCount++;
        i++;
        j++;
      }

      if (key == 'color1') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.color1Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(.35).setAlpha(1).setTint(colors[1]);
        this.color1Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.color1Goal = value;
        this.color1Text.setText(value);
        this.color1Win = true;
        this.winCount++;
        i++;
        j++;
      }
      if (key == 'color2') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.color2Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(.35).setAlpha(1).setTint(colors[2]);
        this.color2Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.color2Goal = value;
        this.color2Text.setText(value);
        this.color2Win = true;
        this.winCount++;
        i++;
        j++;
      }
      if (key == 'color3') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.color3Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(.35).setAlpha(1).setTint(colors[3]);
        this.color3Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.color3Goal = value;
        this.color3Text.setText(value);
        this.color3Win = true;
        this.winCount++;
        i++;
        j++;

      }
      if (key == 'color4') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.color4Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(.35).setAlpha(1).setTint(colors[4]);
        this.color4Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.color4Goal = value;
        this.color4Text.setText(value);
        this.color4Win = true;
        this.winCount++;
        i++;
        j++;

      }
      if (key == 'color5') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.color5Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(.35).setAlpha(1).setTint(colors[5]);
        this.color5Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.color5Goal = value;
        this.color5Text.setText(value);
        this.color5Win = true;
        this.winCount++;
        i++;
        j++;

      }

      if (key == 'drop') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.dropIcon = this.add.image(xOffsetT + x * xSpace, y, 'arrow').setScale(.35).setAlpha(1).setTint(0xF1C40F);
        this.dropText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.dropGoal = value;
        this.dropText.setText(value);
        this.dropWin = true;
        this.winCount++;
        i++;
        j++;
      }

      if (key == 'ice') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.iceIcon = this.add.image(xOffsetT + x * xSpace, y, 'ice', 3).setScale(.35).setAlpha(1)
        this.iceText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.iceGoal = value;
        this.iceText.setText(value);
        this.iceWin = true;
        this.winCount++;
        i++;
        j++;
      }

      /* if (key == 'gem') {
        if (i > 2) {
          y = 160;
          x = i - 3;
        } else {
          x = i;
        }
        this.gemIcon = this.add.image(xOffsetT + x * xSpace, y, 'gem').setScale(.5).setAlpha(1).setTint(0xb8b8b8);
        this.gemText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.gemGoal = value;
        this.gemText.setText(value);
        this.gemWin = true;
        this.winCount++;
        i++;
        j++;
      } */
      if (key == 'square') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.squareIcon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(.35).setAlpha(1).setTint(0xb8b8b8);
        this.squareText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.squareGoal = value;
        this.squareText.setText(value);
        this.squareWin = true;
        this.winCount++;
        i++;
        j++;
      }

      if (key == 'bomb') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.bombIcon = this.add.image(xOffsetT + x * xSpace, y, 'bomb', 3).setScale(.35).setAlpha(1).setTint(0xb8b8b8);
        this.bombText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.bombGoal = value;
        this.bombText.setText(value);
        this.bombWin = true;
        this.winCount++;
        i++;
        j++;
      }
      if (key == 'rover') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.roverIcon = this.add.image(xOffsetT + x * xSpace, y, 'rover', 3).setScale(.35).setAlpha(1).setTint(0xb8b8b8);
        this.roverText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.roverGoal = value;
        this.roverText.setText(value);
        this.roverWin = true;
        this.winCount++;
        i++;
        j++;
      }
      if (key == 'wild') {
        if (i > 2) {
          y = 140;
          x = i - 3;
        } else {
          x = i;
        }
        this.wildIcon = this.add.image(xOffsetT + x * xSpace, y, 'wild').setScale(.35).setAlpha(1).setTint(0xb8b8b8);
        this.wildText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
        this.wildrGoal = value;
        this.wildText.setText(value);
        this.wildWin = true;
        this.winCount++;
        i++;
        j++;
      }
      //console.log(key + ' ' + value); // "a 5", "b 7", "c 9"

    });
    // console.log(levelSettings.win[i].thing2);
    //  }
  }
  winConditions() {




    if (this.color0Win) {
      this.color0Text.setText(this.color0Goal - this.Main.board.tally[0]);
      if (this.Main.board.tally[0] >= this.color0Goal) {
        this.tweenCount(this.color0Text, this.color0Icon);
        this.color0Goal = -100
        this.winComplete++;
        this.color0Win = false;
      }
    }
    if (this.color1Win) {
      this.color1Text.setText(this.color1Goal - this.Main.board.tally[1]);
      if (this.Main.board.tally[1] >= this.color1Goal) {
        this.tweenCount(this.color1Text, this.color1Icon);
        this.color1Goal = -100
        this.winComplete++;
        this.color1Win = false;
      }
    }
    if (this.color2Win) {
      this.color2Text.setText(this.color2Goal - this.Main.board.tally[2]);
      if (this.Main.board.tally[2] >= this.color2Goal) {
        this.tweenCount(this.color2Text, this.color2Icon);
        this.color2Goal = -100
        this.winComplete++;
        this.color2Win = false;
      }
    }
    if (this.color3Win) {
      this.color3Text.setText(this.color3Goal - this.Main.board.tally[3]);
      if (this.Main.board.tally[3] >= this.color3Goal) {
        this.tweenCount(this.color3Text, this.color3Icon);
        this.color3Goal = -100
        this.winComplete++;
        this.color3Win = false;
      }
    }
    if (this.color4Win) {
      this.color4Text.setText(this.color4Goal - this.Main.board.tally[4]);
      if (this.Main.board.tally[4] >= this.color4Goal) {
        this.tweenCount(this.color4Text, this.color4Icon);
        this.color4Goal = -100
        this.winComplete++;
        this.color4Win = false;
      }
    }
    if (this.color5Win) {
      this.color5Text.setText(this.color5Goal - this.Main.board.tally[5]);
      if (this.Main.board.tally[5] >= this.color5Goal) {
        this.tweenCount(this.color5Text, this.color5Icon);
        this.color5Goal = -100
        this.winComplete++;
        this.color5Win = false;
      }
    }
    if (this.squareWin) {
      this.squareText.setText(this.squareGoal - this.Main.board.tally[6]);
      if (this.Main.board.tally[6] >= this.squareGoal) {
        this.tweenCount(this.squareText, this.squareIcon);
        this.squareGoal = -100
        this.winComplete++;
        this.squareWin = false;
      }
    }
    if (this.dropWin) {
      this.dropText.setText(this.dropGoal - this.Main.board.tally[7]);
      if (this.Main.board.tally[7] >= this.dropGoal) {
        this.tweenCount(this.dropText, this.dropIcon);
        this.dropGoal = -100
        this.winComplete++;
        this.dropWin = false;
      }
    }
    if (this.bombWin) {
      this.bombText.setText(this.bombGoal - this.Main.board.tally[8]);
      if (this.Main.board.tally[8] >= this.bombGoal) {
        this.tweenCount(this.bombText, this.bombIcon);
        this.bombGoal = -100
        this.winComplete++;
        this.bombWin = false;
      }
    }
    if (this.iceWin) {
      this.iceText.setText(this.iceGoal - this.Main.board.tally[9]);
      if (this.Main.board.tally[9] >= this.iceGoal) {
        this.tweenCount(this.iceText, this.iceIcon);
        this.iceGoal = -100
        this.winComplete++;
        this.iceWin = false;
      }
    }
    if (this.roverWin) {
      this.roverText.setText(this.roverGoal - this.Main.board.tally[11]);
      if (this.Main.board.tally[11] >= this.roverGoal) {
        this.tweenCount(this.roverText, this.roverIcon);
        this.roverGoal = -100
        this.winComplete++;
        this.roverWin = false;
      }
    }
    if (this.wildWin) {
      this.wildText.setText(this.wildGoal - this.Main.board.tally[12]);
      if (this.Main.board.tally[12] >= this.wildGoal) {
        this.tweenCount(this.wildText, this.wildIcon);
        this.wildGoal = -100
        this.winComplete++;
        this.wildWin = false;
      }
    }
    if (this.winCount == this.winComplete) {
      // return true;
      //console.log('you win');
      //this.scene.start("start");
      //this.scene.stop('PlayGame');
      var time = this.time.addEvent({
        delay: 1500,
        callback: function () {
          // alert('You won!')
          this.scene.pause('playGame');
          this.scene.launch('endGameChal', { result: 'Win' })
          // this.scene.launch("endGame", { outcome: 1, movesLeft: levelSettings.movesGoal - this.movesLeft, level: onLevel });
          this.scene.pause('UI');
          /* if (appSettings.music) {
            this.main.backgroundMusic.pause()
          } */
        },
        callbackScope: this
      })

    } else {
      // return false;
    }
  }


  toggleMenu() {

    if (this.menuGroup.y == 0) {
      this.scene.pause('playGame')
      this.onDotText.disableInteractive()
      this.oneColorTextd.disableInteractive()
      this.shuffleText.disableInteractive()
      // console.log('Open menu')
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: -270,
        duration: 500,
        ease: 'Bounce'
      })
      var menuTween = this.tweens.add({
        targets: this.tallyContainer,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })

    }
    if (this.menuGroup.y == -270) {
      this.onDotText.setInteractive()
      this.oneColorTextd.setInteractive()
      this.shuffleText.setInteractive()
      this.scene.resume('playGame')
      // console.log('close menu')dd
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })
      var menuTween = this.tweens.add({
        targets: this.tallyContainer,
        y: -1640,
        duration: 500,
        ease: 'Bounce'
      })
    }
  }
  makeMenu() {
    ////////menu
    this.menuGroup = this.add.container().setDepth(5);
    var menuBG = this.add.image(game.config.width / 2, game.config.height - 85, 'blank').setOrigin(.5, 0).setTint(0x333333).setAlpha(.8)
    menuBG.displayWidth = 300;
    menuBG.displayHeight = 600
    this.menuGroup.add(menuBG)
    var menuButton = this.add.image(game.config.width / 2, game.config.height - 40, "menu").setInteractive().setDepth(3);
    menuButton.on('pointerdown', this.toggleMenu, this)
    menuButton.setOrigin(0.5);
    this.menuGroup.add(menuButton);
    var homeButton = this.add.bitmapText(game.config.width / 2, game.config.height + 50, 'topaz', 'HOME', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    homeButton.on('pointerdown', function () {
      this.scene.stop()
      this.scene.stop('playGame')
      this.scene.start('startGame')

    }, this)
    this.menuGroup.add(homeButton);
    /* var wordButton = this.add.bitmapText(game.config.width / 2, game.config.height + 140, 'topaz', 'WORDS', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    wordButton.on('pointerdown', function () {
      var data = {
        yesWords: this.foundWords,
        noWords: this.notWords
      }
      this.scene.pause()
      //this.scene.launch('wordsPlayed', data)
    }, this)
    this.menuGroup.add(wordButton);
    var helpButton = this.add.bitmapText(game.config.width / 2, game.config.height + 230, 'topaz', 'RESTART', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    helpButton.on('pointerdown', function () {
      this.scene.stop('Playgame')
      this.scene.stop()

      this.scene.launch('UI')
      this.scene.start('playGame')

    }, this)
    this.menuGroup.add(helpButton); */
    //var thankYou = game.add.button(game.config.width / 2, game.config.height + 130, "thankyou", function(){});
    // thankYou.setOrigin(0.5);
    // menuGroup.add(thankYou);    
    ////////end menu
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
      frequency: 40,
      // particle lifespan: 1 second
      lifespan: 1000
    });
    //emitter.tint.onChange(0x7d1414);
    emitter.explode(40, objX, objY);

  }

}