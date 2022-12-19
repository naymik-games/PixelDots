class levelBuilder extends Phaser.Scene {
  constructor() {
    super("levelBuilder");
  }
  preload() {


  }
  create() {
    lbData = JSON.parse(localStorage.getItem('PDlb1'));
    if (lbData === null || lbData.length <= 0) {
      localStorage.setItem('PDlb1', JSON.stringify(defaultGame));
      lbData = defaultGame;
    }

    defaultGame = null;
    defaultGame = lbData


    var titleText = this.add.text(450, 75, 'CUSTOM LEVEL', { fontFamily: 'PixelFont', fontSize: '125px', color: '#FAFAFA', align: 'left' }).setOrigin(.5)

    this.itemsArray = [3, 4, 5, 6]
    this.colsArray = [4, 5, 6, 7, 8]
    this.rowsArray = [4, 5, 6, 7, 8, 9, 10, 11, 12]
    this.movesArray = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100]
    this.roverOn = defaultGame.aR
    //  this.gemOn = defaultGame.allowGem
    this.bombOn = defaultGame.aB
    //  this.fireOn = defaultGame.allowFire
    this.dropOn = defaultGame.aD
    this.iceOn = defaultGame.aI
    this.wildOn = defaultGame.aW
    this.slimeOn = defaultGame.aSl
    this.gemOn = defaultGame.aG


    var colorText = this.add.bitmapText(75, 395, 'topaz', 'COLORS', 50).setOrigin(0, 1).setTint(0xffffff);
    this.itemSelect()

    var colsText = this.add.bitmapText(400, 395, 'topaz', 'COLS', 50).setOrigin(0, 1).setTint(0xffffff);
    this.colSelect()

    var rowsText = this.add.bitmapText(700, 395, 'topaz', 'ROWS', 50).setOrigin(0, 1).setTint(0xffffff);
    this.rowsSelect()

    var colorText = this.add.bitmapText(450, 1400, 'topaz', 'PLAY', 80).setOrigin(.5).setTint(0xF0B060).setInteractive();
    colorText.on('pointerdown', this.clickHandler, this)
    var toggleC1 = 200
    var toggleC2 = 700
    var toggleR1 = 600
    var toggleR2 = 700
    var toggleR3 = 800
    var toggleR4 = 900

    //allow rovers
    var rover = this.add.bitmapText(toggleC1 - 25, toggleR3, 'topaz', 'ROVER', 50).setOrigin(1, .5).setTint(0xffffff);
    this.roverSwitch = this.add.image(toggleC1 + 25, toggleR3, 'switch', (this.roverOn) ? 1 : 0).setOrigin(0, .5).setInteractive().setScale(.9)
    this.roverSwitch.on('pointerdown', this.roverToggle, this)

    //allow bomb
    var bombs = this.add.bitmapText(toggleC1 - 25, toggleR2, 'topaz', 'BOMBS', 50).setOrigin(1, .5).setTint(0xffffff);
    this.bombSwitch = this.add.image(toggleC1 + 25, toggleR2, 'switch', (this.bombOn) ? 1 : 0).setOrigin(0, .5).setInteractive().setScale(.9)
    this.bombSwitch.on('pointerdown', this.bombToggle, this)

    //allow drop
    var drop = this.add.bitmapText(toggleC1 - 25, toggleR1, 'topaz', 'DROPS', 50).setOrigin(1, .5).setTint(0xffffff);
    this.dropSwitch = this.add.image(toggleC1 + 25, toggleR1, 'switch', (this.dropOn) ? 1 : 0).setOrigin(0, .5).setInteractive().setScale(.9)
    this.dropSwitch.on('pointerdown', this.dropToggle, this)

    //allow ice
    var ice = this.add.bitmapText(toggleC2 - 25, toggleR1, 'topaz', 'ICE', 50).setOrigin(1, .5).setTint(0xffffff);
    this.iceSwitch = this.add.image(toggleC2 + 25, toggleR1, 'switch', (this.iceOn) ? 1 : 0).setOrigin(0, .5).setInteractive().setScale(.9)
    this.iceSwitch.on('pointerdown', this.iceToggle, this)

    //allow wild
    var wild = this.add.bitmapText(toggleC2 - 25, toggleR2, 'topaz', 'WILD', 50).setOrigin(1, .5).setTint(0xffffff);
    this.wildSwitch = this.add.image(toggleC2 + 25, toggleR2, 'switch', (this.wildOn) ? 1 : 0).setOrigin(0, .5).setInteractive().setScale(.9)
    this.wildSwitch.on('pointerdown', this.wildToggle, this)

    //allow slime
    var slime = this.add.bitmapText(toggleC2 - 25, toggleR3, 'topaz', 'SLIME', 50).setOrigin(1, .5).setTint(0xffffff);
    this.slimeSwitch = this.add.image(toggleC2 + 25, toggleR3, 'switch', (this.slimeOn) ? 1 : 0).setOrigin(0, .5).setInteractive().setScale(.9)
    this.slimeSwitch.on('pointerdown', this.slimeToggle, this)

    //allow gem
    var gem = this.add.bitmapText(toggleC1 - 25, toggleR4, 'topaz', 'GEM', 50).setOrigin(1, .5).setTint(0xffffff);
    this.gemSwitch = this.add.image(toggleC1 + 25, toggleR4, 'switch', (this.gemOn) ? 1 : 0).setOrigin(0, .5).setInteractive().setScale(.9)
    this.gemSwitch.on('pointerdown', this.gemToggle, this)

    this.movesSelect()
    var backIcon = this.add.image(game.config.width / 2, 1550, 'menu_icons', 5).setInteractive()
    backIcon.on('pointerdown', function () {
      this.scene.stop()
      this.scene.start('startGame')
    }, this)
  }
  clickHandler() {
    localStorage.setItem('PDlb1', JSON.stringify(defaultGame));
    gameMode = 'moves'
    lbFlag = true
    gameMode = 4
    levelConfig = defaultGame
    this.scene.stop()
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
  roverToggle() {
    if (this.roverOn) {
      this.roverOn = false
      defaultGame.aR = this.roverOn

      this.roverSwitch.setFrame(0)
    } else {
      this.roverOn = true
      defaultGame.aR = this.roverOn
      defaultGame.rS = Phaser.Math.Between(2, 5)
      this.roverSwitch.setFrame(1)
    }
  }
  bombToggle() {
    if (this.bombOn) {
      this.bombOn = false
      defaultGame.aB = this.bombOn

      this.bombSwitch.setFrame(0)
    } else {
      this.bombOn = true
      defaultGame.aB = this.bombOn
      defaultGame.bS = Phaser.Math.Between(2, 5)
      this.bombSwitch.setFrame(1)
    }
  }
  dropToggle() {
    if (this.dropOn) {
      this.dropOn = false
      defaultGame.aD = this.dropOn

      this.dropSwitch.setFrame(0)
    } else {
      this.dropOn = true
      defaultGame.aD = this.dropOn
      defaultGame.dS = Phaser.Math.Between(2, 5)
      this.dropSwitch.setFrame(1)
    }
  }
  iceToggle() {
    if (this.iceOn) {
      this.iceOn = false
      defaultGame.aI = this.iceOn

      this.iceSwitch.setFrame(0)
    } else {
      this.iceOn = true
      defaultGame.aI = this.iceOn
      defaultGame.iS = Phaser.Math.Between(5, 10)
      this.iceSwitch.setFrame(1)
    }
  }
  wildToggle() {
    if (this.wildOn) {
      this.wildOn = false
      defaultGame.aW = this.wildOn

      this.wildSwitch.setFrame(0)
    } else {
      this.wildOn = true
      defaultGame.aW = this.wildOn
      defaultGame.wS = Phaser.Math.Between(1, 5)
      this.wildSwitch.setFrame(1)
    }
  }
  slimeToggle() {
    if (this.slimeOn) {
      this.slimeOn = false
      defaultGame.aSl = this.slimeOn

      this.slimeSwitch.setFrame(0)
    } else {
      this.slimeOn = true
      defaultGame.aSl = this.slimeOn
      this.slimeSwitch.setFrame(1)
    }
  }
  gemToggle() {
    if (this.gemOn) {
      this.gemOn = false
      defaultGame.aG = this.gemOn

      this.gemSwitch.setFrame(0)
    } else {
      this.gemOn = true
      defaultGame.aG = this.gemOn
      this.gemSwitch.setFrame(1)
    }
  }
  itemSelect() {
    var less = this.add.bitmapText(90, 455, 'topaz', '<  ', 80).setOrigin(.5).setTint(0xcccccc).setInteractive();
    var more = this.add.bitmapText(160, 455, 'topaz', '  >', 80).setOrigin(.5).setTint(0xcccccc).setInteractive();
    var itemSelectText = this.add.bitmapText(125, 455, 'topaz', defaultGame.c, 80).setOrigin(.5).setTint(0xffffff);
    itemSelectText.value = this.itemsArray.indexOf(defaultGame.c)
    less.on('pointerdown', function () {
      defaultGame.c--
      if (defaultGame.c < this.itemsArray[0]) {
        defaultGame.c = this.itemsArray[this.itemsArray.length - 1]
      }
      itemSelectText.setText(defaultGame.c)
    }, this)
    more.on('pointerdown', function () {
      defaultGame.c++
      if (defaultGame.c > this.itemsArray[this.itemsArray.length - 1]) {
        defaultGame.c = this.itemsArray[0]
      }
      itemSelectText.setText(defaultGame.c)
    }, this)
  }
  colSelect() {
    var less = this.add.bitmapText(415, 455, 'topaz', '<  ', 80).setOrigin(.5).setTint(0xffffff).setInteractive();
    var more = this.add.bitmapText(485, 455, 'topaz', '  >', 80).setOrigin(.5).setTint(0xffffff).setInteractive();
    var colSelectText = this.add.bitmapText(450, 455, 'topaz', defaultGame.w, 80).setOrigin(.5).setTint(0xffffff);
    colSelectText.value = this.colsArray.indexOf(defaultGame.w)
    less.on('pointerdown', function () {
      defaultGame.w--
      if (defaultGame.w < this.colsArray[0]) {
        defaultGame.w = this.colsArray[this.colsArray.length - 1]
      }
      colSelectText.setText(defaultGame.w)
    }, this)
    more.on('pointerdown', function () {
      defaultGame.w++
      if (defaultGame.w > this.colsArray[this.colsArray.length - 1]) {
        defaultGame.w = this.colsArray[0]
      }
      colSelectText.setText(defaultGame.w)
    }, this)
  }
  rowsSelect() {
    var less = this.add.bitmapText(700, 455, 'topaz', '<  ', 80).setOrigin(.5).setTint(0xffffff).setInteractive();
    var more = this.add.bitmapText(800, 455, 'topaz', '  >', 80).setOrigin(.5).setTint(0xffffff).setInteractive();
    var rowSelectText = this.add.bitmapText(750, 455, 'topaz', defaultGame.h, 80).setOrigin(.5).setTint(0xffffff);
    rowSelectText.value = this.rowsArray.indexOf(defaultGame.h)
    less.on('pointerdown', function () {
      defaultGame.h--
      if (defaultGame.h < this.rowsArray[0]) {
        defaultGame.h = this.rowsArray[this.rowsArray.length - 1]
      }
      rowSelectText.setText(defaultGame.h)
    }, this)
    more.on('pointerdown', function () {
      defaultGame.h++
      if (defaultGame.h > this.rowsArray[this.rowsArray.length - 1]) {
        defaultGame.h = this.rowsArray[0]
      }
      rowSelectText.setText(defaultGame.h)
    }, this)
  }
  movesSelect() {
    var moveText = this.add.bitmapText(450, 1140, 'topaz', 'MOVES', 50).setOrigin(.5, 1).setTint(0xffffff);
    var movesIndex = this.movesArray.indexOf(defaultGame.mL)
    var less = this.add.bitmapText(game.config.width / 2 - 50, 1200, 'topaz', '<  ', 80).setOrigin(.5).setTint(0xffffff).setInteractive();
    var more = this.add.bitmapText(game.config.width / 2 + 50, 1200, 'topaz', '  >', 80).setOrigin(.5).setTint(0xffffff).setInteractive();
    var movesSelectText = this.add.bitmapText(game.config.width / 2, 1200, 'topaz', defaultGame.mL, 80).setOrigin(.5).setTint(0xffffff);

    less.on('pointerdown', function () {
      movesIndex--
      if (movesIndex < 0) {
        movesIndex = this.movesArray.length - 1
      }
      defaultGame.mL = this.movesArray[movesIndex]
      movesSelectText.setText(defaultGame.mL)
    }, this)
    more.on('pointerdown', function () {
      movesIndex++
      if (movesIndex == this.movesArray.length) {
        movesIndex = 0
      }
      defaultGame.mL = this.movesArray[movesIndex]
      movesSelectText.setText(defaultGame.mL)
    }, this)
  }
}
/* 
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
  square: true
} */