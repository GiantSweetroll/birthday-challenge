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
    constructor(name, meshes, maxThreshold = 100) {
        this.isLit = true;
        this.maxThreshold = maxThreshold;
        this.currentStrength = this.maxThreshold;
        this.regenRate = 0.1;      // Increases the candle strength by this value every frame
        this.meshes = meshes;
        this.name = name;
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
    cakeDims = cake.getBoundingInfo().boundingBox.extendSize.scale(2);
    // Cast a ray to the cake
    var origin = blower.position;

    // Initialize the ray direction
    var blowTarget = new BABYLON.Vector3(cake.position.x, cake.position.y, cake.position.z);
    blowTarget.x += camera.position.x/2 * -1;
    blowTarget.y = 1;
    blowTarget.z += camera.position.z/2 * -1;
    var direction = blowTarget.subtract(origin);
    direction = BABYLON.Vector3.Normalize(direction);

    // Length of the ray
    var length = camera.radius + cake.scaling.x/2;

    // Create picker ray
    var ray = new BABYLON.Ray(origin, direction, length)

    // Create visual aid for the ray
    var rayHelper = new BABYLON.RayHelper(ray);
    rayHelper.show(scene);

    // Pick mesh
    var hit = scene.pickWithRay(ray);
    if (hit.pickedMesh) {
        if (hit.pickedMesh.name != "CakeMaterial") {
            let meshKey = hit.pickedMesh.name.substring(0, 7);
            console.log(meshKey);
            // TODO: Reduce candle threshold
        }
    }
}

function vecToLocal(vector, mesh){
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;		 
}

