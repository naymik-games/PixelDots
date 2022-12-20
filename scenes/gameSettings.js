class options extends Phaser.Scene {
  constructor() {
    super("options");
  }
  preload() {



  }

  create() {
    this.itemsArray = [0, 1, 3, 4]
    var timedEvent = this.time.addEvent({ delay: 150, callback: this.showPreview, callbackScope: this, loop: false });
    this.end = this.add.container(900, 0)
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0xfafafa, 1)
    this.graphics.fillRect(0, 300, 900, 1000);
    this.end.add(this.graphics)
    var titleText = this.add.text(450, 340, 'GAME OPTIONS', { fontFamily: 'PixelFont', fontSize: '125px', color: '#000000', align: 'left' }).setOrigin(.5)
    this.end.add(titleText)
    this.dots = []

    this.itemSelect()


    var removeData = this.add.bitmapText(game.config.width / 2, 1050, 'topaz', 'Reset Data', 50).setOrigin(.5).setTint(0x000000).setInteractive();
    this.end.add(removeData)
    removeData.on('pointerdown', function () {
      removeData.setText('Data Reset')
      localStorage.removeItem('SD4save');
      localStorage.removeItem('PDlb1');
      localStorage.setItem('SD4save', JSON.stringify(defaultValues));
      gameSettings = defaultValues;
    }, this);



    var backIcon = this.add.image(game.config.width / 2, 1200, 'game_icons', 3).setInteractive()
    this.end.add(backIcon)
    backIcon.on('pointerdown', function () {
      this.scene.stop()
      this.scene.resume('startGame')
    }, this)
  }
  showPreview() {

    var tween = this.tweens.add({

      targets: this.end,
      duration: 400,
      x: 0,
      ease: 'Quad '
    })
  }
  itemSelect() {
    let dotAllColors = colorGroups[gameSettings.colorSet]
    var colorText = this.add.bitmapText(125, 465, 'topaz', 'COLORS', 50).setOrigin(.5, 1).setTint(0x000000);
    this.end.add(colorText)
    var less = this.add.bitmapText(90, 525, 'topaz', '<  ', 80).setOrigin(.5).setTint(0x000000).setInteractive();
    this.end.add(less)
    var more = this.add.bitmapText(160, 525, 'topaz', '  >', 80).setOrigin(.5).setTint(0x000000).setInteractive();
    this.end.add(more)
    var itemSelectText = this.add.bitmapText(125, 525, 'topaz', gameSettings.colorSet, 80).setOrigin(.5).setTint(0x000000);
    this.end.add(itemSelectText)
    itemSelectText.value = this.itemsArray.indexOf(gameSettings.colorSet)


    for (var i = 0; i < 6; i++) {
      var dot = this.add.image(250 + i * 96 + 48, 535, 'dot2').setTint(dotAllColors[i]).setScale(.70)
      this.dots.push(dot)
      this.end.add(dot)
    }



    less.on('pointerdown', function () {
      gameSettings.colorSet--
      if (gameSettings.colorSet < this.itemsArray[0]) {
        gameSettings.colorSet = this.itemsArray[this.itemsArray.length - 1]
      }
      itemSelectText.setText(gameSettings.colorSet)
      localStorage.setItem('SD4save', JSON.stringify(gameSettings));
      dotAllColors = colorGroups[gameSettings.colorSet]
      for (var i = 0; i < this.dots.length; i++) {
        this.dots[i].setTint(dotAllColors[i])
      }
    }, this)
    more.on('pointerdown', function () {
      gameSettings.colorSet++
      if (gameSettings.colorSet > this.itemsArray[this.itemsArray.length - 1]) {
        gameSettings.colorSet = this.itemsArray[0]
      }
      itemSelectText.setText(gameSettings.colorSet)
      localStorage.setItem('SD4save', JSON.stringify(gameSettings));
      dotAllColors = colorGroups[gameSettings.colorSet]
      for (var i = 0; i < this.dots.length; i++) {
        this.dots[i].setTint(dotAllColors[i])
      }
    }, this)
  }
}