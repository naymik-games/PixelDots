class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {

    gameSettings = JSON.parse(localStorage.getItem('SD4save'));
    if (gameSettings === null || gameSettings.length <= 0) {
      localStorage.setItem('SD4save', JSON.stringify(defaultValues));
      gameSettings = defaultValues;
    }

    this.cameras.main.setBackgroundColor(0x191919);

    var title = this.add.text(game.config.width / 2, 100, 'PixelDots', { fontFamily: 'PixelFontWide', fontSize: '150px', color: '#F0B060', align: 'left' }).setOrigin(.5).setInteractive()

    /* var startTime = this.add.bitmapText(game.config.width / 2, 275, 'topaz', 'Play Time', 50).setOrigin(.5).setTint(0xfafafa);
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler, this); */


    var movesButton = this.add.image(450, 400, 'mode_buttons', 0).setInteractive()
    movesButton.on('pointerdown', this.movesHandler, this);
    var timeButton = this.add.image(450, 550, 'mode_buttons', 1).setInteractive()
    timeButton.on('pointerdown', this.timeHandler, this);
    var zenButton = this.add.image(450, 700, 'mode_buttons', 2).setInteractive()
    zenButton.on('pointerdown', this.zenHandler, this);
    var puzzleButton = this.add.image(450, 850, 'mode_buttons', 3).setInteractive()
    puzzleButton.on('pointerdown', this.puzzleHandler, this);




    var removeData = this.add.bitmapText(game.config.width / 2, 1575, 'topaz', 'Reset Data', 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
    removeData.on('pointerdown', function () {
      removeData.setText('Data Reset')
      localStorage.removeItem('SD4save');
      localStorage.setItem('SD4save', JSON.stringify(defaultValues));
      gameSettings = defaultValues;
    }, this);


  }
  movesHandler() {
    levelConfig = {
      w: 6,
      h: 6,
      mL: 30,
      c: 5,
      aD: false,
      dS: 5,
      dG: 5,
      aB: false,
      bS: 5,
      bG: 5,
      aI: false,
      iS: 5,
      iG: 5,
      square: true
    }
    gameMode = 0
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
  timeHandler() {
    levelConfig = {
      w: 6,
      h: 6,
      mL: 10,
      c: 5,
      aD: false,
      dS: 5,
      dG: 5,
      aB: false,
      bS: 5,
      bG: 5,
      aI: false,
      iS: 5,
      iG: 5,
      aBl: false,
      blS: 5,
      aR: false,
      rS: 0,
      square: true
    }
    gameMode = 1
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
  zenHandler() {
    levelConfig = {
      w: 8,
      h: 10,
      mL: 100,
      c: 6,
      aD: false,
      dS: 5,
      dG: 5,
      aB: false,
      bS: 5,
      bG: 5,
      aI: false,
      iS: 5,
      iG: 5,
      aBl: false,
      blS: 5,
      aR: false,
      rS: 0,
      square: true
    }
    gameMode = 2
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
  puzzleHandler() {
    levelConfig = levels[gameSettings.unlocked]
    gameMode = 3
    gameSettings.currentLevel = gameSettings.unlocked
    this.scene.start('selectGame');
    //this.scene.launch('UI');
  }

}


