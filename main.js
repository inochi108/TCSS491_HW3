var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./fish.png");
ASSET_MANAGER.queueDownload("./shark.png");


ASSET_MANAGER.downloadAll(function () {
    var socket = io.connect("http://76.28.150.193:8888");

    var saveButton = document.getElementById("save");
    saveButton.onclick = function () {

        var sentData = {fish: [], shark: {x: null, y: null, direction: null}};

        for (var i = 0; i < gameEngine.entities.length; i++) {
            if (gameEngine.entities !== null && gameEngine.entities[i].shark === false) {
                var fish = {x: null, y: null, direction: null};
                fish.x = gameEngine.entities[i].x;
                fish.y = gameEngine.entities[i].y;
                fish.direction = gameEngine.entities[i].direction;
                sentData.fish.push(fish);
            }
            if (gameEngine.entities !== null && gameEngine.entities[i].shark === true) {
                sentData.shark.x = gameEngine.entities[i].x;
                sentData.shark.y = gameEngine.entities[i].y;
                sentData.shark.direction = gameEngine.entities[i].direction;
            }
        }

        socket.emit("save", {studentname: "Jowy", statename: "aState", data: sentData});

        console.log(sentData);
    };

    var loadButton = document.getElementById("load");
    loadButton.onclick = function () {
        socket.emit("load", {studentname: "Jowy", statename: "aState"});



    };

    socket.on("load", function (data) {
        gameEngine.entities = [];

        if (data.data.fish !== null) {
            for (var i = 0; i < data.data.fish.length; i++) {

                gameEngine.addEntity(new Fish(gameEngine, data.data.fish[i].x, data.data.fish[i].y, data.data.fish[i].direction));
            }
        }

        if (data.data.shark !== null) {
            gameEngine.addEntity(new Shark(gameEngine, data.data.shark.x, data.data.shark.y, data.data.shark.direction));
        }

    });

//    socket.emit("load", {studentname: "Jowy", statename: "aState"});
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();


    gameEngine.addEntity(new Shark(gameEngine, 100, 100));
    for (var i = 0; i < 10; i++) {
        var x = Math.floor(Math.random() * 700 + 51);
        var y = Math.floor(Math.random() * 700 + 51);
        gameEngine.addEntity(new Fish(gameEngine, x, y));
    }

    gameEngine.init(ctx);
    gameEngine.start();
});
