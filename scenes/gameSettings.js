class options extends Phaser.Scene {
  constructor() {
    super("options");
  }
  preload() {



  }

  create() {
    this.itemsArray = [0, 1, 3, 4]
    var timedEvent = this.time.addEvent({ delay: 1000, callback: this.showPreview, callbackScope: this, loop: false });
    this.end = this.add.container(900, 0)
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0xfafafa, 1)
    this.graphics.fillRect(0, 300, 900, 1000);
    this.end.add(this.graphics)


    this.itemSelect()

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
      duration: 500,
      x: 0,
      ease: 'Quad '
    })
  }
  itemSelect() {

    var colorText = this.add.bitmapText(75, 395, 'topaz', 'COLORS', 50).setOrigin(0, 1).setTint(0x000000);
    this.end.add(colorText)
    var less = this.add.bitmapText(90, 455, 'topaz', '<  ', 80).setOrigin(.5).setTint(0x000000).setInteractive();
    this.end.add(less)
    var more = this.add.bitmapText(160, 455, 'topaz', '  >', 80).setOrigin(.5).setTint(0x000000).setInteractive();
    this.end.add(more)
    var itemSelectText = this.add.bitmapText(125, 455, 'topaz', gameSettings.colorSet, 80).setOrigin(.5).setTint(0x000000);
    this.end.add(itemSelectText)
    itemSelectText.value = this.itemsArray.indexOf(gameSettings.colorSet)
    less.on('pointerdown', function () {
      gameSettings.colorSet--
      if (gameSettings.colorSet < this.itemsArray[0]) {
        gameSettings.colorSet = this.itemsArray[this.itemsArray.length - 1]
      }
      itemSelectText.setText(gameSettings.colorSet)
      localStorage.setItem('SD4save', JSON.stringify(gameSettings));
    }, this)
    more.on('pointerdown', function () {
      gameSettings.colorSet++
      if (gameSettings.colorSet > this.itemsArray[this.itemsArray.length - 1]) {
        gameSettings.colorSet = this.itemsArray[0]
      }
      itemSelectText.setText(gameSettings.colorSet)
      localStorage.setItem('SD4save', JSON.stringify(gameSettings));
    }, this)
  }
}