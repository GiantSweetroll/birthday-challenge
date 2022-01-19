// Game Manager class, controls several core aspects of the game
class GameManager {
    constructor(candleCount = 10, gameDuration = 300) {
        this.isMouseDown = false;       // Flag of whether the mouse is currently pressed down
        this.currentBlowStr = 0;        // The amount of blow strength the player currently has
        this.maxBlowStr = 100;          // The maximum amount of blow strength the player has (beyond this point it wont increase)
        this.blowStrIncr = 1;           // How fast the currentBlowStr increases as mouse is being pressed down
        this.blowSlider = null;         // The blow slider gui
        this.gameDuration = gameDuration;   // The duration of the game in seconds
        this.blowerPos = BABYLON.Vector3.Zero();        // Unused
        this.canBlow = true;                // Flag if the player can blow
        this.candleCount = candleCount;     // Amount of candles in the game to spawn
        this.shadowGenerators = [];         // List of ShadowGenerator
        this.isGameEnded = false;           // Flag that tells the state of the game
        this.activeCandlesCount = this.candleCount;     // Amount of candles left who still have flame
        this.guiAdvancedTexture = null;         // The Babylon GUI Advanced Texture
        this.timer = null;                  // Timer
        this.timeLeft = this.gameDuration;     // Amount of time left
        this.isInMenu = true;           // State whether the player is in the menu or not
    }

    // Increases the blow strength
    increaseBlowStr() {
        if (this.currentBlowStr < this.maxBlowStr) {
            this.currentBlowStr += this.blowStrIncr;
        }
    }

    // Decreases the blow strength
    decreaseBlowStr() {
        if (this.currentBlowStr > 0) {
            this.currentBlowStr -= this.blowStrIncr;
        }
    }

    // Resets attributes for new game
    reset() {
        this.timeLeft = this.gameDuration;
        this.currentBlowStr = 0;
        this.canBlow = true;
        this.isGameEnded = false;
        this.activeCandlesCount = this.candleCount;
    }

    // Method to show or hide the gameplay UI
    showGameplayWidgets(isVisible) {
        this.guiAdvancedTexture.getControlByName("MusicIcon").isVisible = isVisible;
        this.guiAdvancedTexture.getControlByName("Ellipse").isVisible = isVisible;
        this.guiAdvancedTexture.getControlByName("Timer").isVisible = isVisible;
        this.guiAdvancedTexture.getControlByName("Rectangle").isVisible = isVisible;
        this.guiAdvancedTexture.getControlByName("BlowSlider").isVisible = isVisible;
        this.guiAdvancedTexture.getControlByName("Button").isVisible = isVisible;
    }
}

// Class used to identify the Cake's material
class CakeMaterial {

    static objectName = "cakeMaterial";
    static texturePath = "./assets/models/Cake/textures/";

    /**
     * Randomize the Cake's material
     * @param {BABYLON.Scene} scene 
     * @returns 
     */
    static random(scene) {
        var num = Math.floor(getRandomArbitrary(0, 5));

        switch (num) {
            case 0:
                return this.vanillaCream(scene);
            
            case 1:
                return this.vanillaCream2(scene);

            case 2:
                return this.sponge(scene);

            case 3:
                return this.sponge2(scene);

            case 4:
                return this.sponge3(scene);
        }
    }

    /**
     * Vanilla cream texture
     * @param {BABYLON.Scene} scene 
     * @returns 
     */
    static vanillaCream(scene) {
        let textureName = "rFrosting_Vanilla_highres.png";
        let normalTextureName = "vanilla_normal.png";

        var material = new BABYLON.StandardMaterial(CakeMaterial.name, scene);
        material.diffuseTexture = new BABYLON.Texture(CakeMaterial.texturePath + textureName, scene);
        material.bumpTexture = new BABYLON.Texture(CakeMaterial.texturePath + normalTextureName, scene);
        material.roughness = 0;

        return material;
    }

