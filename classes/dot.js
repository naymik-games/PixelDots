//types
// 0 color dot
//1 drop tally index 6
//2 bomb tally index 7
//3 ice tally index 8
//4 block tally index 9 n/a
//5 square tally index 10
//6 rover tally index 11
//5 + type--5 + 1 = 6
//[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
/* 0 color0
1 color1
2 color2
3 color3
4 color4
5 color5
6 square (not a type)
7 drop 
8 bomb
9 ice 
10 block 
11 rover 
12 wild 
13 slime
14 geme
15 fire
16 balls
*/
class Dot {
  constructor(id, x, y, color, board, dotSize) {
    this.coordinates = [x, y];
    this.color = color;
    this.type = color;
    this.strength = 0
    this.board = board;
    this.disabled = false;
    this.bounce = false
    this.image = null
    this.dotSize = dotSize
    this.selectable = true
    this.disabled = false
    this.movesGoal = 20
    this.direction = 0
    /* if (this.color == 2) {
      this.selectable = false
    } else {
      this.selectable = true
    } */


  }
  activate() {
    //var visibleDot = this.findDOMObject();
    //visibleDot.addClass("active");

    //this.board.selectedColor = this.color;
    this.board.selectedDots.push(this);
    this.image.setAlpha(.5)


  }
  deactivate() {

    this.image.setAlpha(1)
  }

  ///remove

  explode() {
    //this.board.scene.killAndHide(this.image)
    if (this.strength < 1) {
      this.image.setActive(false)
      this.image.setVisible(false)
    } else if (this.type == 8) {
      this.strength--
      this.image.setFrame(this.strength)
    } else if (this.type == 11) {
      this.strength--
      this.image.setFrame(this.strength)
      var num = Phaser.Math.Between(0, dotColors.length - 1)
      this.image.setTint(dotColors[num])
      this.color = num
      var randomNum = randomExcludedNumber(dotColors.length, num);
      var n = this.neighbors()
      for (var i = 0; i < n.length; i++) {
        if (n[i].type < 6) {
          //var num = Phaser.Math.Between(0, dotColors.length - 1)
          n[i].image.setTint(dotColors[randomNum])
          n[i].color = randomNum
        }
      }
    }
    if (levelConfig.aSl) {
      if (this.isNeighborSlime()) {
        console.log('Slime')
        this.board.setSlime(this.coordinates)
      }
    }
    if (levelConfig.aI) {
      this.board.checkIce(this.coordinates)
    }
    if (this.board.scene.allowFire) {
      this.extinguishNeighborFire()
    }
    if (this.board.scene.allowBalls) {
      this.hitNeighborBall()
    }
  }
  destroy() {
    if (this.strength == 0) {
      this.disabled = true
      this.board.tally[this.type]++
      this.redrawThisColumn();
      this.adjustAboveDotCoordinates(this.dotSize);
      this.deleteThisFromArray();
      this.fillInSpaceLeft();
      if (this.type == 11) {
        this.board.scene.explode(this.coordinates[0], this.coordinates[1])
        this.board.extraDots.push(this.coordinates)
      }
      if (this.type == 8) {
        this.board.scene.explode(this.coordinates[0], this.coordinates[1])
        console.log('bomb exploded')
        this.board.extraDots.push(this.coordinates)
        this.board.tally[8]++
      }
      if (this.type == 14) {
        this.board.scene.explode(this.coordinates[0], this.coordinates[1])
        this.board.gems.push(this.coordinates)
      }
      /*  if (this.type == 16) {
         this.board.scene.explode(this.coordinates[0], this.coordinates[1])
         this.board.balls.push(this.coordinates)
         this.board.tally[16]++
       } */
    } else {
      this.image.setAlpha(1)
    }
  }

