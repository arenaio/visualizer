(function (namespace) {
  let frames = []
  let len = 0
  let currentFrame = 0

  class Grid {
    constructor(canvas) {
      this.canvas = canvas
      this.context = canvas.getContext('2d')
      this.context.lineWidth = 5
      this.positions = []
      this.keyFrame = 0
    }

    draw() {
      this.context.clearRect(0, 0, canvas.width, canvas.height);

      this.drawLines()

      this.drawPositions()
    }

    drawLines() {
      this.context.beginPath()

      // create lines in x direction
      for (let i = 0; i < 2; i++) {
        let x = 100 + 100 * i
        this.context.moveTo(x, 0)
        this.context.lineTo(x, 300)
      }

      // create lines in y direction
      for (let i = 0; i < 2; i++) {
        let y = 100 + 100 * i
        this.context.moveTo(0, y)
        this.context.lineTo(300, y)
      }

      this.context.strokeStyle = '#000000'
      this.context.stroke()
      this.context.closePath()
    }

    drawPositions() {
      this.positions.forEach((pos, i) => {
        if (pos === '_') {
          return
        }

        let x = i % 3 | 0
        let y = i / 3 | 0
        if (pos === 'o') {
          this.drawO(x, y)
        } else {
          this.drawX(x, y)
        }
      })
    }

    drawX(cellX, cellY) {
      var i = 0, dx, dy
      this.context.beginPath()
      for (i = 0; i < 2; i++) {
        dx = (cellX * 100) + 10 + (80 * i)
        dy = (cellY * 100) + 10
        this.context.moveTo(dx, dy)
        dx = (cellX * 100) + 90 - (80 * i)
        dy = (cellY * 100) + 90
        this.context.lineTo(dx, dy)
      }
      this.context.strokeStyle = '#3333ff'
      this.context.stroke()
      this.context.closePath()
    }

    drawO(cellX, cellY) {
      this.context.beginPath()
      this.context.arc(cellX * 100 + 50, cellY * 100 + 50, 40, 0, Math.PI * 2, false)
      this.context.strokeStyle = '#ff3333'
      this.context.stroke()
      this.context.closePath()
    }
  }

  function stepBack() {
    if (currentFrame <= 0) {
      console.log('first reached')
      return
    }

    currentFrame--
    showFrame(currentFrame)
  }

  function play() {
    const stopInterval = () => {
      window.clearInterval(this.interval)
      this.interval = null
    }

    if (this.interval) {
      stopInterval()
    }

    this.interval = window.setInterval(
      () => {
        stepForward()
        if (currentFrame === frames.length - 1) {
          stopInterval()
        }
      },
      500
    )

  }

  function stepForward() {
    if (frames.length <= 0) {
      console.log('no frames')
      return
    }

    if (currentFrame >= frames.length - 1) {
      console.log('last reached')
      return
    }

    currentFrame++
    showFrame(currentFrame)
  }

  function displayStatus(current, number) {
    let statusText = `Frame ${current + 1} of ${number}`
    document.querySelector('#frames').innerText = statusText;
  }

  function showFrame(number) {
    currentFrame = number
    displayStatus(number, frames.length)
    gameGrid.positions = frames[number].view.replace('\n', '').split('')
    gameGrid.draw()
  }

  function applyResult(response) {
    frames = response.success.gameResult.frames
    showFrame(0)
  }

  function init() {
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

  const gameGrid = new Grid(document.querySelector('#canvas'))
  gameGrid.draw()
  namespace.Grid = gameGrid;
  document.querySelector('#step-back').addEventListener('click', stepBack)
  document.querySelector('#play').addEventListener('click', play)
  document.querySelector('#step-forward').addEventListener('click', stepForward)
  window.addEventListener('hashchange', init)
  init();
}(window.Visualizer || (window.Visualizer = {})))