    /**
     * Vanilla cream texture (variant 2)
     * @param {BABYLON.Scene} scene 
     * @returns 
     */
    static vanillaCream2(scene) {
        let textureName = "rFrosting_Vanilla_highres.png";
        let normalTextureName = "vanilla_normal.png";

        var material = new BABYLON.StandardMaterial(CakeMaterial.objectName, scene);
        material.diffuseTexture = new BABYLON.Texture(CakeMaterial.texturePath + textureName, scene);
        material.diffuseTexture.uScale = 5;
        material.diffuseTexture.vScale = 5;
        material.bumpTexture = new BABYLON.Texture(CakeMaterial.texturePath + normalTextureName, scene);
        material.roughness = 0;

        return material;
    }

    /**
     * Sponge cake material
     * @param {BABYLON.Scene} scene 
     * @returns 
     */
    static sponge(scene) {
        let textureName = "juniors-sponge-cake-crust.jpg";
        let normalTextureName = "spongecake_normal.png";

        var material = new BABYLON.StandardMaterial(CakeMaterial.objectName, scene);
        material.diffuseTexture = new BABYLON.Texture(CakeMaterial.texturePath + textureName, scene);
        material.bumpTexture = new BABYLON.Texture(CakeMaterial.texturePath + normalTextureName, scene);
        material.roughness = 0;

        return material;
    }

    /**
     * Sponge cake material (variant 2)
     * @param {BABYLON.Scene} scene 
     * @returns 
     */
    static sponge2(scene) {
        let textureName = "juniors-sponge-cake-crust.jpg";
        let normalTextureName = "spongecake_normal.png";

        var material = new BABYLON.StandardMaterial(CakeMaterial.objectName, scene);
        material.diffuseTexture = new BABYLON.Texture(CakeMaterial.texturePath + textureName, scene);
        material.diffuseTexture.uScale = 5;
        material.diffuseTexture.vScale = 5;
        material.bumpTexture = new BABYLON.Texture(CakeMaterial.texturePath + normalTextureName, scene);
        material.roughness = 0;

        return material;
    }

    /**
     * Sponge cake material (variant 3)
     * @param {BABYLON.Scene} scene 
     * @returns 
     */
    static sponge3(scene) {
        let textureName = "juniors-sponge-cake-crust.jpg";
        let normalTextureName = "spongecake_normal.png";

        var material = new BABYLON.StandardMaterial(CakeMaterial.objectName, scene);
        material.diffuseTexture = new BABYLON.Texture(CakeMaterial.texturePath + textureName, scene);
        material.diffuseTexture.uScale = 5;
        material.diffuseTexture.vScale = 10;
        material.bumpTexture = new BABYLON.Texture(CakeMaterial.texturePath + normalTextureName, scene);
        material.roughness = 0;

        return material;
    }
}

// Class that holds information regarding a Candle instance
class Candle {

    /**
     * Candle class constructor
     * @param {string} name - Key that identifies the candle
     * @param {BABYLON.TransformNode} meshGroup - TransformNode that groups the Candle's meshes
     * @param {int} maxThreshold - HP of the candle's fire
     */
    constructor(name, meshGroup, maxThreshold = 100) {
        this.isLit = true;      // Flag if the candle still has fire
        this.maxThreshold = maxThreshold;   // HP of the candle's fire
        this.currentStrength = this.maxThreshold;      // Amount of HP left for the candle's fire
        this.regenRate = 0.1;      // Increases the candle strength by this value every frame
        this.candleMeshGroup = meshGroup;
        this.name = name;
    }

    // Blow the candle
    blow(blowStr) {
        this.currentStrength -= blowStr;

        if (this.currentStrength <= 0) {
            this.currentStrength = 0;
            this.isLit = false;
        }
    }

