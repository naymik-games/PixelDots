class endGame extends Phaser.Scene {
	constructor() {
		super("endGame");
	}
	preload() {



	}
	init(data) {
		this.totalBlocksRemoved = data.totalRemoved;
		this.outcome = data.outcome;
		this.movesLeft = data.movesLeft;
		this.level = data.level;
	}
	create() {
		//	this.cameras.main.setBackgroundColor(0xf7eac6);
		var timedEvent = this.time.addEvent({ delay: 1000, callback: this.showPreview, callbackScope: this, loop: false });

		this.Main = this.scene.get('playGame');

		this.end = this.add.container(900, 0)
		this.graphics = this.add.graphics();
		this.graphics.fillStyle(0xfafafa, 1)
		this.graphics.fillRect(0, 0, 900, 1500);
		this.end.add(this.graphics)

		var total = 0
		for (var i = 0; i < dotColors.length; i++) {
			//this.tallyArray[i].setText(this.Main.board.colorTally[i])
			total += this.Main.board.colorTally[i]
		}
		/* 		var defaultValues = {
					mostDotsMoves: 0,
					mostDotsTime: 0,
					levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					totalSquares: 0,
					totalDots: 0,
					group: 0,
					currentLevel: 0,
					colorSet: 0
				} */
		var titleText = this.add.text(450, 75, gameModeNames[gameMode], { fontFamily: 'PixelFont', fontSize: '175px', color: '#000000', align: 'left' }).setOrigin(.5).setInteractive()
		this.end.add(titleText)

		gameSettings.totalDots += total
		gameSettings.totalSquares += this.Main.board.squareTally

		var scorelabel = this.add.text(225, 425, 'Score', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(scorelabel)
		var scoreleText = this.add.text(225, 500, total, { fontFamily: 'PixelFontWide', fontSize: '250px', color: '#000000', align: 'left' }).setOrigin(.5).setInteractive()
		this.end.add(scoreleText)



		var newlabel = this.add.text(675, 350, 'NEW!', { fontFamily: 'PixelFontWide', fontSize: '100px', color: '#9A4009', align: 'left' }).setOrigin(.5).setAlpha(0)
		this.end.add(newlabel)




		if (total > gameSettings.mostDots[gameMode]) {
			newlabel.setAlpha(1)
			gameSettings.mostDots[gameMode] = total

		}


		var bestlabel = this.add.text(675, 425, 'Best Score', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(bestlabel)

		var bestText = this.add.text(675, 500, gameSettings.mostDots[gameMode], { fontFamily: 'PixelFontWide', fontSize: '250px', color: '#9A4009', align: 'left' }).setOrigin(.5).setInteractive()
		this.end.add(bestText)


		var totalDotlabel = this.add.text(225, 725, 'Total Dots', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalDotlabel)
		var totalDotText = this.add.text(225, 800, gameSettings.totalDots, { fontFamily: 'PixelFont', fontSize: '100px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalDotText)

		var totalSquarelabel = this.add.text(675, 725, 'Total Squares', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalSquarelabel)
		var totalSquareText = this.add.text(675, 800, gameSettings.totalSquares, { fontFamily: 'PixelFont', fontSize: '100px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalSquareText)

		var playAgain = this.add.image(450, 1400, 'playagain').setInteractive()
		playAgain.on('pointerdown', this.play, this)
		this.end.add(playAgain)

		localStorage.setItem('SD4save', JSON.stringify(gameSettings));
	}

	showPreview() {

		var tween = this.tweens.add({

			targets: this.end,
			duration: 500,
			x: 0,
			ease: 'Quad '
		})
	}

	play() {
		this.scene.stop('playGame');
		this.scene.stop('endGame');
		this.scene.stop('UI');
		this.scene.start('startGame')
		/* if (gameMode == 'challenge') {
			this.scene.start('selectGame')
		} else {
			this.scene.start('startGame')
		} */
	}
	cancel() {
		this.scene.stop();
		this.scene.restart('playGame');
		this.scene.restart('UI');
	}
	endResults() {
		let posX = (gameOptions.offsetX + gameOptions.gemSize * levelOptions.cols + gameOptions.gemSize / 2) / 2;
		let posY = gameOptions.offsetY + gameOptions.gemSize * levelOptions.rows + gameOptions.gemSize / 2;
		let fieldHeight = gameOptions.offsetY + gameOptions.gemSize * levelOptions.rows + gameOptions.gemSize;
		if (gameOptions.gameMode == 'challenge') {
			if (this.outcome == 1) {
				var message = 'Success!'
				gameSettings.levelStatus[onLevel + 1] = 0;
				if (this.movesLeft < 2) {
					gameSettings.levelStatus[onLevel] = '*';
				} else if (this.movesLeft < 5) {
					gameSettings.levelStatus[onLevel] = '**';
				} else {
					gameSettings.levelStatus[onLevel] = '***';
				}

				gameSettings.currentLevel = onLevel + 1
				var score = '***';
				var high = '';
			} else {
				var message = 'Failure!'
				var score = '';
				var high = '';
			}
		} else {
			var message = 'Complete'
			var score = this.totalBlocksRemoved;
			if (this.totalBlocksRemoved > gameSettings.mostDotsMoves) {
				gameSettings.mostDotsMoves = this.totalBlocksRemoved;
				var high = this.totalBlocksRemoved;
			} else {
				var high = gameSettings.mostDotsMoves;
			}
		}
		let messageText = this.add.bitmapText(posX, gameOptions.offsetY + 50, 'atari', message, 60).setOrigin(.5).setTint(0xffffff);
		let resultText = this.add.bitmapText(posX, gameOptions.offsetY + 150, 'atari', score, 60).setOrigin(.5).setTint(0xffffff);
		let highText = this.add.bitmapText(posX, gameOptions.offsetY + 250, 'atari', high, 60).setOrigin(.5).setTint(0xffffff);
		let back = this.add.bitmapText(posX, fieldHeight - 150, 'atari', 'BACK', 60).setOrigin(.5).setTint(0xffffff).setInteractive();
		back.on('pointerdown', function () {
			this.scene.stop('playGame');
			this.scene.stop('UI');
			this.scene.start("startGame");
		}, this);
		localStorage.setItem('SDsave', JSON.stringify(gameSettings));
	}


}

