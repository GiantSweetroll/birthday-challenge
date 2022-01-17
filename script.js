class GameManager {
    constructor(candleCount = 10, gameDuration = 300) {
        this.isMouseDown = false;
        this.currentBlowStr = 0;
        this.maxBlowStr = 100;
        this.blowStrIncr = 1;
        this.blowSlider = null;
        this.gameDuration = gameDuration;
        this.blowerPos = BABYLON.Vector3.Zero();
        this.canBlow = true;
        this.candleCount = candleCount;
        this.shadowGenerators = [];
        this.isGameEnded = false;
        this.activeCandlesCount = this.candleCount;
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

class CakeMaterial {

    static objectName = "cakeMaterial";
    static texturePath = "./assets/models/Cake/textures/";

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

    static vanillaCream(scene) {
        let textureName = "rFrosting_Vanilla_highres.png";
        let normalTextureName = "vanilla_normal.png";

        var material = new BABYLON.StandardMaterial(CakeMaterial.name, scene);
        material.diffuseTexture = new BABYLON.Texture(CakeMaterial.texturePath + textureName, scene);
        material.bumpTexture = new BABYLON.Texture(CakeMaterial.texturePath + normalTextureName, scene);
        material.roughness = 0;

        return material;
    }

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

    static sponge(scene) {
        let textureName = "juniors-sponge-cake-crust.jpg";
        let normalTextureName = "spongecake_normal.png";

        var material = new BABYLON.StandardMaterial(CakeMaterial.objectName, scene);
        material.diffuseTexture = new BABYLON.Texture(CakeMaterial.texturePath + textureName, scene);
        material.bumpTexture = new BABYLON.Texture(CakeMaterial.texturePath + normalTextureName, scene);
        material.roughness = 0;

        return material;
    }

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

class Candle {
    constructor(name, meshGroup, maxThreshold = 100) {
        this.isLit = true;
        this.maxThreshold = maxThreshold;
        this.currentStrength = this.maxThreshold;
        this.regenRate = 0.1;      // Increases the candle strength by this value every frame
        this.candleMeshGroup = meshGroup;
        this.name = name;
    }

    blow(blowStr) {
        this.currentStrength -= blowStr;

        if (this.currentStrength <= 0) {
            this.currentStrength = 0;
            this.isLit = false;
        }
    }

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

function vecToLocal(vector, mesh){
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;		 
}

var createScene = async function (engine, canvas, gameManager, candles) {
    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.1, 0);
    scene.collisionsEnabled = true;
    
    // Create TransformNode
    var cakeTransformNode = new BABYLON.TransformNode("cakeRoot", scene);
    for (var i=0; i<gameManager.candleCount; i++) {
        var candleTransformNode = new BABYLON.TransformNode("Candle" + i, scene);
    }

    for (var i=0; i<gameManager.candleCount; i++) {
        var fireRoot = new BABYLON.TransformNode("fireRoot" + i, scene);
    }
    
    // Initialize audio
    var blowAudio = new BABYLON.Sound("blowAudio", "./assets/sound/blow.wav", scene);
    blowAudio.onEndedObservable = function() {
        blowAudio.setVolume(1);
    }

    // Load GUI
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await advancedTexture.parseFromSnippetAsync("#YXK7SU#9");

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
                // moveBlower(blower, scene.pointerX, scene.pointerY, scene);
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                // console.log("POINTER UP");
                gameManager.isMouseDown = false;

                if (gameManager.canBlow && !gameManager.isGameEnded) {
                    var cake = scene.getMeshByName("Cake");
                    // blow(blower, cake, camera, scene);

                    gameManager.canBlow = false;

                    // Play blow audio
                    blowAudio.setVolume((gameManager.currentBlowStr / 20) - 1);       
                    blowAudio.play();

                    pickingInfo = scene.pick(pointerInfo.event.x, pointerInfo.event.y);
                    pickedMesh = pickingInfo.pickedMesh;
                    if (pickedMesh != null) {
                        // let meshKey = pickedMesh.name.substring(0, 7);
                        // console.log(meshKey);
                        console.log(pickedMesh.name);
                        if (pickedMesh.name.includes("Fire")) {
                            let key = pickedMesh.name.substring(4); // This is a number (i.e. 1, 4, 5)
                            // console.log(key);

                            var candle = candles['Candle' + key];
                            if (candle.isLit) {
                                candle.blow(gameManager.currentBlowStr);

                                let strengthRatio = candle.currentStrength / candle.maxThreshold;

                                var fireRoot = scene.getTransformNodeByName('fireRoot' + key);
                                fireRoot.scaling.x = 1 * strengthRatio;
                                fireRoot.scaling.z = 1 * strengthRatio;

                                if (candle.currentStrength == 0) {
                                    gameManager.activeCandlesCount -= 1;

                                    // If no more active candles, end the game
                                    if (gameManager.activeCandlesCount == 0) {
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

    // var cake = BABYLON.Mesh.CreateBox("FakeCake", 1.0, scene);
    // cake.position = BABYLON.Vector3.Zero();
    // cake.isPickable = false;

    var camera = createCamera(scene, canvas);

    // var light = new BABYLON.PointLight(
    //     "pointLight",
    //     new BABYLON.Vector3(0, 20, 0),
    //     scene
    // );
    // // light.parent = camera;
    // light.intensity = 0.5;
    var hemLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemLight.intensity = 0.5;
    var pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 30, -15), scene);

    // Table pos: new BABYLON.Vector3(3, 5.75, 5);

    // var light = new BABYLON.SpotLight(
    //     "SpotLight", 
    //     // new BABYLON.Vector3(-3, 30, -15),
    //     new BABYLON.Vector3(-15, 30, 10),
    //     new BABYLON.Vector3(
    //         BABYLON.Tools.ToRadians(90), 
    //         BABYLON.Tools.ToRadians(-80), 
    //         BABYLON.Tools.ToRadians(0)
    //     ),
    //     BABYLON.Tools.ToRadians(45),
    //     1,
    //     scene
    // );
    // light.intensity = 0.5;
    // light.position = new BABYLON.Vector3(0, 10, 0);

    var lightSphere = BABYLON.Mesh.CreateSphere("lightSphere", 10, 2, scene);
    lightSphere.position = pointLight.position;
    lightSphere.material = new BABYLON.StandardMaterial("lightSphere", scene);
    lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    var shadowGenerator = new BABYLON.ShadowGenerator(1024, pointLight);
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.useExponentialShadowMap = false;
    gameManager.shadowGenerators[0] = shadowGenerator;

    // var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light);
    // shadowGenerator2.usePercentageCloserFiltering = true;
    // // shadowGenerator2.useContactHardeningShadow = true;
    // shadowGenerator2.useExponentialShadowMap = false;
    // gameManager.shadowGenerators[1] = shadowGenerator2;

    // var box = BABYLON.Mesh.CreateBox('', 0.5, scene);
    // box.scaling.y = 1;
    // box.position = new BABYLON.Vector3(3, 7, 5);
    // gameManager.shadowGenerator.addShadowCaster(box);

    scene.registerBeforeRender(function () {
        // light.position = camera.position;
        if (!gameManager.isGameEnded) {
            for (var i = 0; i < gameManager.candleCount; i++) {
                var candle = candles['Candle' + i];
                candle.regen();
                let strengthRatio = candle.currentStrength / candle.maxThreshold;
    
                var fireRoot = scene.getTransformNodeByName('fireRoot' + i);
                fireRoot.scaling.x =  1 * strengthRatio;
                fireRoot.scaling.z = 1 * strengthRatio;
            }
        } else {
            console.log('Game ended');
        }
    });

    var timer = window.setInterval(() => {
        currentDuration--;
        timerTextBlock.text = convertTimeToString(currentDuration);

        if (currentDuration <= 0) {
            gameManager.isGameEnded = true;
            window.clearInterval(timer);
        }

    }, 1000);

    // scene.debugLayer.show();

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
var positionCandles = function(cake, candles, scene, padding = 0.1) {
    let cakeRoot = scene.getTransformNodeByName("cakeRoot");
    let upperCream = scene.getMeshByName("upperCream");
    let upperCreamDims = upperCream.getBoundingInfo().boundingBox.extendSize;
    upperCreamDims.x *= cakeRoot.scaling.x;
    upperCreamDims.y *= cakeRoot.scaling.y;
    upperCreamDims.z *= cakeRoot.scaling.z;
    // console.log(cakeDims);
    // upperCreamDims.showBoundingBox = true;
    let cakePosition = upperCream.getAbsolutePosition();
    // console.log(cakePosition);
    for (var i = 0; i < Object.keys(candles).length; i++) {
        var key = "Candle" + i;
        // var candleRoot = scene.getTransformNodeByName(key);
        var candle = scene.getMeshByName(key + '_Material1');
        // var candle = scene.getMeshByName(key);
        // candle.showBoundingBox = true;
        // candle.scaling = new BABYLON.Vector3(0.1, 0.25, 0.1);
        candleDims = candle.getBoundingInfo().boundingBox.extendSize;
        // candleDims.x *= candleRoot.scaling.x;
        // candleDims.y *= candleRoot.scaling.y;
        // candleDims.z *= candleRoot.scaling.z;
        // console.log(candleDims);

        // fireRoot.position.y = candleDims.y;

        // fireRoot._children.forEach(function(element) {
        //     element.position = candle.getAbsolutePosition();
        // });

        // minBoundaries = new BABYLON.Vector3(
        //     cakePosition.x - upperCreamDims.x + padding,
        //     cakePosition.y + candleDims.y,
        //     cakePosition.z - upperCreamDims.z + padding
        // )
        // maxBoundaries = new BABYLON.Vector3(
        //     cakePosition.x + upperCreamDims.x - padding,
        //     cakePosition.y + candleDims.y,
        //     cakePosition.z + upperCreamDims.z - padding
        // )

        collisionCheck:
        while (true) {
            // Set position of meshes
            // let r = upperCreamDims.x - padding - candleDims.x;
            let r = getRandomArbitrary(0, upperCreamDims.x - padding - candleDims.x);
            let theta = getRandomArbitrary(0, 2 * Math.PI);
            var newPos = new BABYLON.Vector3(
                r * Math.cos(theta) + cakePosition.x,
                cakePosition.y + candleDims.y + 1,
                r * Math.sin(theta) + cakePosition.z
            );
            // console.log(candles[key].candleMeshGroup);
            var transformNode = candles[key].candleMeshGroup;
            transformNode.position = newPos;
            transformNode.computeWorldMatrix();
            // Update position of mesh children
            transformNode._children.forEach(function(mesh) {
                mesh.computeWorldMatrix();
                // console.log(mesh.getAbsolutePosition());
            });
            // console.log(transformNode.name + ': ' + transformNode.position);

            // Position fire
            let fireRoot = scene.getTransformNodeByName("fireRoot" + i);
            fireRoot.position = candle.getAbsolutePosition();
            fireRoot.position.y -= 0.08;

            // Check for collision
            for (var key2 in candles) {
                c = scene.getMeshByName(key2);
                if (c.name != key) {
                    if (candle.intersectsMesh(c, true)) {
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
    let gameManager = new GameManager(candleCount = 10, gameDuration = 300);
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
            gameManager.shadowGenerators[0].addShadowCaster(mesh);
        });

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
    }

    // Load fire
    for (var a=0; a<gameManager.candleCount + 1; a++) {
        var fireCount = -1;
        var fireTask = assetsManager.addMeshTask("fireTask" + a, "", "./assets/models/", "Fire.obj");
        fireTask.onSuccess = function(task) {
            fireCount++;
            // console.log(fireCount)
            var transformNode = scene.getTransformNodeByName("fireRoot" + fireCount);
            var material = new BABYLON.StandardMaterial("FireMaterial", scene);
            material.diffuseColor = new BABYLON.Color4.FromHexString("#FD6304FF");
            task.loadedMeshes.forEach(function(mesh) {
                mesh.material = material;
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
            gameManager.shadowGenerators[0].addShadowCaster(mesh);
            // console.log("before if");
            if (name.includes("Cylinder")) {
                mesh.material = cakeMat;
                // console.log("reached if");
                if (name == "Cylinder1") {
                    // console.log("reached cylinder");
                    mesh.name = "Cake";
                    // mesh.receiveShadows = true;
                    // mesh.showBoundingBox = true;
                    // console.log(mesh.getAbsolutePosition());
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

                if (mesh.name.includes('Candle') && mesh.name.includes('Material')) {
                    var material = new BABYLON.StandardMaterial("material", scene);
                    var num = Math.floor(getRandomArbitrary(1, 6));     // Randomize texture
                    // material.diffuseTexture = new BABYLON.Texture("./assets/models/candle_colors/" + num + ".jpg", scene);
                    material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
                    mesh.material = material;
                    mesh.name = mesh.name.includes('006')? name + '_Material1' : name + '_Material2';
                } else if (mesh.name.includes('Fuse')) {
                    mesh.name = name + "_Fuse" + mesh.name.includes('Material')? '_Material' : '';
                    console.log(mesh.name);
                } else {
                    mesh.name = name;
                }

                // if (mesh.name == 'Candle') {
                //     console.log(mesh.material);
                //     // console.log(JSON.stringify(mesh.material));
                // }

                mesh.isPickable = true;
                // mesh.name = mesh.name == 'Candle'? name : mesh.name + loadedCandlesCount;

                if (!mesh.parent) {
                    mesh.parent = transformNode;
                }

                // mesh.position = new BABYLON.Vector3(3, 5.8, 5);
            }

            // transformNode.scaling = new BABYLON.Vector3(
            //     0.1,
            //     0.25,
            //     0.1
            // );

            // Create Candle object
            // console.log(transformNode);
            var candleObject = new Candle(
                name,
                transformNode
            )

            // Add to dictionary
            candles[name] = candleObject;
        }
    }

    assetsManager.onFinish = function(tasks) {
        // console.log(tasks);
        var cake = scene.getMeshByName("Cake");
        // cakeDims = cake.getBoundingInfo().boundingBox.extendSize;

        // Remove clutter from table
        // scene.getMeshByName("book_2").dispose();
        // scene.getMeshByName("book3").dispose();
        // scene.getMeshByName("book4").dispose();
        // scene.getMeshByName("mesh_mm1").dispose();
        scene.getMeshByName("decoration_set_002").dispose();

        // Update camera position
        var camera = scene.activeCamera;
        camera.target = cake.getAbsolutePosition();
        camera.target.y = cake.getAbsolutePosition().y + 1;
        camera.position = cake.getAbsolutePosition();
        camera.radius = 5;

        // Position candles
        positionCandles(cake, candles, scene);
        // // Fire!
        // BABYLON.ParticleHelper.CreateAsync("fire", scene,false).then((set) => {
        //     const candlenames = [];
        // for(var i = 0; i <= loadedCandlesCount; i++){            
        //     candlenames[i] = "Candle" + i.toString()   
        // }   
        //     // var candle = scene.getMeshByName("Candle");
        //     console.log(candle);
        //     console.log(candle.getAbsolutePosition());
        //     console.log(set.systems[0]);
        //     for(var i = 0; i < set.systems.length;i++){
        //         candle = scene.getMeshByName(candlenames[i]);
        //         set.systems[i].emitter = candle;
        //         set.systems[i].maxSize = 1;
        //         set.systems[i].minSize = 1;
        //         // set.systems[i].maxScaleY = 0.2;
        //         // set.systems[i].maxScaleX = 0.2;
        //         // set.systems[i].minScaleY = 0.2;
        //         // set.systems[i].minScaleX = 0.2;
        //         set.systems[i].worldOffset.y = 0.8;
        //     }
        //     set.emitter = candle;
        //     set.start();
        
        // });
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
            let ellipse = gui.getControlByName("Ellipse");
            var musicOn = true;
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
                // console.log(gameManager.currentBlowStr);
                if (gameManager.isMouseDown && gameManager.canBlow) {
                    gameManager.increaseBlowStr();
                } else {
                    gameManager.decreaseBlowStr();
                }
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