    // Regenerate HP for the candle's fire
    regen() {
        if (this.currentStrength > 0 && this.currentStrength < this.maxThreshold) {
            this.currentStrength += this.regenRate;
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

// Unused
function blow(blower, cake, camera, scene) {
    cakeDims = cake.getBoundingInfo().boundingBox.extendSize;
    // Cast a ray to the cake
    // var origin = blower.position;
    var origin = camera.position;

    // Length of the ray
    var length = camera.radius * 2;

    // Initialize the ray direction
    // console.log("Camera position: " + camera.position);
    var blowTarget = new BABYLON.Vector3(
        ((camera.position.x - cake.getAbsolutePosition().x) * -1) + cake.getAbsolutePosition().x,
        ((camera.position.y - cake.getAbsolutePosition().y) * -1) + cake.getAbsolutePosition().y - cakeDims.y/2,
        ((camera.position.z - cake.getAbsolutePosition().z) * -1) + cake.getAbsolutePosition().z
    );
    var direction = blowTarget.subtract(origin);
    direction = BABYLON.Vector3.Normalize(direction);

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

// Unused
function vecToLocal(vector, mesh){
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;		 
}

/**
 * Create the scene
 * @param {*} engine 
 * @param {*} canvas 
 * @param {GameManager} gameManager 
 * @param {*} candles - Dictionary of Candle objects
 * @returns 
 */
var createScene = async function (engine, canvas, gameManager, candles) {
    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.1, 0);
    scene.collisionsEnabled = true;
    
    // Create TransformNode
    var cakeTransformNode = new BABYLON.TransformNode("cakeRoot", scene);       // Cake
    for (var i=0; i<gameManager.candleCount; i++) {
        var candleTransformNode = new BABYLON.TransformNode("Candle" + i, scene);       // Candle
    }

    for (var i=0; i<gameManager.candleCount; i++) {
        var fireRoot = new BABYLON.TransformNode("fireRoot" + i, scene);        // Fire
    }
    
    // Initialize audio
    var blowAudio = new BABYLON.Sound("blowAudio", "./assets/sound/blow.wav", scene);
    blowAudio.onEndedObservable = function() {
        blowAudio.setVolume(1);
    }

    // Load GUI
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await advancedTexture.parseFromSnippetAsync("#YXK7SU#26");
    gameManager.guiAdvancedTexture = advancedTexture;
    // Control blow slider
    let blowSlider = advancedTexture.getControlByName("BlowSlider");
    blowSlider.displayThumb = false;
    blowSlider.value = 0;

    // Initialize timer with a value
    let timerTextBlock = advancedTexture.getControlByName("Timer");
    timerTextBlock.text = convertTimeToString(gameManager.timeLeft);

    gameManager.blowSlider = blowSlider;

    // Unused
    var blower = BABYLON.Mesh.CreateBox("Blower", 0.25, scene);
    blower.isPickable = false;
    blower.position = new BABYLON.Vector3(2, 1, 0);
    blower.isVisible = false;

    // Register click events
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                // console.log("POINTER DOWN");
                gameManager.isMouseDown = true; // Update mouse state
                // moveBlower(blower, scene.pointerX, scene.pointerY, scene);
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                // console.log("POINTER UP");
                gameManager.isMouseDown = false;    // Update mouse state

                if (gameManager.canBlow && !gameManager.isGameEnded) {
                    var cake = scene.getMeshByName("Cake");
                    // blow(blower, cake, camera, scene);

                    // Prevent player from being able to cast another blow before slider resets
                    gameManager.canBlow = false;

                    // Play blow audio
                    blowAudio.setVolume((gameManager.currentBlowStr / 20) - 1);       
                    blowAudio.play();

                    // Get object picked by the player
                    pickingInfo = scene.pick(pointerInfo.event.x, pointerInfo.event.y);
                    pickedMesh = pickingInfo.pickedMesh;
                    if (pickedMesh != null) {
                        // let meshKey = pickedMesh.name.substring(0, 7);
                        // console.log(meshKey);
                        // console.log(pickedMesh.name);
                        if (pickedMesh.name.includes("Fire")) {
                            let key = pickedMesh.name.substring(4); // This is a number (i.e. 1, 4, 5)
                            // console.log(key);
                            
                            // Get candle instance
                            var candle = candles['Candle' + key];
                            if (candle.isLit) {
                                candle.blow(gameManager.currentBlowStr);

                                // Get the ratio of the candle's flame HP from its max threshold
                                let strengthRatio = candle.currentStrength / candle.maxThreshold;

                                // Update the scaling of the fire based on the candle's fire HP
                                var fireRoot = scene.getTransformNodeByName('fireRoot' + key);
                                fireRoot.scaling.x = 1 * strengthRatio;
                                fireRoot.scaling.z = 1 * strengthRatio;

                                // If candle strength is 0, update active candle count
                                if (candle.currentStrength == 0) {
                                    gameManager.activeCandlesCount -= 1;

                                    // If no more active candles, end the game
                                    if (gameManager.activeCandlesCount == 0) {
                                        let advancedTexture = gameManager.guiAdvancedTexture;
                                        let gameWin = advancedTexture.getControlByName("Win");
                                        gameWin.isVisible = true;
                                        gameManager.isGameEnded = true;
                                    }
                                }
                            }
                        }
                    }
                }

                break;
            // case BABYLON.PointerEventTypes.POINTERTAP:
            //     console.log("POINTER TAP");
            //     break;
        }
    });

