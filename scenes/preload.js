class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }




    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/topaz.png', 'assets/fonts/topaz.xml');
    this.load.spritesheet("menu_icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });
    this.load.spritesheet("rover1", "assets/sprites/rover.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("burst", "assets/sprites/burst.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("bomb", "assets/sprites/bomb.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("rover", "assets/sprites/hexagon.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("ice", "assets/sprites/ice.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("mode_buttons", "assets/sprites/mode_button.png", {
      frameWidth: 300,
      frameHeight: 128
    });
    this.load.spritesheet("levelthumb", "assets/sprites/select_icons.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("switch", "assets/sprites/switch.png", {
      frameWidth: 150,
      frameHeight: 75
    });
    this.load.image("levelpages", "assets/sprites/levelpages.png");
    this.load.image("transp", "assets/sprites/transp.png");
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('check', 'assets/sprites/checkmark.png');
    this.load.image('wild', 'assets/sprites/circle_outline.png');
    this.load.image('dot2', 'assets/sprites/dot2.png');
    this.load.image('arrow', 'assets/sprites/arrow.png');
    this.load.image('playagain', 'assets/sprites/button_.png');
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('menu', 'assets/sprites/menu.png');
    this.load.image('star', 'assets/sprites/star.png');
    this.load.image('square', 'assets/sprites/squareicon.png');
    this.load.image('gem', 'assets/sprites/gem.png');
  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








