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
12 wild */
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
    }
    if (levelConfig.aI) {
      this.board.checkIce(this.coordinates)
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
      if (this.type == 8) {
        this.board.scene.explode(this.coordinates[0], this.coordinates[1])
        console.log('bomb exploded')
        this.board.extraDots.push(this.coordinates)
        this.board.tally[8]++
      }
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
      //dot.image.y += dot.dotSize
      dot.board.scene.tweens.add({
        targets: dot.image,
        y: posY,
        duration: 50,
        //delay: index * 50,

      })
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


  neighbors() {
    var coords = this.neighborCoordinates();
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
}