    engine.enableOfflineSupport = false;

    var camera = createCamera(scene, canvas);

    // Hemispheric light
    var hemLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemLight.intensity = 0.5;
    // Point light
    var pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 30, -15), scene);
    pointLight.radius = 100;

    // Used to know where the light is (for debugging purposes)
    var lightSphere = BABYLON.Mesh.CreateSphere("lightSphere", 10, 2, scene);
    lightSphere.position = pointLight.position;
    lightSphere.material = new BABYLON.StandardMaterial("lightSphere", scene);
    lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    // Initialize shadow generator
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, pointLight);
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.useExponentialShadowMap = false;
    gameManager.shadowGenerators[0] = shadowGenerator;

    // Register events before frame render
    scene.registerBeforeRender(function () {
        // light.position = camera.position;
        let gameInstructions = gameManager.guiAdvancedTexture.getControlByName("Instructions");
        let gameInstructions2 = gameManager.guiAdvancedTexture.getControlByName("Instructions2");
        if (!gameManager.isGameEnded) {
            // Show game instructions
            gameInstructions.isVisible = true;
            gameInstructions2.isVisible = true;
            for (var i = 0; i < gameManager.candleCount; i++) {
                // Regenerate candle's fire HP and the fire's scaling as well
                var candle = candles['Candle' + i];
                candle.regen();     
                let strengthRatio = candle.currentStrength / candle.maxThreshold;
    
                var fireRoot = scene.getTransformNodeByName('fireRoot' + i);
                fireRoot.scaling.x =  1 * strengthRatio;
                fireRoot.scaling.z = 1 * strengthRatio;
            }
        } else {
            // Update game instructions visibility
            gameInstructions.isVisible = gameManager.isInMenu? true : false;
            gameInstructions2.isVisible = gameManager.isInMenu? true : false;
        }

        gameManager.showGameplayWidgets(!gameManager.isInMenu);
    });

    // Initialize timer
    var timer = window.setInterval(() => {
        updateTimer(timer, gameManager);
    }, 1000);
    gameManager.timer = timer;

    // scene.debugLayer.show();

    return scene;
}

