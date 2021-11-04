class GameManager {
    constructor() {
        this.isMouseDown = false;
        this.currentBlowStr = 0;
        this.maxBlowStr = 100;
        this.blowStrIncr = 1;
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

let gameManager = new GameManager();

var createScene = function(engine) {
    var scene = new BABYLON.Scene(engine);
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log("POINTER DOWN");
                gameManager.isMouseDown = true;
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                console.log("POINTER UP");
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
    var box = BABYLON.Mesh.CreateBox("Box", 1.0, scene);
    box.position = BABYLON.Vector3.Zero();

    var camera = createCamera(box);

    var light = new BABYLON.PointLight(
        "pointLight",
        new BABYLON.Vector3(0, 20, 0),
        scene
    );
    light.parent = camera;
    light.intensity = 1.5;

    return scene;
}

var createCamera = function(cake) {

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

var canvas = document.getElementById("render");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene(engine);

engine.runRenderLoop(function() {
    if (gameManager.isMouseDown) {
        gameManager.increaseBlowStr();
    } else {
        gameManager.decreaseBlowStr();
    }

    scene.render();
});
window.addEventListener("resize", function() {
    engine.resize();
});