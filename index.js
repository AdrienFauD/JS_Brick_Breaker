document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
document.addEventListener("mousemove", mouseMoveHandler, false)


// board 
let canvas;
let canvasWidth = 300;
let canvasHeight = 300;
let canvasBackgroundImg;
let ctx;
// controler
let controlerWidth = 50
let controlerHeight = 15
let controlerX = canvasWidth / 2 - controlerWidth / 2
let controlerY = 7 * canvasHeight / 8
let controlerImg

let controler = {}

// ball
let ballWidth = 10
let ballHeight = 10
let ballX = controlerX + controlerWidth / 3
let ballY = controlerY - controlerHeight
let ballImg
let ballVelocityX = 2
let ballVelocityY = -2
let ball = {}
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
let brickImg
const bricks = []
//gameover text
let gameOverFontSize = 50
let gameOverTextPositionX = 20
let gameOverTextPositionY = canvasWidth / 2

// keys
let left_pressed = false
let right_pressed = false
let game_over = false



function reset() {
    // controler
    controler = {
        x: controlerX,
        y: controlerY,
        width: controlerWidth,
        height: controlerHeight
    }
    controlerImg = new Image()
    controlerImg.src = './controler.svg'

    // ball
    ballImg = new Image()
    ballImg.src = './ball.svg'
    ballVelocityX = (2+score)*(Math.random() < 0.5 ? -1 : 1) 
    ballVelocityY = -2 - score

    ball = {
        x: ballX,
        y: ballY,
        width: ballWidth,
        height: ballHeight
    }
    //bricks
    brickLeftCount = brickRows * brickColumns
    brickImg = new Image()
    brickImg.src = './brick.svg'

    // keys
    left_pressed = false
    right_pressed = false
    game_over = false

    for (let c = 0; c < brickColumns; c++) {
        bricks[c] = []
        for (let r = 0; r < brickRows; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
    }
}




function keyDownHandler(e) {
    if (e.key == "Left" || e.key == 'ArrowLeft') { left_pressed = true }
    else if (e.key == "Right" || e.key == 'ArrowRight') { right_pressed = true }
}
function keyUpHandler(e) {
    if (e.key == "Left" || e.key == 'ArrowLeft') { left_pressed = false }
    else if (e.key == "Right" || e.key == 'ArrowRight') { right_pressed = false }

}
function mouseMoveHandler(e) {
    let canvasPosition = canvas.getBoundingClientRect()
    let canvasPositionX = canvasPosition.x
    let mousePosition = e.clientX
    if (mousePosition > canvasPositionX && mousePosition < canvasWidth + canvasPositionX) {
        controler.x = mousePosition - controler.width / 2 - canvasPositionX
    }
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
                ctx.drawImage(brickImg, brickX, brickY, bricksWidth, bricksHeight)
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
    ball.x += ballVelocityX
    ball.y += ballVelocityY
}
function collisionDetection() {
    //collision with pad
    if (ball.y > controler.y && ball.y < controler.y + controler.height) {
        if (ball.x + ball.width > controler.x && ball.x + ball.width < controler.x + controler.width / 3) {
            ballVelocityX = -Math.abs(ballVelocityX) - .5;
            ballVelocityY = -Math.abs(ballVelocityY + .2);
        }
        else if (ball.x + ball.width > controler.x + controler.width / 3 && ball.x + ball.width < controler.x + 2 * controler.width / 3) {
            ballVelocityY = -Math.abs(ballVelocityY + .2);

        }
        else if (ball.x + ball.width > controler.x + 2 * controler.width / 3 && ball.x + ball.width < controler.x + controler.width) {
            ballVelocityY = -Math.abs(ballVelocityY + .2);
            ballVelocityX = Math.abs(ballVelocityX) + .5;
        }
        return
    }
    // colision with bricks
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
                }
            }
        }
    }
}

function gameOver() {

    if (brickLeftCount === 0) {
        ctx.font = gameOverFontSize + "px serif";
        ctx.fillText("You win !", gameOverTextPositionX, gameOverTextPositionY);
    } else {
        ctx.font = gameOverFontSize + "px serif";
        ctx.fillText("You loose ! ", gameOverTextPositionX, gameOverTextPositionY);
    }
    ball = {
        x: ballX,
        y: ballY
    }
    ballVelocityY = Math.abs(ballVelocityY)
    score++
    game_over = true
    
}
function restart(e) {
    if(!game_over) return
    let canvasPosition = canvas.getBoundingClientRect()
    let canvasPositionX = canvasPosition.x
    let canvasPositionY = canvasPosition.y
    let mousePositionX = e.clientX
    let mousePositionY = e.clientY
    if (mousePositionX > canvasPositionX + gameOverTextPositionX && mousePositionX < canvasPositionX + canvasWidth - 20
        && mousePositionY > canvasPositionY + gameOverTextPositionY - gameOverFontSize && mousePositionY < canvasPositionY + gameOverTextPositionY) {
            reset()
    }
}



function update(e) {
    requestAnimationFrame(update)
    if (game_over) {
        document.addEventListener("mouseup", restart, false)
        restart(e)
        document.removeEventListener("mouseup", restart, true)
        return
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    if (right_pressed && controler.x < canvasWidth - controler.width) {
        controler.x += 7;
    }
    else if (left_pressed && controler.x > 0) {
        controler.x -= 7;
    }
    collisionDetection()
    drawBricks()
    drawBall()
    drawControler()
    ballMovement()
    if (ball.y > canvasHeight || brickLeftCount === 0) gameOver()

}


window.onload = function () {
    canvas = document.querySelector("#board")
    canvasBackgroundImg = new Image()
    canvasBackgroundImg.src = './background.svg'
    canvas.src = './background.svg'
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx = canvas.getContext('2d')
    reset()

    requestAnimationFrame(update)
}
