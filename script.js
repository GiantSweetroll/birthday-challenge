var isMouseDown = false;

var createScene = function(engine) {
    var scene = new BABYLON.Scene(engine);
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log("POINTER DOWN");
                isMouseDown = true;
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                console.log("POINTER UP");
                isMouseDown = false;
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

var blowPower = 0;
var canvas = document.getElementById("render");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene(engine);

engine.runRenderLoop(function() {
    if (isMouseDown) {
        blowPower++;
        console.log(blowPower);
    }

    scene.render();
});
window.addEventListener("resize", function() {
    engine.resize();
});