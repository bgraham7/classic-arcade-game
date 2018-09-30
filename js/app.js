// Enemies our player must avoid
var Enemy = function() {
    // Random left or right start
    this.direction = Math.random() > .5 ? 'toRight' : 'toLeft'
    // Going Right starts on Left and visa versa
    this.x = this.direction == 'toRight'? -101 : 505;
    // Picks a random row between 1 and 3
    this.y =  Math.floor((Math.random() * 3) + 1) * 83;
    // Picks a random speed between 1 and 3 tiles per second
    this.speed = Math.floor((Math.random() * 3) + 1);
    this.width = 101;
    this.height = 83;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position based on random speed
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    distance = dt * this.speed * 101;
    if(this.direction === 'toRight') {
        this.x += distance;
        if(this.x > 600) {
            this.recreate();
        }
    } else {
        this.x -= distance;
        if(this.x < -200) {
            this.recreate();
        }
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Removes enemy and replaces it with a new one to start from left or right with random speed
Enemy.prototype.recreate = function() {
    var index = allEnemies.indexOf(this);
    allEnemies.splice(index, 1);
    allEnemies.push(new Enemy());
}

var Player = function() {
    this.lives = 3;
    this.score = 0;
    // Used to prevent double scoring
    this.scoring = false;
    this.x = 2 * 101;
    this.y = 5 * 83;
    this.width = 101;
    this.height = 83;
    this.sprite = 'images/char-boy.png'
}

// Updated score, every 30 points adds a new enemy
Player.prototype.updateScore = function() {
    this.x = 2 * 101;
    this.y = 5 * 83;
    this.score+= 10;
    if(this.score % 30 == 0) {
        allEnemies.push(new Enemy());
    }

    document.getElementById('score').innerHTML = this.score;
}

// Checks players position, scores if at the top of screen
Player.prototype.update = function() {
    if(this.scoring) {
        return;
    }
    myPlayer = this;
    if(this.y === 0) {
        console.log("test");
        this.scoring = true;
        setTimeout(function() {
            myPlayer.scoring = false;
            myPlayer.updateScore();
        }, 100);
    }
};

// Handle player colllision with enemies. subtracts a life and resets game if less than 0
Player.prototype.collision = function() {
    this.x = 2 * 101;
    this.y = 5 * 83;
    this.lives--;
    if(this.lives < 0) {
        this.lives = 3;
        this.score = 0;
        alert("No more lives! Try again.");
        allEnemies = [
            new Enemy(),
            new Enemy(),
            new Enemy(),
        ];
        document.getElementById('score').innerHTML = this.score;
    }
    document.getElementById('lives').innerHTML = this.lives;
}

// Draws player on screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
    switch(dir) {
        case 'left':
            if(this.x > 0) {
                this.x -= 101;
            }
            break;
        case 'right':
            if(this.x < 404) {
                this.x += 101;
            }
            break;
        case 'up':
            if(this.y > 0) {
                this.y -= 83;
            }
            break;
        case 'down':
            if(this.y < 415) {
                this.y += 83;
            }
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [
    new Enemy(),
    new Enemy(),
    new Enemy()
];

// Handle keypresses
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
