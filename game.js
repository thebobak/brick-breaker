var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var sound = document.getElementById("gong"); 

function playGong() { 
    sound.play(); 
} 






var Ball = function(){
	this.radius = 10;
	this.x 		= canvas.width / 2;
	this.y		= canvas.height - 30;
	this.dx		= 3;
	this.dy		= -3;
	this.color	= "#0095DD";
};

Ball.prototype.draw = function() {
	ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

var ball = new Ball();


var paddle = {

	height:	15,
	width:	75,
	x:		((canvas.width - 75) / 2)
};

var Brick = function(x,y,width,height,status,color) {

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.status = status;
	this.color = color;
};



var Level = function(number, map, time) {

	this.number = number;
	this.map = map;
	this.time = time;

};

Level.prototype.build = function() {


	var bricks = [];
	for (var c = 0; c < map.length; c++) {
    	bricks[c] = [];
    	for (r = 0; r < map[c].length; r++) {
        	bricks[c][r] = new Brick(0,0,brickWidth,brickHeight,map[c][r]);
        }
    }


};

var level1 = new Level(1, [
                [0,5,5,5,0],
                [4,4,4,4,4],
                [3,0,3,0,3],
                [2,0,2,0,2],
                [0,1,1,1,0]
                ], 100);




var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricksMap = [
                [
                [0,5,5,5,0],
                [4,4,4,4,4],
                [3,0,3,0,3],
                [2,0,2,0,2],
                [0,1,1,1,0]
                ],

                [
                [1,1,1,1,1],
                [0,1,1,1,0],
                [0,0,1,0,0],
                [1,0,0,0,1],
                [1,0,0,0,1]
                ],
            ];

var score = 0;
var lives = 3;
var colors = [
                "#eeeeee",
                "#FFB2B2",
                "#99D5F1",
                "#66BFEB",
                "#33AAE4",
                "#0095DD"
                ];

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = 
      new Brick(0,0,brickWidth,brickHeight,bricksMap[0][c][r]);
        }
    }

//Math.floor((Math.random() * 5) + 1)

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 32) {
    	spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.height / 2;
    }
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status >= 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status -= 1;
                    if (b.status == 0) {
                        score++;
                        
                        if (score == brickRowCount * brickColumnCount) {
                            //alert("YOU WIN, CONGRATS!");
                            playGong();
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricksMap[0][c][r] >= 1) {
            if (bricks[c][r].status >= 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);


                // set brick color

                ctx.fillStyle = colors[bricks[c][r].status];

                ctx.fill();
                ctx.closePath();
            }
        }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    //drawBall();
    ball.draw();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            lives--;
            if (!lives) {
                //alert("GAME OVER");
                playGong();
                document.location.reload();
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 3;
                ball.dy = -3;
                paddle.x = (canvas.width - paddle.height) / 2;
            }
        }
    }

    if (rightPressed && paddle.x < canvas.width - paddle.height) {
        paddle.x += 7;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
    requestAnimationFrame(draw);
}

draw();