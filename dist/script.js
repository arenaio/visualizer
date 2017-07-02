(function (namespace) {
  const ctx = document.querySelector('#canvas').getContext('2d')
  const DOUBLE_PI = Math.PI * 2
  ctx.lineWidth = 5

  const $slice = Array.prototype.slice
  let frames = []
  let len = 0
  let currentFrame = 0

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

    undraw(cellX, cellY) {
      ctx.beginPath()
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(cellX*100,cellY*100, cellX*100 + 50, cellY * 100 + 50);
      ctx.closePath()
    }

    drawX(cellX, cellY) {
      var i = 0, dx, dy
      ctx.beginPath()
      for (i = 0; i < 2; i++) {
        dx = (cellX * 100) + 10 + (80*i)
        dy = (cellY * 100) + 10
        ctx.moveTo(dx, dy)
        dx = (cellX * 100) + 90 - (80*i)
        dy = (cellY * 100) + 90
        ctx.lineTo(dx, dy)
      }
      ctx.strokeStyle = '#3333ff'
      ctx.stroke()
      ctx.closePath()
    }

    drawO (cellX, cellY) {
      ctx.beginPath()
      ctx.arc(cellX*100 + 50,
              cellY*100 + 50,
              40, 0, DOUBLE_PI, false)
      ctx.strokeStyle = '#ff3333'
      ctx.stroke()
      ctx.closePath()
    }

    markCellWithX(x, y) {
      this.positions[(y * 3) + x] = 'x'
      this.keyFrame++
      this.draw()
    }

    markCellWithO(x, y) {
      this.positions[(y * 3) + x] = 'o'
      this.keyFrame++
      this.draw()
    }

    unmarkCellWithX(x, y) {
      this.positions[(y * 3) + x] = '-'
      this.keyFrame--
      this.draw()
    }

    unmarkCellWithO(x, y) {
      this.positions[(y * 3) + x] = '-'
      this.keyFrame--
      this.draw()
    }

    isMarkedCell(x, y) {
      return typeof this.positions[(y * 3) + x] !== 'undefined' 
    }

    checkDraw() {
      return false
    }
  }

  function fillGrid(current) {
    const frame = frames[current - 1]
    if (!frame.view) {
      console.log('no view, aborting')
      return
    }

    const settings = frame.view.split('')
    // console.log(settings)
    settings.forEach((value, idx) => {
      console.log('Value', value)

      // let pos = idx % 3
      let pos = 0
      console.log('Position', pos)

      switch (value) {
        case 'o': 
          if (namespace.Grid.isMarkedCell(pos, idx / 3)) {
            namespace.Grid.unmarkCellWithO(pos, idx / 3);
          } else {
            namespace.Grid.markCellWithO(pos, idx / 3);
          }
          break;
        case 'x': 
          if (namespace.Grid.isMarkedCell(pos, idx / 3)) {
            namespace.Grid.unmarkCellWithX(pos, idx / 3);
          } else {
            namespace.Grid.markCellWithX(pos, idx / 3);
          }
          break;
        default:
          break;
      }
    })
  }

  function stepBack(e) {
    console.log('step back')
    if (currentFrame <= 1) {
      console.log('first reached')
      return
    }

    currentFrame--

    displayStatus(currentFrame, len)
    fillGrid(currentFrame)
  }

  function play(e) {
    console.log('play')
  }

  function stepForward(e) {
    console.log('step forward')
    if (frames.length <= 0) {
      console.log('no frames')
      return
    }

    if (currentFrame >= len) {
      console.log('last reached')
      return
    }

    currentFrame++

    displayStatus(currentFrame, len)
    fillGrid(currentFrame)
  }

  function displayStatus(current, number) {
    let statusText = `Frame ${current} of ${number}`
    document.querySelector('#frames').innerText = statusText;
  }

  function handleFrame(number, frame, count) {
    currentFrame = number
    displayStatus(number, count)
  }

  function applyResult(response) {
    console.log(response.success)
    frames = response.success.gameResult.frames
    len = frames.length

    handleFrame(1, frames[0], len)
  }

  function init() {
    document.querySelector('#step-back').addEventListener('click', stepBack)
    document.querySelector('#play').addEventListener('click', play)
    document.querySelector('#step-forward').addEventListener('click', stepForward)

    const uri = window.location.href;
    const challengeCall = uri.split('#')
    let challengeUri = ''

    if (challengeCall.length === 2) {
      challengeCall.push('.json')
      challengeUri = challengeCall.join('')
    }

    // make http request
    let result = window.fetch(challengeUri).then((response) => {
      return response.json()
    }).then((json) => {
      applyResult(json)
    })

  }

  const gameGrid = new Grid()
  gameGrid.draw()
  namespace.Grid = gameGrid;
  init();
}(window.Visualizer || (window.Visualizer = {})))
