class GameManager {
    constructor() {
        this.isMouseDown = false;
        this.currentBlowStr = 0;
        this.maxBlowStr = 100;
        this.blowStrIncr = 1;
        this.blowSlider = null;
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

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * 
 * From: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var createScene = async function (engine, canvas, gameManager) {
    var scene = new BABYLON.Scene(engine);

    // Load GUI
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await advancedTexture.parseFromSnippetAsync("#YXK7SU#3");

    let blowSlider = advancedTexture.getControlByName("BlowSlider");
    blowSlider.displayThumb = false;
    blowSlider.value = 0;

    gameManager.blowSlider = blowSlider;

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                // console.log("POINTER DOWN");
                gameManager.isMouseDown = true;
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                // console.log("POINTER UP");
                gameManager.isMouseDown = false;
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

    candles = createCandles(cake, 10, scene);

    var camera = createCamera(cake, scene, canvas);

    var light = new BABYLON.PointLight(
        "pointLight",
        new BABYLON.Vector3(0, 20, 0),
        scene
    );
    // light.parent = camera;
    // light.intensity = 2.5;

    scene.registerBeforeRender(function () {
        light.position = camera.position;
    });

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
        candles[i] = candle;

        candle.showBoundingBox = true;
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
                c = candles[a];
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
        BABYLON.Tools.ToRadians(40),
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
    let gameManager = new GameManager();
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