var createScene = async function (engine, canvas, gameManager) {
    var scene = new BABYLON.Scene(engine);

    // Initialize audio
    var blowAudio = new BABYLON.Sound("blowAudio", "./assets/sound/blow.wav", scene);

    // Load GUI
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await advancedTexture.parseFromSnippetAsync("#YXK7SU#6");

    // Control blow slider
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
    blower.isVisible = false;

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
                var cake = scene.getMeshByName("Cake");

                // pickingInfo = scene.pick(pointerInfo.event.x, pointerInfo.event.y);
                // pickedMesh = pickingInfo.pickedMesh;
                
                // if (pickedMesh != null) {
                //     let meshKey = pickedMesh.name.substring(0, 7);
                //     console.log(meshKey);
                // }

                blow(blower, cake, camera, scene);

                // Play blow audio
                blowAudio.play();

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
    // var cake = BABYLON.Mesh.CreateBox("FakeCake", 1.0, scene);
    // cake.position = BABYLON.Vector3.Zero();
    // cake.isPickable = false;

    var camera = createCamera(scene, canvas);

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

var createCamera = function (scene, canvas) {
    var camera = new BABYLON.ArcRotateCamera(
        "camera",
        // BABYLON.Tools.ToRadians(40),
        BABYLON.Tools.ToRadians(0),
        BABYLON.Tools.ToRadians(90),
        5.0,       // Radius
        BABYLON.Vector3.Zero(),
        scene
    );
    // camera.position.y -= 3;
    camera.attachControl(canvas, true);

    // Add controls
    camera.keysUp.push(87);     // W
    camera.keysDown.push(83);   // S
    camera.keysLeft.push(65);   // A
    camera.keysRight.push(68);  // D
    
    // console.log(camera.inputs.attached);
    // Deactivate mouse control on camera
    camera.inputs.attached.pointers.detachControl();
    // Deactivate mousewheel control
    camera.inputs.attached.mousewheel.detachControl();

    return camera;
}

/**
 * Setup the position of the candles (randomly placed) on top of the cake
 * @param {Mesh} cake - The mesh of the cake model 
 * @param {dict} candles -  A dictionary of Candle objects 
 * @param {Scene} scene - Babylon Scene object
 */
var positionCandles = function(cake, candles, scene) {
    const padding = 0.05;
    for (var key in candles) {
        var candle = scene.getMeshByName(key + "_Circle.008_Material.006");
        // candle.showBoundingBox = true;
        // candle.scaling = new BABYLON.Vector3(0.1, 0.25, 0.1);
        // candleDims = candle.getBoundingInfo().boundingBox.extendSize;

        minBoundaries = new BABYLON.Vector3(
            0 - cake.scaling.x/4 - candle.scaling.x / 2 + padding,
            // 0 - candle.scaling.y/2,
            0,
            0 - cake.scaling.z/4 - candle.scaling.z / 2 + padding
        )
        maxBoundaries = new BABYLON.Vector3(
            0 + padding - candle.scaling.x / 2 + cake.scaling.x/2,
            // 0 - candle.scaling.y/2,
            0,
            0 + padding - candle.scaling.z / 2 + cake.scaling.z/2
        )

        collisionCheck:
        while (true) {
            // Set position of meshes
            var newPos = new BABYLON.Vector3(
                getRandomArbitrary(minBoundaries.x, maxBoundaries.x),
                getRandomArbitrary(minBoundaries.y, maxBoundaries.y),
                getRandomArbitrary(minBoundaries.z, maxBoundaries.z)
            );
            candles[key].meshes.forEach(function(value) {
                value.position = newPos;
                value.computeWorldMatrix();
            });

            // Check for collision
            for (var key2 in candles) {
                c = scene.getMeshByName(key2 + "_Circle.008_Material.006");
                if (c.name != candle.name) {
                    if (candle.intersectsMesh(c, false)) {
                        console.log('Collision!');      // TODO: Remove during production phase
                        // Randomize the candle position again
                        continue collisionCheck;
                    }
                }
            }
            break;
        }
    }
}

var main = async function () {
    // Main Process
    let gameManager = new GameManager(gameDuration = 300);
    var canvas = document.getElementById("render");
    var engine = new BABYLON.Engine(canvas, true);
    var candles = {};
    var scene = await createScene(engine, canvas, gameManager);

    /// Load meshes
    var assetsManager = new BABYLON.AssetsManager(scene);

    // Load Cake
    var cakeTask = assetsManager.addMeshTask("cakeTask", "", "./assets/models/", "CakeNoCandle.obj");
    cakeTask.onSuccess = function(task) {
        task.loadedMeshes.forEach(function(mesh) {
            mesh.isPickable = false;

            let name = mesh.name;
            // Rename meshes
            if (name.length >= 8 && name.substring(0, 8) == "Cylinder") {
                if (name.length > 8) {
                    mesh.name = "CakeMaterial";
                    mesh.isPickable = true;
                } else {
                    mesh.name = "Cake";
                }
            } else if (name.length >= 5 && name.substring(0, 5) == "Plane") {
                if (name.length > 5) {
                    mesh.name = "FlowersMateriale";
                } else {
                    mesh.name = "Flowers";
                }
            } else if (name.length >= 13 && name.substring(0, 13) == "Icosphere.001") {
                if (name.length > 13) {
                    mesh.name = "BottomCreamMateriale";
                } else {
                    mesh.name = "BottomCream";
                }
            } else if (name.substring(0, 5) != "Plate") {
                if (name.length > 9) {
                    mesh.name = "TopCreamMaterial";
                } else {
                    mesh.name = "TopCream";
                }
            }
        });
    }

    // Load Candles
    let candleCount = 10;
    var loadedCandlesCount = 0;
    for (var a=0; a<candleCount; a++) {
        var candleTask = assetsManager.addMeshTask("candleTask" + a, "", "./assets/models/", "Candle.obj");
        candleTask.onSuccess = function(task) {
            var name = "Candle" + loadedCandlesCount;
            loadedCandlesCount++;

            for (var i=0; i < task.loadedMeshes.length; i++) {
                var mesh = task.loadedMeshes[i];
                // console.log("Name:" + mesh.name);
                
                if (mesh.name != "Candle2_Circle.008" || mesh.name == "Fuse2_Circle.007") {
                    var material = new BABYLON.StandardMaterial("material", scene);
                    var num = Math.floor(getRandomArbitrary(1, 6));     // Randomize texture
                    material.diffuseTexture = new BABYLON.Texture("./assets/models/candle_colors/" + num + ".jpg", scene);
                    mesh.material = material;
                    mesh.name = name + mesh.name.substring(7)
                    mesh.isPickable = true;
                } else if (mesh.name == "Fuse2_Circle.007" || mesh.name == "Fuse2_Circle.007_Material.007") {
                    mesh.name = "Fuse" + a + mesh.name.substring(5);
                    mesh.isPickable = false;
                } else {
                    mesh.name = name;
                    mesh.isPickable = true;
                }
            }

            // Create Candle object
            var candleObject = new Candle(
                name,
                task.loadedMeshes
            )

            // Add to dictionary
            candles[name] = candleObject;
        }
    }

    assetsManager.onFinish = function(tasks) {
        // console.log(tasks);
        // Place candles
        var cake = scene.getMeshByName("Cake");
        // cakeDims = cake.getBoundingInfo().boundingBox.extendSize;

        // Update camera position
        var camera = scene.activeCamera;
        camera.target = cake.position;
        camera.target.y = 1;

        // Position candles
        positionCandles(cake, candles, scene);

        // Play background music
        var bgMusic = new BABYLON.Sound("bgMusic", "./assets/sound/happybirthday.ogg", scene, null, {
            loop: true,
            autoplay: true,
        })

        // Get reference to GUI
        let gui = scene.getTextureByName("GUI");
        if (gui != null) {
            var iconsFolder = "./assets/icons/";
            // Manage bg music control
            let musicImage = gui.getControlByName("MusicIcon");
            var musicOn = true;
            musicImage.onPointerDownObservable.add(function(event) {
                musicOn = !musicOn;
                bgMusic.setVolume(musicOn? 1 : 0);
                musicImage.source = musicOn? iconsFolder + "music_on.png" : iconsFolder + "music_off.png";
            });
        }

        // Run engine loop
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

    assetsManager.load();
}

main();