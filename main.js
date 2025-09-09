const { Color3, Camera2D, Screen, Scene2D, print, Sprite2D, Vector2D, Texture2D, Animation2D, loadKeyframesFromTilemap, Camera2DController} = hzrender;

let screen = new Screen();
let scene_main = new Scene2D();
screen.add_scene(scene_main);

let dogImage = new Image();
dogImage.src = "assets/shadow_dog.png";

let frames = loadKeyframesFromTilemap(dogImage, 575, 523, 7, 0);
let runAnim = new Animation2D(frames, 120, true);

let player = new Sprite2D(new Vector2D(100, 100));
player.add_animation("run", runAnim);
player.play_animation("run");

scene_main.add_sprite(player);

screen.background = "white"

new Camera2DController(scene_main, screen, true);

function loop(deltaTime) {

}

let lastTime = 0;
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    loop(deltaTime)

    screen.render(deltaTime);
    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);
