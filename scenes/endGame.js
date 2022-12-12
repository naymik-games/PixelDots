class endGame extends Phaser.Scene {
	constructor() {
		super("endGame");
	}
	preload() {



	}
	init(data) {
		//this.totalBlocksRemoved = data.totalRemoved;
		this.outcome = data.result;
		//	this.movesLeft = data.movesLeft;
		//this.level = data.level;
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
			total += this.Main.board.tally[i]
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
		gameSettings.totalSquares += this.Main.board.tally[10]

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
		if (gameMode == 3) {
			this.setupGoals()
			console.log(this.outcome)
		}
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
	setupGoals() {
		// console.log(levels[onLevel].length);
		//  for (var i = 0; i < levels[onLevel].length; i++) {
		var i = 0;
		var j = 0;
		var x = 0;
		var y = 225;
		var y2 = 300
		this.winCount = 0;
		this.winComplete = 0;
		var xOffsetT = 250
		var xOffsetI = 310
		var xSpace = 175
		var labelSize = 55
		var labelColor = 0x000000
		var iconScale = .5
		var winC = levelConfig.win


		Object.entries(winC).forEach(([key, value]) => {



			if (key == 'color0') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.color0Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(dotColors[0]);
				this.color0Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
				this.color0Text.setText(value);
				this.end.add(this.color0Icon)
				this.end.add(this.color0Text)
				i++;
				j++;
			}

			if (key == 'color1') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.color1Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[1]);
				this.color1Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
				this.color1Text.setText(value);
				this.end.add(this.color1Icon)
				this.end.add(this.color1Text)
				i++;
				j++;
			}
			if (key == 'color2') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.color2Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[2]);
				this.color2Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.color2Text.setText(value);
				this.end.add(this.color2Icon)
				this.end.add(this.color2Text)
				i++;
				j++;
			}
			if (key == 'color3') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.color3Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[3]);
				this.color3Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.color3Text.setText(value);
				this.end.add(this.color3Icon)
				this.end.add(this.color3Text)
				i++;
				j++;

			}
			if (key == 'color4') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.color4Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[4]);
				this.color4Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.color4Text.setText(value);
				this.end.add(this.color4Icon)
				this.end.add(this.color4Text)
				i++;
				j++;

			}
			if (key == 'color5') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.color5Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2', 0).setScale(iconScale).setAlpha(1).setTint(colors[5]);
				this.color5Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.color5Text.setText(value);
				this.end.add(this.color5Icon)
				this.end.add(this.color5Text)
				i++;
				j++;

			}

			if (key == 'drop') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.dropIcon = this.add.image(xOffsetT + x * xSpace, y, 'arrow').setScale(iconScale).setAlpha(1).setTint(0xF1C40F);
				this.dropText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.dropText.setText(value);
				this.end.add(this.dropIcon)
				this.end.add(this.dropText)
				i++;
				j++;
			}

			if (key == 'ice') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.iceIcon = this.add.image(xOffsetT + x * xSpace, y, 'ice', 3).setScale(iconScale).setAlpha(1)
				this.iceText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.iceText.setText(value);
				this.end.add(this.iceIcon)
				this.end.add(this.iceText)
				i++;
				j++;
			}


			if (key == 'square') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.squareIcon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(0xb8b8b8);
				this.squareText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.squareText.setText(value);
				this.end.add(this.squareIcon)
				this.end.add(this.squareText)
				i++;
				j++;
			}

			if (key == 'bomb') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.bombIcon = this.add.image(xOffsetT + x * xSpace, y, 'bomb', 3).setScale(iconScale).setAlpha(1).setTint(0xb8b8b8);
				this.bombText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);

				this.bombText.setText(value);
				this.end.add(this.bombIcon)
				this.end.add(this.bombText)
				i++;
				j++;
			}
			//console.log(key + ' ' + value); // "a 5", "b 7", "c 9"

		});
		// console.log(levelSettings.win[i].thing2);
		//  }
	}

}

