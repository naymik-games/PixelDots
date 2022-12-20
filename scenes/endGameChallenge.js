class endGameChal extends Phaser.Scene {
	constructor() {
		super("endGameChal");
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
		console.log(levelConfig.mL - this.Main.board.moves)
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
		var titleText = this.add.text(450, 75, gameModeNames[gameMode] + ' ' + (gameSettings.currentLevel + 1), { fontFamily: 'PixelFont', fontSize: '175px', color: '#000000', align: 'left' }).setOrigin(.5).setInteractive()
		this.end.add(titleText)

		gameSettings.totalDots += total
		gameSettings.totalSquares += this.Main.board.tally[6]

		var scorelabel = this.add.text(225, 425, 'Score', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(scorelabel)
		var scoreleText = this.add.text(225, 500, total, { fontFamily: 'PixelFontWide', fontSize: '250px', color: '#000000', align: 'left' }).setOrigin(.5).setInteractive()
		this.end.add(scoreleText)



		/* 	var newlabel = this.add.text(675, 350, this.outcome + '!', { fontFamily: 'PixelFontWide', fontSize: '100px', color: '#9A4009', align: 'left' }).setOrigin(.5).setAlpha(1)
			this.end.add(newlabel) */





		var bestlabel = this.add.text(675, 425, 'Best Score', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(bestlabel)

		var bestText = this.add.text(675, 500, this.outcome + '!', { fontFamily: 'PixelFontWide', fontSize: '250px', color: '#9A4009', align: 'left' }).setOrigin(.5).setInteractive()
		this.end.add(bestText)


		var totalDotlabel = this.add.text(225, 725, 'Total Dots', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalDotlabel)
		var totalDotText = this.add.text(225, 800, gameSettings.totalDots, { fontFamily: 'PixelFont', fontSize: '100px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalDotText)

		var totalSquarelabel = this.add.text(675, 725, 'Total Squares', { fontFamily: 'PixelFont', fontSize: '70px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalSquarelabel)
		var totalSquareText = this.add.text(675, 800, gameSettings.totalSquares, { fontFamily: 'PixelFont', fontSize: '100px', color: '#000000', align: 'left' }).setOrigin(.5)
		this.end.add(totalSquareText)


		if (this.outcome == 'Win') {
			if (gameSettings.currentLevel == gameSettings.unlocked) {
				gameSettings.unlocked = gameSettings.currentLevel + 1
				var unlocked = this.add.text(450, 1100, 'Level ' + gameSettings.unlocked + ' unlocked', { fontFamily: 'PixelFont', fontSize: '100px', color: '#000000', align: 'left' }).setOrigin(.5)
				this.end.add(unlocked)
				gameSettings.completed = gameSettings.currentLevel
			}
		}




		var playAgain = this.add.image(350, 1250, 'game_icons', 0).setInteractive()
		playAgain.on('pointerdown', this.play, this)
		this.end.add(playAgain)


		var levelSelect = this.add.image(550, 1250, 'game_icons', 2).setInteractive()
		levelSelect.on('pointerdown', this.levelSelect, this)
		this.end.add(levelSelect)

		var goHome = this.add.image(450, 1400, 'game_icons', 1).setInteractive()
		goHome.on('pointerdown', this.home, this)
		this.end.add(goHome)


		this.setupGoals()
		console.log(this.outcome)

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
		/* this.scene.stop('playGame');
		this.scene.stop('endGame');
		this.scene.stop('UI');
		this.scene.start('startGame') */
		this.scene.stop('playGame');
		this.scene.stop('endGame');
		this.scene.stop('UI');
		this.scene.start('playGame')
		this.scene.start('UI')
		/* if (gameMode == 'challenge') {
			this.scene.start('selectGame')
		} else {
			this.scene.start('startGame')
		} */
	}
	home() {
		this.scene.stop('playGame');
		this.scene.stop('endGame');
		this.scene.stop('UI');
		this.scene.start('startGame')

	}
	levelSelect() {
		this.scene.stop('playGame');
		this.scene.stop('endGame');
		this.scene.stop('UI');
		this.scene.start('selectGame')

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
				this.color0Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(dotColors[0]);
				var newVal = value - this.Main.board.tally[0]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.color0Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.color0Text.setText(newVal);
					this.end.add(this.color0Text)
				}


				this.end.add(this.color0Icon)

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
				this.color1Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(colors[1]);
				var newVal = value - this.Main.board.tally[1]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.color1Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.color1Text.setText(newVal);
					this.end.add(this.color1Text)
				}

				this.end.add(this.color1Icon)

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
				this.color2Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(colors[2]);
				var newVal = value - this.Main.board.tally[2]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.color2Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.color2Text.setText(newVal);
					this.end.add(this.color2Text)
				}

				this.end.add(this.color2Icon)

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
				this.color3Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(colors[3]);
				var newVal = value - this.Main.board.tally[3]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.color3Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.color3Text.setText(newVal);
					this.end.add(this.color3Text)
				}

				this.end.add(this.color3Icon)

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
				this.color4Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(colors[4]);
				var newVal = value - this.Main.board.tally[4]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.color4Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.color4Text.setText(newVal);
					this.end.add(this.color4Text)
				}

				this.end.add(this.color4Icon)

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
				this.color5Icon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(colors[5]);
				var newVal = value - this.Main.board.tally[5]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.color5Text = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.color5Text.setText(newVal);
					this.end.add(this.color5Text)
				}

				this.end.add(this.color5Icon)

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
				var newVal = value - this.Main.board.tally[7]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.dropText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.dropText.setText(newVal);
					this.end.add(this.dropText)
				}

				this.end.add(this.dropIcon)

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
				var newVal = value - this.Main.board.tally[9]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.iceText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.iceText.setText(newVal);
					this.end.add(this.iceText)
				}

				this.end.add(this.iceIcon)

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
				this.squareIcon = this.add.image(xOffsetT + x * xSpace, y, 'square').setScale(iconScale).setAlpha(1).setTint(0xb8b8b8);
				var newVal = value - this.Main.board.tally[6]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.squareText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.iceText.setText(newVal);
					this.end.add(this.squareText)
				}
				this.end.add(this.squareIcon)

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
				var newVal = value - this.Main.board.tally[8]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.bombText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.bombText.setText(newVal);
					this.end.add(this.bombText)
				}
				this.end.add(this.bombIcon)

				i++;
				j++;
			}

			if (key == 'rover') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.roverIcon = this.add.image(xOffsetT + x * xSpace, y, 'rover', 3).setScale(iconScale).setAlpha(1).setTint(0xb8b8b8);
				var newVal = value - this.Main.board.tally[11]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.roverText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.roverText.setText(newVal);
					this.end.add(this.roverText)
				}
				this.end.add(this.roverIcon)

				i++;
				j++;
			}
			if (key == 'wild') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.wildIcon = this.add.image(xOffsetT + x * xSpace, y, 'wild').setScale(iconScale).setAlpha(1).setTint(0xb8b8b8);
				var newVal = value - this.Main.board.tally[12]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.wildText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.wildText.setText(newVal);
					this.end.add(this.wildText)
				}
				this.end.add(this.wildIcon)

				i++;
				j++;
			}
			if (key == 'slime') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.slimeIcon = this.add.image(xOffsetT + x * xSpace, y, 'dot2').setScale(iconScale).setAlpha(1).setTint(0x685570);
				var newVal = levels[gameSettings.currentLevel].w * levels[gameSettings.currentLevel].h - this.Main.board.tally[13]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.slimeText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.slimeText.setText(newVal);
					this.end.add(this.slimeText)
				}
				this.end.add(this.slimeIcon)

				i++;
				j++;
			}
			if (key == 'gem') {
				if (i > 2) {
					y = y2;
					x = i - 3;
				} else {
					x = i;
				}
				this.gemIcon = this.add.image(xOffsetT + x * xSpace, y, 'gem').setScale(iconScale).setAlpha(1).setTint(0xb8b8b8);
				var newVal = value - this.Main.board.tally[14]
				if (newVal <= 0) {
					var check = this.add.image(xOffsetI + x * xSpace, y, 'check').setOrigin(0, .5).setScale(.4).setAlpha(1).setTint(0x000000);
					this.end.add(check)
				} else {
					this.gemText = this.add.bitmapText(xOffsetI + x * xSpace, y, 'topaz', '0', labelSize).setOrigin(0, .5).setTint(labelColor).setAlpha(1);
					this.gemText.setText(newVal);
					this.end.add(this.gemText)
				}
				this.end.add(this.gemIcon)

				i++;
				j++;
			}
			//console.log(key + ' ' + value); // "a 5", "b 7", "c 9"

		});
		// console.log(levelSettings.win[i].thing2);
		//  }
	}

}

