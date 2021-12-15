class GameManager {
    constructor(gameDuration = 300) {
        this.isMouseDown = false;
        this.currentBlowStr = 0;
        this.maxBlowStr = 100;
        this.blowStrIncr = 1;
        this.blowSlider = null;
        this.gameDuration = gameDuration;
        this.blowerPos = BABYLON.Vector3.Zero();
    }

    increaseBlowStr() {
        if (this.currentBlowStr < this.maxBlowStr) {
            this.currentBlowStr += this.blowStrIncr;
        }
    }

    decreaseBlowStr() {
        if (this.currentBlowStr > 0) {
            this.currentBlowStr -= this.blowStrIncr;
        }
    }
}

class Candle {
    constructor(candleMesh, maxThreshold = 100) {
        this.isLit = true;
        this.maxThreshold = maxThreshold;
        this.currentStrength = this.maxThreshold;
        this.regenRate = 0.1;      // Increases the candle strength by this value every frame
        this.mesh = candleMesh;
    }

    blow(blowStr) {
        this.currentStrength -= blowStr;

        if (this.currentStrength <= 0) {
            this.isLit = false;
        }
    }

    regen() {
        this.currentStrength += this.regenRate;
    }
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * 
 * From: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Get a string representation of time.
 * 
 * @param {number} seconds 
 * @returns string
 */
function convertTimeToString(seconds) {
    sec = Math.floor(seconds % 60).toString();
    minutes = Math.floor(seconds / 60).toString();

    if (minutes.length == 1) {
        minutes = '0' + minutes;
    }

    if (sec.length == 1) {
        sec = '0' + sec;
    }

    return minutes + ':' + sec;
}

/**
 * Calculates the position of the blower.
 * 
 * @param {Mesh} blower
 * @param {number} mousex 
 * @param {number} mousey
 * @param {Scene} scene 
 */
function moveBlower(blower, mousex, mousey, scene) {
    // Cast a ray to mouse position
    var pickResult = scene.pick(mousex, mousey);
    // console.log(pickResult.ray.origin.x + ', ' + pickResult.ray.origin.y + ', ' + pickResult.ray.origin.z);

    // Place blower at the place of the ray origin.
    blower.position = pickResult.ray.origin;
}

function blow(blower, cake, camera, scene) {
    cakeDims = cake.getBoundingInfo().boundingBox.extendSize;
    // Cast a ray to the cake
    var origin = blower.position;

    var blowPosition = new BABYLON.Vector3(cake.position.x, cake.position.y, cake.position.z);
    blowPosition.y += cakeDims.y;

    var direction = blowPosition.subtract(origin);
    direction = BABYLON.Vector3.Normalize(direction);

    var length = camera.radius;

    var ray = new BABYLON.Ray(origin, direction, length)

    var rayHelper = new BABYLON.RayHelper(ray);
    rayHelper.show(scene);

    // Pick mesh
    var hit = scene.pickWithRay(ray);
    if (hit.pickedMesh) {
        console.log(hit.pickedMesh.name);
    }
}

function vecToLocal(vector, mesh){
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;		 
}

var createScene = async function (engine, canvas, gameManager) {
    var scene = new BABYLON.Scene(engine);

    // Load GUI
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await advancedTexture.parseFromSnippetAsync("#YXK7SU#4");

    let blowSlider = advancedTexture.getControlByName("BlowSlider");
    blowSlider.displayThumb = false;
    blowSlider.value = 0;

    var currentDuration = gameManager.gameDuration;
    let timerTextBlock = advancedTexture.getControlByName("Timer");
    timerTextBlock.text = convertTimeToString(currentDuration);

    gameManager.blowSlider = blowSlider;

    var blower = BABYLON.Mesh.CreateBox("Blower", 0.25, scene);
    blower.isPickable = false;
    blower.position = new BABYLON.Vector3(2, 1, 0);

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                // console.log("POINTER DOWN");
                gameManager.isMouseDown = true;
                moveBlower(blower, scene.pointerX, scene.pointerY, scene);
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                // console.log("POINTER UP");
                gameManager.isMouseDown = false;

                pickingInfo = scene.pick(pointerInfo.event.x, pointerInfo.event.y);
                pickedMesh = pickingInfo.pickedMesh;
                
                if (pickedMesh != null) {
                    console.log(pickedMesh.name);
                }

                blow(blower, cake, camera, scene);

                break;
            // case BABYLON.PointerEventTypes.POINTERTAP:
            //     console.log("POINTER TAP");
            //     break;
        }
    });

    engine.enableOfflineSupport = false;

    // var cake = BABYLON.SceneLoader.ImportMesh(
    //     "", 
    //     "./assets/models/", 
    //     "BirthdayCake.obj",
    //     scene,
    //     function(newMeshes) {
    //     }
    // );
    var cake = BABYLON.Mesh.CreateBox("FakeCake", 1.0, scene);
    cake.position = BABYLON.Vector3.Zero();
    cake.isPickable = false;

    candles = createCandles(cake, 10, scene);

    var camera = createCamera(cake, scene, canvas);

    var light = new BABYLON.PointLight(
        "pointLight",
        new BABYLON.Vector3(0, 20, 0),
        scene
    );
    // light.parent = camera;
    light.intensity = 0.5;

    scene.registerBeforeRender(function () {
        light.position = camera.position;
    });

    var timer = window.setInterval(() => {
        currentDuration--;
        timerTextBlock.text = convertTimeToString(currentDuration);

        if (currentDuration <= 0) {
            // TODO: Stop game
            window.clearInterval(timer);
        }

    }, 1000);

    return scene;
}