/**
 * Initialize camera
 * @param {*} scene 
 * @param {*} canvas 
 * @returns BABYLON.ArcRotateCamera instance
 */
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
    camera.applyGravity = true;
    camera.checkCollisions = true;

    // Set the max rotation of the camera vertically
    camera.upperBetaLimit = BABYLON.Tools.ToRadians(95);
    camera.lowerBetaLimit = BABYLON.Tools.ToRadians(70);

    // Add controls
    camera.keysUp.push(87);     // W
    camera.keysDown.push(83);   // S
    camera.keysLeft.push(65);   // A
    camera.keysRight.push(68);  // D
    
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
var positionCandles = function(candles, scene, padding = 0.1) {
    let cakeRoot = scene.getTransformNodeByName("cakeRoot");
    let upperCream = scene.getMeshByName("upperCream");
    // Get the dimensions of the cake's upper cream
    let upperCreamDims = upperCream.getBoundingInfo().boundingBox.extendSize;
    upperCreamDims = new BABYLON.Vector3(
        upperCreamDims.x * cakeRoot.scaling.x,
        upperCreamDims.y * cakeRoot.scaling.y,
        upperCreamDims.z * cakeRoot.scaling.z
    );
    // Get cake position
    let cakePosition = upperCream.getAbsolutePosition();

    // Attempt to position candles
    for (var i = 0; i < Object.keys(candles).length; i++) {
        var key = "Candle" + i;
        var candle = scene.getMeshByName(key + '_Material1');
        var candleDims = candle.getBoundingInfo().boundingBox.extendSize;

        // Continue to try position candles randomly until there is no conflict
        collisionCheck:
        while (true) {
            // Set position of meshes
            let r = getRandomArbitrary(0, upperCreamDims.x - padding - candleDims.x);
            let theta = getRandomArbitrary(0, 2 * Math.PI);
            var newPos = new BABYLON.Vector3(
                r * Math.cos(theta) + cakePosition.x,
                cakePosition.y + candleDims.y + 1,
                r * Math.sin(theta) + cakePosition.z
            );

            // Update candle positions
            var transformNode = candles[key].candleMeshGroup;
            transformNode.position = newPos;
            transformNode.computeWorldMatrix();
            // Update position of mesh children
            transformNode._children.forEach(function(mesh) {
                mesh.computeWorldMatrix();
            });

            // Position fire
            let fireRoot = scene.getTransformNodeByName("fireRoot" + i);
            fireRoot.position = candle.getAbsolutePosition();
            fireRoot.position.y -= 0.08;

            // Check for collision
            for (var key2 in candles) {
                c = scene.getMeshByName(key2);
                if (c.name != key) {
                    if (candle.intersectsMesh(c, true)) {
                        // Randomize the candle position again
                        continue collisionCheck;
                    }
                }
            }
            break;
        }
    }
}

/**
 * Updates the timer display
 * @param {*} timer 
 * @param {GameManager} gameManager
 */
var updateTimer = function(timer, gameManager) {
    let gui = gameManager.guiAdvancedTexture;
    let timerTextBlock = gui.getControlByName("Timer");

    // If game hasn't ended, reduce the timer
    if (!gameManager.isGameEnded) {
        gameManager.timeLeft--;
        timerTextBlock.text = convertTimeToString(gameManager.timeLeft);
    }

    // Stop timer if game has ended
    if (gameManager.timeLeft <= 0 || gameManager.isGameEnded) {
        gameManager.isGameEnded = true;
        let advancedTexture = gameManager.guiAdvancedTexture;

        // Update which GUI elements to display/hide
        if (gameManager.activeCandlesCount > 0 && !gameManager.isInMenu) {
            let gameOver = advancedTexture.getControlByName("GameOverA");
            gameOver.isVisible = true;
            let play = gui.getControlByName("PlayButton");
            play.isVisible = true;
            let retry = gui.getControlByName("Button_button1");
            retry.text = "Retry";
        } else if (!gameManager.isInMenu) {
            let gameWin = gui.getControlByName("Win");
            let play = gui.getControlByName("PlayButton");
            play.isVisible = true;
            gameWin.isVisible = true;
            let retry = gui.getControlByName("Button_button1");
            retry.text = "Replay!";
        }

        // Clear timer
        window.clearInterval(timer);
    }

}

/**
 * Reset the game state
 * @param {*} scene 
 * @param {GameManager} gameManager
 * @param {*} candles - Dictionary of Candle objects
 */
var resetGame = function(scene, gameManager, candles) {
    var cake = scene.getMeshByName('Cake');
    var cakeLower = scene.getMeshByName('Cylinder');

    // Randomize cake material
    var cakeMat = CakeMaterial.random()
    cake.material = cakeMat
    cakeLower.material = cakeMat;

    // Change candle textures
    for (var i=0; i<gameManager.candleCount; i++) {
        let key = "Candle" + i;
        var candle = candles[key]
        candle.currentStrength = candle.maxThreshold;
        candle.isLit = true;

        var candleMat1 = scene.getMeshByName(key + "_Material1");
        candleMat1.material.diffuseColor = new BABYLON.Color3(
            Math.random(),
            Math.random(),
            Math.random()
        );

        var candleMat2 = scene.getMeshByName("Candle" + i + "_Material2");
        candleMat2.material.diffuseColor = new BABYLON.Color3(
            Math.random(),
            Math.random(),
            Math.random()
        );
    }

    // Reposition candles
    positionCandles(candles, scene);

    // Reset game manager
    gameManager.reset();

    // Reset timer
    window.clearInterval(gameManager.timer);
    let timerTextBlock = gameManager.guiAdvancedTexture.getControlByName('Timer');
    timerTextBlock.text = convertTimeToString(gameManager.timeLeft);
    var timer = window.setInterval(() => {
        updateTimer(timer, gameManager);
    }, 1000);
    gameManager.timer = timer;
}

