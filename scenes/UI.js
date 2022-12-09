class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {


  }
  create() {

    this.Main = this.scene.get('playGame');

    this.score = 0;

    this.modeText = this.add.text(450, 50, gameModeNames[gameMode], { fontFamily: 'PixelFont', fontSize: '100px', color: '#FaFaFa', align: 'left' }).setOrigin(.5)
    this.scoreText = this.add.text(125, 50, '0', { fontFamily: 'PixelFont', fontSize: '120px', color: '#F0B060', align: 'left' }).setOrigin(.5)
    if (gameMode == 0 || gameMode == 2 || gameMode == 3) {
      this.goalText = this.add.text(125, 125, '/' + this.Main.moveLimit, { fontFamily: 'PixelFont', fontSize: '70px', color: '#F0B060', align: 'left' }).setOrigin(.5)
    }

    this.squareText = this.add.text(850, 1600, '0', { fontFamily: 'PixelFont', fontSize: '100px', color: '#F0B060', align: 'left' }).setOrigin(1, .5)

    this.totalText = this.add.text(775, 50, '0', { fontFamily: 'PixelFont', fontSize: '120px', color: '#F0B060', align: 'left' }).setOrigin(.5)
    this.bestText = this.add.text(775, 125, gameSettings.mostDots[gameMode], { fontFamily: 'PixelFont', fontSize: '70px', color: '#FF0000', align: 'left' }).setOrigin(.5)

    if (gameMode == 1) {
      this.initialTime = 60;
      this.timeText = this.add.text(450, 115, this.formatTime(this.initialTime), { fontFamily: 'PixelFont', fontSize: '100px', color: '#F0B060', align: 'left' }).setOrigin(.5)

    }

    /////////////////////////////
    var oneDotText = this.add.text(50, 1450, '1 DOT', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    oneDotText.on('pointerdown', function () {
      if (this.Main.oneDot) {
        oneDotText.setColor('#ffffff')
        this.Main.oneDot = false
      } else {
        oneDotText.setColor('#ff0000')
        this.Main.oneDot = true
      }
    }, this)
    var oneColorText = this.add.text(350, 1450, '1 COLOR', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    oneColorText.on('pointerdown', function () {
      if (this.Main.oneColor) {
        oneColorText.setColor('#ffffff')
        this.Main.oneColor = false
      } else {
        oneColorText.setColor('#ff0000')
        this.Main.oneColor = true
      }
    }, this)
    var shuffleText = this.add.text(650, 1450, 'SHUFFLE', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    shuffleText.on('pointerdown', function () {
      this.Main.shuffleBoard()
    }, this)

    //////////////////////////////

    var dotSize = 125
    this.xOffset = (game.config.width - (dotColors.length * dotSize)) / 2
    this.tallyArray = []
    for (var i = 0; i < dotColors.length; i++) {
      var testDot = this.add.image(this.xOffset + dotSize * i + dotSize / 2, 1610, 'dot2').setTint(dotColors[i])
      testDot.displayWidth = this.Main.spriteSize * .50
      testDot.displayHeight = this.Main.spriteSize * .50
      var tallyText = this.add.text(this.xOffset + dotSize * i + dotSize / 2, 1600 - (this.Main.spriteSize * .50) / 1.5, '0', { fontFamily: 'PixelFont', fontSize: '90px', color: '#F0B060', align: 'left' }).setOrigin(.5, 1)
      this.tallyArray.push(tallyText)
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
      oneDotText.setColor('#ffffff')
    }, this);
    this.Main.events.on('oneColor', function () {
      this.Main.oneColor = false
      oneColorText.setColor('#ffffff')
    }, this);

    this.Main.events.on('score', function () {
      this.scoreText.setText(this.Main.board.moves)
      this.squareText.setText(this.Main.board.squareTally)
      var total = 0
      for (var i = 0; i < dotColors.length; i++) {
        this.tallyArray[i].setText(this.Main.board.colorTally[i])
        total += this.Main.board.colorTally[i]
      }
      this.totalText.setText(total)
      if (this.Main.board.moves == this.Main.moveLimit && gameMode != 1) {

        var txt = 'Game Over ' + total + ' Dots Collected'
        this.scene.pause()
        this.scene.pause('playGame')
        this.scene.launch('endGame')
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


}