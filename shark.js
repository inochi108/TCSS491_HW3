function Shark(game, x, y, direction) {
    this.game = game;
    Entity.call(this, game, x, y);
    this.closest = null;
    this.currDistance = null;
    this.direction = direction || Math.floor(Math.random() * 360 + 1); // for 360 degrees
    this.directionTimer = 0;
    this.radius = 800;
    this.speed = 1;
    this.distance;
    this.swim = new Animation(ASSET_MANAGER.getAsset("./shark.png"), 150, 150, 0.1, 1, true, false);
    this.shark = true;
    this.x = 100;
    this.y = 100;
}

Shark.prototype = new Entity();
Shark.prototype.constructor = Shark;

Shark.prototype.update = function () {

    for (var i = 0; i < this.game.entities.length; i++) {

        if (this.game.entities[i] !== this) {
            this.distance = Math.sqrt(Math.pow(this.x - this.game.entities[i].x, 2) + Math.pow(this.y - this.game.entities[i].y, 2));
            if ((this.closest === null || this.distance < this.currDistance) && !(this.collideLeft() || this.collideRight() || this.collideTop() || this.collideBottom())) {
                this.closest = this.game.entities[i];
            }
        }
    }
    if (this.distance <= this.radius + 70) {
//        console.log("shark direction = " + this.direction);
        this.direction = Math.atan2(this.y - this.closest.x, this.x - this.closest.y) * 180 / Math.PI - 90;
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
//    this.speed = Math.random() * 3;
    this.x += this.speed * Math.sin(this.direction * Math.PI / 180);
    this.y -= this.speed * Math.cos(this.direction * Math.PI / 180); // canvas (0,0) starts top left not bottom left

    var TO_RADIANS = Math.PI / 180;
    var angle = this.direction * TO_RADIANS;
    var rotatedImage = this.rotateAndCache(ASSET_MANAGER.getAsset("./shark.png"), angle);
    this.swim = new Animation(rotatedImage, 150, 150, 0.1, 1, true, false);
    Entity.prototype.update.call(this);
}

Shark.prototype.draw = function (ctx) {
    this.swim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}