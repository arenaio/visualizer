(function (namespace) {
  const ctx = document.querySelector('#canvas').getContext('2d')
  const DOUBLE_PI = Math.PI * 2
  ctx.lineWidth = 5

  const $slice = Array.prototype.slice;

  class Grid {
    constructor() {
      this.positions = []
      this.keyFrame = 0
    }

    draw() {
      let i = 0, x, y, pos

      ctx.beginPath()
      // create lines in x direction
      for (; i < 2; i++) {
        x = 100 + 100*i
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 300)
      }
      // create lines in y direction
      for (i = 0; i < 2; i++) {
        y = 100 + 100*i
        ctx.moveTo(0, y)
        ctx.lineTo(300, y)
      }

      ctx.strokeStyle = '#000000'
      ctx.stroke()
      ctx.closePath()

      pos = this.positions
      for (i = 0; i < 9; i++) {
        x = i % 3 | 0
        y = i / 3 | 0
        if (pos[i] === 'x') {
            this.drawX(x, y)
        } else if (pos[i] === 'o') {
            this.drawO(x, y)
        }
      }
    }

    drawX(cellX, cellY) {
      var i = 0, dx, dy;
      ctx.beginPath();
      for (i = 0; i < 2; i++) {
        dx = (cellX * 100) + 10 + (80*i);
        dy = (cellY * 100) + 10;
        ctx.moveTo(dx, dy);
        dx = (cellX * 100) + 90 - (80*i);
        dy = (cellY * 100) + 90;
        ctx.lineTo(dx, dy);
      }
      ctx.strokeStyle = '#3333ff';
      ctx.stroke();
      ctx.closePath();
    }

    drawO (cellX, cellY) {
      ctx.beginPath();
      ctx.arc(cellX*100 + 50,
              cellY*100 + 50,
              40, 0, DOUBLE_PI, false);
      ctx.strokeStyle = '#ff3333';
      ctx.stroke();
      ctx.closePath();
    }

    markCellWithX(x, y) {
      this.positions[(y * 3) + x] = 'x';
      this.keyFrame++;
      this.draw();
    }

    markCellWithO(x, y) {
      this.positions[(y * 3) + x] = 'o';
      this.keyFrame++;
      this.draw();
    }

    isMarkedCell(x, y) {
      return typeof this.positions[(y * 3) + x] !== 'undefined'; 
    }

    checkDraw() {
      return false
    }
  }

  function stepBack(e) {

  }

  function play(e) {

  }

  function stepForward(e) {

  }

  function init() {
    document.querySelector('#step-back').addEventListener('click', stepBack)
    document.querySelector('#play').addEventListener('click', play)
    document.querySelector('#step-forward').addEventListener('click', stepForward)
  }

  const gameGrid = new Grid()
  gameGrid.draw()
  namespace.Grid = gameGrid;
}(window.Visualizer || (window.Visualizer = {})))