  redrawThisColumn() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    if (!(x in this.board.redrawTheseColumns) || this.board.redrawTheseColumns[x] < y) {
      this.board.redrawTheseColumns[x] = y;
    }
  }
  aboveDot() {
    var aboveCoords = this.aboveCoordinate();
    return this.board.findDot(aboveCoords);
  }

  aboveCoordinate() {
    return [this.coordinates[0], (this.coordinates[1] - 1)]
  }
  adjustAboveDotCoordinates() {
    this.aboveDots().forEach(function (dot, index) {
      dot.coordinates[1] += 1;
      let posY = dot.board.scene.yOffset + dot.board.scene.dotSize * dot.coordinates[1] + dot.board.scene.dotSize / 2
      dot.image.y += dot.dotSize
      /*  dot.board.scene.tweens.add({
         targets: dot.image,
         y: posY,
         duration: 50 * dot.coordinates[1],
         //delay: index * 50,
 
       }) */
      //dot.image.y += 110
    });
  }
  deleteThisFromArray() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    deleteAt(this.column(), y);
  }
  aboveDots() {
    var columnDots = this.column();
    var y = this.coordinates[1];
    return columnDots.filter(function (dot) {
      return dot.coordinates[1] < y;
    });
  }
  column() {
    var x = this.coordinates[0];
    return this.board.dots[x];
  }
  fillInSpaceLeft() {
    var x = this.coordinates[0];
    this.board.createNewDot(x);
  }
  ///////
  hitNeighborBall() {
    var n = this.neighbors()
    var isFire = false
    for (let i = 0; i < n.length; i++) {
      const element = n[i];

      if (this.board.dots[element.coordinates[0]][element.coordinates[1]].type == 16) {
        this.board.dots[element.coordinates[0]][element.coordinates[1]].strength--
        this.board.dots[element.coordinates[0]][element.coordinates[1]].image.setFrame(this.board.dots[element.coordinates[0]][element.coordinates[1]].strength)
        if (this.board.dots[element.coordinates[0]][element.coordinates[1]].strength == 0) {
          this.board.balls.push(this.coordinates)
          this.board.tally[16]++
          // this.board.scene.damageEmit(this.board.dots[element.coordinates[0]][element.coordinates[1]].image.x, this.board.dots[element.coordinates[0]][element.coordinates[1]].image.y)
          this.board.scene.explode(element.coordinates[0], element.coordinates[1])
          var num = Phaser.Math.Between(0, dotColors.length - 1);
          this.board.dots[element.coordinates[0]][element.coordinates[1]].type = num
          this.board.dots[element.coordinates[0]][element.coordinates[1]].color = num
          this.board.dots[element.coordinates[0]][element.coordinates[1]].image.setTexture('dot2')
          this.board.dots[element.coordinates[0]][element.coordinates[1]].image.setTint(dotColors[num])
          this.board.dots[element.coordinates[0]][element.coordinates[1]].selectable = true
        }
      }
    }
  }
  extinguishNeighborFire() {
    var n = this.neighbors()
    var isFire = false
    for (let i = 0; i < n.length; i++) {
      const element = n[i];
      if (this.board.dots[element.coordinates[0]][element.coordinates[1]].type == 15) {
        this.board.scene.damageEmit(this.board.dots[element.coordinates[0]][element.coordinates[1]].image.x, this.board.dots[element.coordinates[0]][element.coordinates[1]].image.y)
        var num = Phaser.Math.Between(0, dotColors.length - 1);
        this.board.dots[element.coordinates[0]][element.coordinates[1]].type = num
        this.board.dots[element.coordinates[0]][element.coordinates[1]].color = num
        this.board.dots[element.coordinates[0]][element.coordinates[1]].image.setTexture('dot2')
        this.board.dots[element.coordinates[0]][element.coordinates[1]].image.setTint(dotColors[num])
        this.board.dots[element.coordinates[0]][element.coordinates[1]].selectable = true
        this.board.growFire = false
        this.board.tally[15]++

      }
    }
  }
  isNeighborSlime() {
    var n = this.neighbors()
    var isSlime = false
    for (let i = 0; i < n.length; i++) {
      const element = n[i];
      if (this.board.underlay[element.coordinates[0]][element.coordinates[1]].type == 13) {
        return true
      }
    }
  }

  neighbors() {
    var coords = this.neighborCoordinates();
    return this.board.findDots(coords);
  }
  neighborsBox() {
    var coords = this.neighborBoxCoordinates();
    return this.board.findDots(coords);
  }

  neighborCoordinates() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    return [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y]
    ];
  }
  neighborBoxCoordinates() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    return [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1, y - 1],
      [x + 1, y - 1],
      [x + 1, y + 1],
      [x - 1, y + 1]
    ];
  }
}