var main = async function () {
    let gameManager = new GameManager(candleCount = 10, gameDuration = 300);
    gameManager.isGameEnded = true;     // Don't start the game at launch
    var canvas = document.getElementById("render");
    var engine = new BABYLON.Engine(canvas, true);
    var candles = {};
    var scene = await createScene(engine, canvas, gameManager, candles);

    /// Load meshes
    var assetsManager = new BABYLON.AssetsManager(scene);

    // Load setting
    var settingTask = assetsManager.addMeshTask("settingTask", "", "./assets/models/apartment/", "apartment-living-room.obj");
    settingTask.onSuccess = function(task) {
        task.loadedMeshes.forEach(function(mesh) {
            // console.log("Mesh name: " + mesh.name);
            // console.log(mesh);
            mesh.scaling = new BABYLON.Vector3(10, 10, 10);
            mesh.checkCollisions = true;
            mesh.receiveShadows = true;
        });

        // Add missing textures
        var sofaMat = new BABYLON.StandardMaterial("sofaMat", scene);
        sofaMat.diffuseTexture = new BABYLON.Texture("./assets/models/apartment/fabric_blend.jpg", scene);
        // sofaMat.bumpTexture = new BABYLON.Texture("./assets/models/apartment/rockwell_bump_normal.png", scene);
        scene.getMeshByName("Line001").material = sofaMat;

        var woodMat = new BABYLON.StandardMaterial("woodMat", scene);
        woodMat.diffuseTexture = new BABYLON.Texture("./assets/models/apartment/10233_001_Chesterfield_Oak_06.jpg", scene);
        scene.getMeshByName("Plane003").material = woodMat;

        var woodMat2 = new BABYLON.StandardMaterial("woodMat", scene);
        woodMat2.diffuseTexture = new BABYLON.Texture("./assets/models/apartment/w12.jpg", scene);
        scene.getMeshByName("Box008").material = woodMat2;
        scene.getMeshByName("Box009").material = woodMat2;
        scene.getMeshByName("Box010").material = woodMat2;
        scene.getMeshByName("Box011.001").material = woodMat2;

        var missingBookMat = new BABYLON.StandardMaterial("woodMat", scene);
        missingBookMat.diffuseTexture = new BABYLON.Texture("./assets/models/apartment/oblojka_04.jpg", scene);
        scene.getMeshByName("mesh_mm1").material = missingBookMat;

        // Add shadows
        var meshNames = [
            'Box022',
            'book4',
            'book_2',
            'mesh_mm1',
            'Box013',
            'Box012',
            'Line001',
            'Box011',
            'Cylinder110',
            'Cylinder111',
            'Box023',
            'Box012.002',
            'Object063'
        ];
        meshNames.forEach(function(meshName) {
            gameManager.shadowGenerators[0].addShadowCaster(scene.getMeshByName(meshName));
        });
    }

    // Load animation task
    var animTask = assetsManager.addMeshTask("animTask", "", "./assets/models/", "Clapping.glb", scene);
    animTask.onSuccess = function(task) {
        const clapAnim = scene.getAnimationGroupByName("Armature|mixamo.com|Layer0");

        // Start the animation
        clapAnim.start(true, 1.0, clapAnim.from, clapAnim.to, false);

        // Update mesh position and scaling
        task.loadedMeshes.forEach(function(mesh) {
            mesh.position.x += 3;
            mesh.position.z -= 5;
            mesh.scaling.scaleInPlace(0.09);
            mesh.name = "Animation";
        });
    }

    // Load fire
    for (var a=0; a<gameManager.candleCount + 1; a++) {
        var fireCount = -1;
        var fireTask = assetsManager.addMeshTask("fireTask" + a, "", "./assets/models/", "Fire.obj");
        fireTask.onSuccess = function(task) {
            fireCount++;
            var transformNode = scene.getTransformNodeByName("fireRoot" + fireCount);
            
            // var material = new BABYLON.StandardMaterial("FireMaterial", scene);
            // material.diffuseColor = new BABYLON.Color4.FromHexString("#FD6304FF");

            // Apply shaders
            var shaderMaterial = new BABYLON.ShaderMaterial("shaderMaterial", scene, {
                vertexElement: "vertexShaderCode",
                fragmentElement: "fragmentShaderCode",
            }, {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
            });
            shaderMaterial.setTexture("textureSampler", new BABYLON.Texture('./assets/models/candle_colors/6.jpg', scene));

            // Apply material to meshes
            task.loadedMeshes.forEach(function(mesh) {
                mesh.material = shaderMaterial;
                mesh.name = 'Fire' + fireCount;
                // console.log("Fire mesh: " + mesh.name);
                if (!mesh.parent) {
                    mesh.parent = transformNode;
                }
            });
            transformNode.position = new BABYLON.Vector3(3, 0, 5);
        }
    }
    // Load Cake
    var cakeTask = assetsManager.addMeshTask("cakeTask", "", "./assets/models/Cake/", "cake.babylon");
    cakeTask.onSuccess = function(task) {
        var transformNode = scene.getTransformNodeByName("cakeRoot");
        // console.log("Success");
        var cakeMat = CakeMaterial.random(scene);

        task.loadedMeshes.forEach(function(mesh) {
            mesh.isPickable = true;
            mesh.receiveShadows = true;

            let name = mesh.name;
            gameManager.shadowGenerators[0].addShadowCaster(mesh);      // Allow shadow casting

            // Update material names and texture material
            if (name.includes("Cylinder")) {
                mesh.material = cakeMat;
                if (name == "Cylinder1") {
                    mesh.name = "Cake";
                }
            } else {
                var material = new BABYLON.StandardMaterial("ringMaterial", scene);
                material.diffuseTexture = new BABYLON.Texture("./assets/models/Cake/textures/istockphoto-496820040-612x612.jpg", scene);
                material.roughness = 0;

                if (name == "Torus2") {
                    mesh.name = "upperCream";
                } else {
                    // Don't apply normal maps to the upper cream, as it will turn really dark
                    material.bumpTexture = new BABYLON.Texture("./assets/models/Cake/textures/chocolate_normal.png", scene);
                }
                
                mesh.material = material;
            }
            
            if (!mesh.parent) {
                mesh.parent = transformNode;
            }
        });

        // Reduce scale of the mesh
        transformNode.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);

        // Position meshes (to be on top of table)
        transformNode.position = new BABYLON.Vector3(3, 5.75, 5);
    }

    // Load Candles
    var loadedCandlesCount = 0;
    for (var a=0; a<gameManager.candleCount; a++) {
        var candleTask = assetsManager.addMeshTask("candleTask" + a, "", "./assets/models/", "Candle.obj");
        // var candleTask = assetsManager.addMeshTask("candleTask" + a, "", "./assets/models/candle/2/", "candle.babylon");
        candleTask.onSuccess = function(task) {
            var transformNode = scene.getTransformNodeByName("Candle" + loadedCandlesCount);
            var name = "Candle" + loadedCandlesCount;
            loadedCandlesCount++;

            for (var i=0; i < task.loadedMeshes.length; i++) {
                var mesh = task.loadedMeshes[i];
                // gameManager.shadowGenerators[0].addShadowCaster(mesh);
                // console.log("Name: " + mesh.name);

                // Update mesh texture material and name
                if (mesh.name.includes('Candle') && mesh.name.includes('Material')) {
                    var material = new BABYLON.StandardMaterial("material", scene);
                    material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
                    mesh.material = material;
                    mesh.name = mesh.name.includes('006')? name + '_Material1' : name + '_Material2';
                } else if (mesh.name.includes('Fuse')) {
                    mesh.name = name + "_Fuse" + mesh.name.includes('Material')? '_Material' : '';
                } else {
                    mesh.name = name;
                }

                mesh.isPickable = true;

                if (!mesh.parent) {
                    mesh.parent = transformNode;
                }
            }

            // Create Candle object
            var candleObject = new Candle(
                name,
                transformNode
            )

            // Add to dictionary
            candles[name] = candleObject;
        }
    }

    // Set callback after asset loading has finished
    assetsManager.onFinish = function(tasks) {
        var cake = scene.getMeshByName("Cake");

        // Remove obstructing mesh on the table
        scene.getMeshByName("decoration_set_002").dispose();

        // Update camera position
        var camera = scene.activeCamera;
        camera.target = cake.getAbsolutePosition();
        camera.target.y = cake.getAbsolutePosition().y + 1;
        camera.position = cake.getAbsolutePosition();
        camera.radius = 5;

        // Position candles
        positionCandles(candles, scene);

        // Play background music
        var bgMusic = new BABYLON.Sound("bgMusic", "./assets/sound/happybirthday.ogg", scene, null, {
            loop: true,
            autoplay: true,
        })

        // Get reference to GUI
        let gui = scene.getTextureByName("GUI");
        if (gui != null) {
            var iconsFolder = "./assets/icons/";
            // Menu screen
            let gameTitle = gui.getControlByName("Title");
            let rectangleMenu = gui.getControlByName("RectangleMenu");
            let button = gui.getControlByName("Button");
            let play = gui.getControlByName("PlayButton");
            let gameOver = gui.getControlByName("GameOverA");
            let gameWin = gui.getControlByName("Win");
            let retry = gui.getControlByName("Button_button1");
            let gameInstructions = gui.getControlByName("Instructions");
            let gameInstructions2 = gui.getControlByName("Instructions2");
            let menuRectangle = gui.getControlByName("RectangleMenu");
            gameOver.isVisible = false;
            gameWin.isVisible = false;

            // Register events when GUI button is pressed
            // Menu button is pressed
            button.onPointerDownObservable.add(function(event) {
                retry.text = "Play";
                gameTitle.isVisible = true;
                rectangleMenu.isVisible = true;
                play.isVisible = true;
                gameWin.isVisible = false;
                gameOver.isVisible = false;
                gameManager.isInMenu = true;
                gameManager.isGameEnded = true;     // Stop the game
                gameInstructions.isVisible = true;
                gameInstructions2.isVisible = true;
            });

            // Play button is pressed
            play.onPointerDownObservable.add(function(event) {
                resetGame(scene, gameManager, candles);
                gameTitle.isVisible = false;
                rectangleMenu.isVisible = false;
                play.isVisible = false;
                button.isVisible = true;
                gameManager.isInMenu = false;
                gameWin.isVisible = false;
                gameOver.isVisible = false;
                gameInstructions.isVisible = true;
                gameInstructions2.isVisible = true;
            });

            // Manage bg music control
            let musicImage = gui.getControlByName("MusicIcon");
            let ellipse = gui.getControlByName("Ellipse");
            var musicOn = true;
            // Mute/unmute background music when control is clicked
            musicImage.onPointerDownObservable.add(function(event) {
                musicOn = !musicOn;
                bgMusic.setVolume(musicOn? 1 : 0);
                musicImage.source = musicOn? iconsFolder + "music_on.png" : iconsFolder + "music_off.png";
            });
            ellipse.onPointerDownObservable.add(function(event) {
                musicOn = !musicOn;
                bgMusic.setVolume(musicOn? 1 : 0);
                musicImage.source = musicOn? iconsFolder + "music_on.png" : iconsFolder + "music_off.png";
            });
        }

        // Run engine loop
        engine.runRenderLoop(function () {
            if (!gameManager.isGameEnded) {
                if (gameManager.isMouseDown && gameManager.canBlow) {
                    gameManager.increaseBlowStr();      // Increase player's blow strength
                } else {
                    gameManager.decreaseBlowStr();      // Decrease player's blow strength if mouse is not held
                }
                // Update blow slider
                gameManager.blowSlider.value = gameManager.currentBlowStr;

                // Can only blow when slider reaches 0 again
                if (gameManager.currentBlowStr == 0) {
                    gameManager.canBlow = true;
                }
            }
    
            scene.render();
        });
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }

    assetsManager.load();
}

main();