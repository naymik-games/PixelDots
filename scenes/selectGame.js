menuOptions = {
  colors: [0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86],
  pages: 5,
  columns: 3,
  rows: 4,
  thumbWidth: 200,
  thumbHeight: 200,
  spacing: 30,
  localStorageName: "levelselect"
}
class selectGame extends Phaser.Scene {
  constructor() {
    super("selectGame");
  }
  preload() {

  }
  create() {
    this.cameras.main.setBackgroundColor(0x191919);
    menuOptions.pages = 2

    /* var back = this.add.image(0, 0, 'select_back').setOrigin(0)
    back.displayWidth = 900
    back.displayHeight = 1640 */
    this.stars = [];
    this.stars[0] = 0;
    this.canMove = true;
    this.itemGroup = this.add.group();
    for (var l = 1; l < menuOptions.columns * menuOptions.rows * menuOptions.pages; l++) {
      this.stars[l] = -1;
    }
    //this.savedData = localStorage.getItem(menuOptions.localStorageName) == null ? this.stars.toString() : localStorage.getItem(menuOptions.localStorageName);
    //this.stars = this.savedData.split(",");
    this.currentPage = 0;
    var titleText = this.add.text(450, 75, 'SELECT LEVEL', { fontFamily: 'PixelFont', fontSize: '125px', color: '#FAFAFA', align: 'left' }).setOrigin(.5)

    this.pageText = this.add.bitmapText(game.config.width / 2, 75, 'topaz', " (1 / " + menuOptions.pages + ")", 80).setOrigin(.5).setTint(0xffffff).setAlpha(0);


    this.pageText.setOrigin(0.5);
    this.scrollingMap = this.add.tileSprite(0, 0, menuOptions.pages * game.config.width, game.config.height, "transp");
    this.scrollingMap.setInteractive();
    this.input.setDraggable(this.scrollingMap);
    this.scrollingMap.setOrigin(0, 0);

    this.pageSelectors = [];
    var rowLength = menuOptions.thumbWidth * menuOptions.columns + menuOptions.spacing * (menuOptions.columns - 1);
    var leftMargin = (game.config.width - rowLength) / 2 + menuOptions.thumbWidth / 2;
    var colHeight = menuOptions.thumbHeight * menuOptions.rows + menuOptions.spacing * (menuOptions.rows - 1);
    var topMargin = 600;
    for (var k = 0; k < menuOptions.pages; k++) {
      for (var i = 0; i < menuOptions.columns; i++) {
        for (var j = 0; j < menuOptions.rows; j++) {
          var thumb = this.add.image(k * game.config.width + leftMargin + i * (menuOptions.thumbWidth + menuOptions.spacing), topMargin + j * (menuOptions.thumbHeight + menuOptions.spacing), "levelthumb");
          thumb.displayWidth = menuOptions.thumbWidth;
          thumb.displayHeight = menuOptions.thumbHeight
          //thumb.setTint(menuOptions.colors[k]);
          thumb.levelNumber = k * (menuOptions.rows * menuOptions.columns) + j * menuOptions.columns + i;
          //console.log(gameData.levelStatus[thumb.levelNumber - 1])
          if (thumb.levelNumber <= gameSettings.completed) {
            var frame = 1
          } else if (thumb.levelNumber == gameSettings.unlocked) {
            var frame = 0
          } else {
            var frame = -1
          }
          thumb.setFrame(this.getFrame(frame));
          this.itemGroup.add(thumb);

          // var levelText = this.add.bitmapText(thumb.x, thumb.y - 45, 'topaz', thumb.levelNumber + 1, 75).setOrigin(.5).setTint(0x000000).setAlpha(1);
          var levelText = this.add.text(thumb.x, thumb.y - 50, thumb.levelNumber + 1, { fontFamily: 'PixelFontWide', fontSize: '125px', color: '#191919', align: 'left' }).setOrigin(.5)


          this.itemGroup.add(levelText);
        }
      }
      this.pageSelectors[k] = this.add.sprite(game.config.width / 2 + (k - Math.floor(menuOptions.pages / 2) + 0.5 * (1 - menuOptions.pages % 2)) * 80, game.config.height - 190, "levelpages").setScale(2);
      this.pageSelectors[k].setInteractive();
      this.pageSelectors[k].on("pointerdown", function () {
        if (this.scene.canMove) {
          var difference = this.pageIndex - this.scene.currentPage;
          this.scene.changePage(difference);
          this.scene.canMove = false;
        }
      });
      this.pageSelectors[k].pageIndex = k;
      this.pageSelectors[k].tint = menuOptions.colors[k];
      if (k == this.currentPage) {
        // this.pageSelectors[k].scaleY = 1;
      }
      else {
        // this.pageSelectors[k].scaleY = 0.5;
      }
    }
    this.input.on("dragstart", function (pointer, gameObject) {
      gameObject.startPosition = gameObject.x;
      gameObject.currentPosition = gameObject.x;
    });
    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      if (dragX <= 10 && dragX >= -gameObject.width + game.config.width - 10) {
        gameObject.x = dragX;
        var delta = gameObject.x - gameObject.currentPosition;
        gameObject.currentPosition = dragX;
        this.itemGroup.children.iterate(function (item) {
          item.x += delta;
        });
      }
    }, this);
    this.input.on("dragend", function (pointer, gameObject) {
      this.canMove = false;
      var delta = gameObject.startPosition - gameObject.x;
      if (delta == 0) {
        this.canMove = true;
        this.itemGroup.children.iterate(function (item) {
          if (item.texture.key == "levelthumb") {
            var boundingBox = item.getBounds();
            if (Phaser.Geom.Rectangle.Contains(boundingBox, pointer.x, pointer.y) && item.frame.name > 0) {
              //onLevel = item.levelNumber
              //levelSettings = levels[onLevel]
              levelConfig = levels[item.levelNumber]
              gameMode = 3
              gameSettings.currentLevel = item.levelNumber
              this.setupGoals(item.levelNumber)
              //this.scene.stop()
              //  this.scene.launch('playGame');

              //this.scene.launch('UI')
            }
          }
        }, this);
      }
      if (delta > game.config.width / 8) {
        this.changePage(1);
      }
      else {
        if (delta < -game.config.width / 8) {
          this.changePage(-1);
        }
        else {
          this.changePage(0);
        }
      }
    }, this);
    this.changePage(0)
    var backIcon = this.add.image(game.config.width / 2, 1550, 'menu_icons', 5).setInteractive()
    backIcon.on('pointerdown', function () {
      this.scene.stop()
      this.scene.start('startGame')
    }, this)
  }
  changePage(page) {
    this.currentPage += page;
    for (var k = 0; k < menuOptions.pages; k++) {
      if (k == this.currentPage) {
        // this.pageSelectors[k].scaleY = 1;
      }
      else {
        // this.pageSelectors[k].scaleY = 0.5;
      }
    }
    this.pageText.text = " (" + (this.currentPage + 1).toString() + " / " + menuOptions.pages + ")";
    var currentPosition = this.scrollingMap.x;
    this.tweens.add({
      targets: this.scrollingMap,
      x: this.currentPage * -game.config.width,
      duration: 300,
      ease: "Cubic.easeOut",
      callbackScope: this,
      onUpdate: function (tween, target) {
        var delta = target.x - currentPosition;
        currentPosition = target.x;
        this.itemGroup.children.iterate(function (item) {
          item.x += delta;
        });
      },
      onComplete: function () {
        this.canMove = true;
      }
    });
  }
  getFrame(val) {
    var frame
    if (val == -1) {
      frame = 0
    } else if (val == 0) {
      frame = 1
    } else if (val == 1) {
      frame = 2
    } else if (val == 2) {
      frame = 3
    } else if (val == 3) {
      frame = 4
    }
    return frame
  }
  setupGoals(level) {
    if (this.preview) {
      this.preview.destroy()
    }
    var back = this.add.image(450, 260, 'blank').setTint(0xfafafa)
    back.displayWidth = 700
    back.displayHeight = 200
    var i = 0;
    var j = 0;
    var x = 0;
    var y = 225;
    var y2 = 300
    var xOffsetT = 250
    var xOffsetI = 310
    var xSpace = 175
    var labelSize = 55
    var labelColor = 0x383838
    var iconScale = .5
    var winC = levels[level].win

    this.preview = this.add.container()
    Object.entries(winC).forEach(([key, value]) => {


      if (i > 2) {
        y = y2;
        x = i - 3;
      } else {
        x = i;
      }
      if (key == 'color0') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[0]);
      } else if (key == 'color1') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[1]);
      } else if (key == 'color2') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[2]);
      } else if (key == 'color3') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[3]);
      } else if (key == 'color4') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[4]);
      } else if (key == 'color5') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[5]);
      } else if (key == 'drop') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'arrow', 0).setScale(iconScale).setAlpha(1).setTint(0xF1C40F);
      } else if (key == 'ice') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'ice', 3).setScale(iconScale).setAlpha(1);
      } else if (key == 'bomb') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'bomb', 3).setScale(iconScale).setTint(0xb8b8b8).setAlpha(1).setTint(0xF1C40F);
      } else if (key == 'square') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'square', 0).setScale(iconScale).setAlpha(1).setTint(0xD4D4D4);
      } else if (key == 'rover') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'rover', 3).setScale(iconScale).setAlpha(1).setTint(0xD4D4D4);
      } else if (key == 'wild') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'wild').setScale(iconScale).setAlpha(1).setTint(0xD4D4D4);
      } else if (key == 'slime') {
        var icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(0xD4D4D4);
        value = levels[level].w * levels[level].h
      }

      var text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', value, labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

      this.preview.add(icon)
      this.preview.add(text)

      i++;
      j++;


    });


    var play = this.add.bitmapText(450, 420, 'topaz', 'PLAY LEVEL ' + (level + 1), 60).setOrigin(.5).setTint(0xF0B060).setAlpha(1).setInteractive();
    this.preview.add(play)
    play.on('pointerdown', function () {
      this.scene.stop()
      this.scene.launch('playGame');

      this.scene.launch('UI')
      lbFlag = false
    }, this)



  }

}