/**
 * Creates n amount of candles on top of the cake
 * 
 * @param {Mesh} cake 
 * @param {float} count 
 * @param {Scene} scene 
 */
var createCandles = function (cake, count, scene) {
    cakeDims = cake.getBoundingInfo().boundingBox.extendSize;

    const candles = [];
    const padding = 0.001;

    for (i = 0; i < count; i++) {
        var candle = BABYLON.Mesh.CreateBox("Candle" + i, 1, scene);
        var candleObj = new Candle(candle);
        candles[i] = candleObj;

        // Candle material
        var material = new BABYLON.StandardMaterial("candleMat", scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 1);

        // candle.showBoundingBox = true;
        candle.material = material;
        candle.edgesColor = new BABYLON.Color3(125, 122, 234);
        candle.isPickable = true;
        candle.scaling = new BABYLON.Vector3(0.1, 0.25, 0.1);
        candleDims = candle.getBoundingInfo().boundingBox.extendSize;

        minBoundaries = new BABYLON.Vector3(
            cakeDims.x - candle.scaling.x / 2 - padding,
            candleDims.y + candle.scaling.y / 2,
            cakeDims.z - candle.scaling.z / 2 - padding
        )
        maxBoundaries = new BABYLON.Vector3(
            padding + candle.scaling.x / 2 - cakeDims.x,
            candleDims.y + candle.scaling.y / 2,
            padding + candle.scaling.z / 2 - cakeDims.z
        )

        collisionCheck:
        while (true) {
            candle.position = new BABYLON.Vector3(
                getRandomArbitrary(minBoundaries.x, maxBoundaries.x),
                getRandomArbitrary(minBoundaries.y, maxBoundaries.y),
                getRandomArbitrary(minBoundaries.z, maxBoundaries.z)
            );
            candle.computeWorldMatrix();

            // Check for collision
            for (a = 0; a < candles.length; a++) {
                c = candles[a].mesh;
                if (c.name != candle.name) {
                    if (candle.intersectsMesh(c, false)) {
                        console.log('Collision!');
                        // Randomize the candle position again
                        continue collisionCheck;
                    }
                }
            }
            break;
        }
    }

    return candles;
}

var createCamera = function (cake, scene, canvas) {
    var camera = new BABYLON.ArcRotateCamera(
        "camera",
        // BABYLON.Tools.ToRadians(40),
        BABYLON.Tools.ToRadians(0),
        BABYLON.Tools.ToRadians(90),
        5.0,       // Radius
        cake.position,
        scene
    );
    camera.position.y -= 3;
    camera.attachControl(canvas, true);

    // Add controls
    // camera.keysUp.push(87);     // W
    // camera.keysDown.push(83);   // S
    camera.keysLeft.push(65);   // A
    camera.keysRight.push(68);  // D

    return camera;
}

var main = async function () {
    // Main Process
    let gameManager = new GameManager(gameDuration = 300);
    var canvas = document.getElementById("render");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = await createScene(engine, canvas, gameManager);

    engine.runRenderLoop(function () {
        // console.log(gameManager.currentBlowStr);
        if (gameManager.isMouseDown) {
            gameManager.increaseBlowStr();
        } else {
            gameManager.decreaseBlowStr();
        }
        gameManager.blowSlider.value = gameManager.currentBlowStr;

        scene.render();
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
}

main();