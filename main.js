const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.1, 1);

  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    Math.PI / 2,
    Math.PI / 3,
    10,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.8;

  // Load local GLB model from assets folder
  const result = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "./assets/",
    "Cubetest.glb",
    scene
  );
  const model = result.meshes[0];
  model.position = new BABYLON.Vector3(0, 0, 0);

  const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "https://assets.babylonjs.com/environments/environmentSpecular.env",
    scene
  );
  scene.environmentTexture = envTexture;

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    scene
  );
  const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
  ground.material = groundMaterial;

  return scene;
};

createScene().then((scene) => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

window.addEventListener("resize", () => {
  engine.resize();
});