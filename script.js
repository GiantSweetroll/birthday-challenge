var createScene = function(engine) {
    var scene = new BABYLON.Scene(engine);
    engine.enableOfflineSupport = false;

    var cake = BABYLON.SceneLoader.ImportMesh(
        "", 
        "./assets/models/", 
        "BirthdayCake.obj",
        scene,
        function(newMeshes) {
        }
    );

    var arcCamera = new BABYLON.ArcRotateCamera(
        "arcCamera",
        BABYLON.Tools.ToRadians(40),
        BABYLON.Tools.ToRadians(60),
        20.0,       // Radius
        cake.position,
        scene
    );
    arcCamera.attachControl(canvas, true);

    var light = new BABYLON.PointLight(
        "pointLight",
        new BABYLON.Vector3(0, 20, 0),
        scene
    );
    light.parent = arcCamera;
    light.intensity = 1.5;

    return scene;
}

var canvas = document.getElementById("render");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene(engine);

engine.runRenderLoop(function() {
    scene.render();
});
window.addEventListener("resize", function() {
    engine.resize();
});