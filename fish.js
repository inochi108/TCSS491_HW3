function Fish(game, x, y, direction) {
    this.game = game;
    Entity.call(this, game, x, y);
    this.x = x;
    this.y = y;
    this.closest = null;
    this.currDistance = null;
    this.direction = direction || Math.floor(Math.random() * 360 + 1); // for 360 degrees
    this.directionTimer = 0;
    this.radius = 100;
    this.speed = Math.random() * 5;
    this.distance;
    this.swim = new Animation(ASSET_MANAGER.getAsset("./fish.png"), 70, 70, 0.1, 1, true, false);
    this.shark = false;
    this.flockTimer = 0;
    this.outsideTimer = 0;
}

Fish.prototype = new Entity();
Fish.prototype.constructor = Fish;

Fish.prototype.update = function () {

    for (var i = 0; i < this.game.entities.length; i++) {

        if (this.game.entities[i] !== this && this.game.entities[i].shark === false) {
            this.distance = Math.sqrt(Math.pow(this.x - this.game.entities[i].x, 2) + Math.pow(this.y - this.game.entities[i].y, 2));
            if ((this.closest === null || this.distance < this.currDistance)) {
                this.closest = this.game.entities[i];
            }
        }
    }

    if (this.flockTimer === 0) {
    if (this.distance <= this.radius * 2) {
        this.direction = this.closest.direction;
    }
        this.flockTimer = 10;
    } else {
        this.flockTimer--;
    }

//    if (this.directionTimer === 0) {
//        var degrees = Math.floor(Math.random() * 45 + 1);
//        var sign = Math.floor(Math.random() * 2);
//        if (sign === 0)
//            sign = -1;
//        this.direction += degrees * sign;
//        if (this.direction < 0)
//            this.direction += 360;
//        if (this.direction > 360)
//            this.direction -= 360;
//        this.directionTimer = 30;
//    } else {
//        this.directionTimer -= 1;
//    }


    if (this.collideLeft() || this.collideRight() || this.collideTop() || this.collideBottom()) {

        var x = Math.floor(Math.random() * 700 + 50);
        var y = Math.floor(Math.random() * 700 + 50);

        this.direction = Math.atan2(this.y - x, this.x - y) * 180 / Math.PI - 90;
    }
    
    for (var i = 0; i < this.game.entities.length; i++) {

        if (this.game.entities[i] !== this && this.game.entities[i].shark === true) {
            this.distance = Math.sqrt(Math.pow(this.x - this.game.entities[i].x, 2) + Math.pow(this.y - this.game.entities[i].y, 2));
            if (this.distance <= this.radius * 2) {

                if (this.collideBottom()) {
                    if (this.game.entities[i].x < this.x) {
                        this.direction = 90;
                    } else {
                        this.direction = 270;
                    }
                } else if (this.collideLeft()) {
                    if (this.game.entities[i].y < this.y) {
                        this.direction = 180;
                    } else {
                        this.direction = 360;
                    }
                } else if (this.collideRight()) {
                    if (this.game.entities[i].y < this.y) {
                        this.direction = 180;
                    } else {
                        this.direction = 360;

                    }
                } else if (this.collideTop()) {
                    if (this.game.entities[i].x < this.x) {
                        this.direction = 90;
                    } else {
                        this.direction = 270;
                    }
                } else {
                    this.direction = Math.atan2(this.y - this.game.entities[i].x, this.x - this.game.entities[i].y) * 180 / Math.PI - 90;
                    this.direction += 150;
                    if (this.direction < 0)
                        this.direction += 360;
                    if (this.direction > 360)
                        this.direction += 360;
                }
            }

        }
    }
    
//    console.log("fish direction = " + this.direction);

    this.speed = Math.random() * 10;
    this.x += this.speed * Math.sin(this.direction * Math.PI / 180);
    this.y -= this.speed * Math.cos(this.direction * Math.PI / 180); // canvas (0,0) starts top left not bottom left

    var TO_RADIANS = Math.PI / 180;
    var angle = this.direction * TO_RADIANS;
    var rotatedImage = this.rotateAndCache(ASSET_MANAGER.getAsset("./fish.png"), angle);
    this.swim = new Animation(rotatedImage, 70, 70, 0.1, 1, true, false);
    Entity.prototype.update.call(this);
}

Fish.prototype.draw = function (ctx) {
    this.swim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}