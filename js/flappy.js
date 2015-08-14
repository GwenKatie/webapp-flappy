// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var fireballs = [];
var score = 20;
var labelScore;
var timer = 30;


/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("backgroundImg", "../assets/castle.jpg");
    game.load.image("playerImg", "../assets/pink dragon.png");
    game.load.image("Fireball", "../assets/Fireball.png") ;
    game.load.audio("score", "../assets/point.ogg");
    game.load.audio("Small fireball", "../assets/Small fireball.mp3");
    game.load.spritesheet("storm", "../assets/storm/spritesheet.png", 500, 332);
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    var background = game.add.sprite(0, 0, "storm");
    background.frame = 0;
    background.width = 790;
    background.height = 400;
    background.animations.add("scroll", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 10, true);
    background.animations.play('scroll');

    x = game.rnd.integerInRange(0, 790);
    y = game.rnd.integerInRange(0, 400);
    player = game.add.sprite(x, y, "playerImg");
    player.width = 150;
    player.height = 150;

    game.physics.arcade.enable(player);

    splashDisplay = game.add.text(75,200, "Tap / click to face your doom", { font: "50px Arial", fill: "#bce8f1", align: "center" });


    // start game when click
    game.input
        .onDown
        .add(start);

    //
    //game.input
    //    .keyboard.addKey(Phaser.Keyboard.ENTER)
    //    .onDown.add(start);

}
function increaseScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}
function movingDragon(event) {
   var x = game.rnd.integerInRange(-50, 580);
   var y = game.rnd.integerInRange(-50, 150);
    player.x=x;
    player.y=y


}

function start () {


    // remove all click handlers set up so far
    game.input.onDown.removeAll();

    // set up new ones
    game.input
        .onDown
        .add(clickHandler);
    splashDisplay.destroy();


    game.input
        .onDown
        .add(clickFireball);

    game.physics.startSystem(Phaser.Physics.ARCADE);


    pipeInterval = 0.3;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        movingDragon);

    labelScore = game.add.text(20, 10, "20", { font: "65px Arial", fill: "#ffffff", align: "center" });

    // set the background colour of the scene
    timerEvent = game.time.events.loop(Phaser.Timer.SECOND, updateTimer);
    countDownText = game.add.text(700, 10, timer, { font: "40px Arial", fill: "#bce8f1", align: "center" });

}

function clickHandler(event) {

    var Fireball = game.add.sprite(event.x-50, event.y-50, "Fireball");
    Fireball.width = 35;
    Fireball.height = 35;

    if(fireballs.length>0){
        fireballs[0].destroy();
        fireballs.shift();
    }
    fireballs.push(Fireball);
    game.physics.arcade.enable(Fireball);

        //alert("Inside the if");}


}




function clickFireball(event) {
    game.sound.play("Small fireball");

}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

    if(fireballs.length>0) {
        var hasOverlap = game.physics.arcade
            .overlap(player,
            fireballs[0]);
        if (hasOverlap == true) {
            increaseScore();
            fireballs[0].body.velocity.y = 10000000;

        }
        else if (hasOverlap == false) {
            decreaseScore();
            fireballs[0].body.velocity.y = 10000000;
        }
        // fireballs[0].destroy();
        fireballs.shift();

    }
}

function decreaseScore() {
    score = score - 1;
    labelScore.setText(score.toString());
}

function updateTimer() {
    timer -= 1;
    countDownText.setText(timer);
    if(timer === -1) {
        game.time.events.remove(timerEvent);
        (gameOver())

    }}


function gameOver(){
    { alert("GAME OVER!!");
    game.destroy();
        $("#score").val(score.toString());
        $("#greeting").show();


}}

$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 5; i++) {
        $("#scoreBoard").append(
            "<li class=\"scoreBoard\">" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});