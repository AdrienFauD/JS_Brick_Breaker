// board 
let canvas;
let canvasWidth = 300;
let canvasHeight = 300;
let ctx;
// controler
let controlerWidth = 80
let controlerHeight = 15
let controlerX = canvasWidth / 2 - controlerWidth / 2
let controlerY = 7 * canvasHeight / 8
let controlerImg

let controler = {
    x: controlerX,
    y: controlerY,
    width: controlerWidth,
    height: controlerHeight
}

// ball
let ballWidth = 10
let ballHeight = 10
let ballX = controlerX + controlerWidth / 3 
let ballY = controlerY - controlerHeight 
let ballImg
let ballVelocityX = 2
let ballVelocityY = -2

let ball = {
    x: ballX,
    y: ballY,
    width: ballWidth,
    height: ballHeight
}
let score = 0
//bricks
const brickRows = 3
const brickColumns = 6
let bricksWidth = 39
let bricksHeight = 10
let brickGap = 10
let bricksX = 10
let bricksY = 10
let brickLeftCount = brickRows * brickColumns
const bricks = []
for (let c = 0; c < brickColumns; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRows; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }
    }
}
// keys
let leftPressed = false
let rightPressed = false

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

function keyDownHandler(e) {
    if (e.key == "Left" || e.key == 'ArrowLeft') { leftPressed = true }
    else if (e.key == "Right" || e.key == 'ArrowRight') { rightPressed = true }
    console.log(leftPressed)
}
function keyUpHandler(e) {
    if (e.key == "Left" || e.key == 'ArrowLeft') { leftPressed = false }
    else if (e.key == "Right" || e.key == 'ArrowRight') { rightPressed = false }
    console.log(leftPressed)
}


function drawBall() {
    ctx.beginPath()
    ctx.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height)
    ctx.closePath()
}
function drawControler() {
    ctx.drawImage(controlerImg, controler.x, controler.y, controler.width, controler.height)
}
function drawBricks() {
    for (let c = 0; c < brickColumns; c++) {
        for (let r = 0; r < brickRows; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (bricksWidth + brickGap) + bricksX
                const brickY = r * (bricksHeight + brickGap) + bricksY
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, bricksWidth, bricksHeight)
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }

    }
}
function ballMovement() {
    if (ball.x > canvasWidth - ball.width || ball.x < 0) ballVelocityX = -ballVelocityX
    if (ball.y < 0 || ball.y > canvasHeight) ballVelocityY = -ballVelocityY
    if (ball.y > canvasHeight || brickLeftCount === 0) gameOver()
    ball.x += ballVelocityX
    ball.y += ballVelocityY
}
function collisionDetection() {
    if (ball.x + ball.width > controler.x  && ball.x + ball.width < controler.x + controler.width && ball.y > controler.y &&  ball.y < controler.y + controler.height) {
        ballVelocityY = -ballVelocityY;
        return
    }
    for (let c = 0; c < brickColumns; c++) {
        for (let r = 0; r < brickRows; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if ((ball.x > b.x && ball.x < b.x + bricksWidth && ball.y > b.y && ball.y < b.y + bricksHeight)
                    || ((ball.x + ballWidth > b.x && ball.x + ballWidth < b.x + bricksWidth && ball.y + ballWidth > b.y && ball.y + ballWidth < b.y + bricksHeight))
                ) {
                    ballVelocityY = -ballVelocityY;
                    b.status = 0
                    brickLeftCount -= 1
                    console.log(brickLeftCount)
                }
            }
        }
    }
}

function gameOver() {

    if(brickLeftCount === 0) alert("You win")
    else {alert("You loose")}
    ball = {
        x: ballX,
        y: ballY
    }
    ballVelocityY = Math.abs(ballVelocityY)
    reset()
}

function update() {
    requestAnimationFrame(update)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    if (rightPressed && controler.x < canvasWidth - controler.width) {
        controler.x += 7;
    }
    else if (leftPressed && controler.x > 0) {
        controler.x -= 7;
    }
    collisionDetection()
    drawBricks()
    drawBall()
    drawControler()
    ballMovement()
}


window.onload = function () {
    canvas = document.getElementById("board")
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx = canvas.getContext('2d')
    
    // draw ball
    ballImg = new Image()
    ballImg.src = './ball.svg'
    ballImg.onload = function () {
        ctx.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height)

    }
    //draw controler
    controlerImg = new Image()
    controlerImg.src = './controler.svg'
    controlerImg.onload = function () {
        ctx.drawImage(controlerImg, controler.x, controler.y, controler.width, controler.height)
    }
    requestAnimationFrame(update)
}
