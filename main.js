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
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 10;

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.8;

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    scene
  );
  const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
  ground.material = groundMaterial;

  try {
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "./assets/",
      "character.fbx",
      scene
    );

    const character = result.meshes[0];
    character.position = new BABYLON.Vector3(0, 0, 0);
    character.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);

    // Log all available animations
    console.log("Available animations:", scene.animationGroups);
    
    // Try to play all animations to see what they are
    scene.animationGroups.forEach((animGroup, index) => {
      console.log(`Animation ${index}:`, animGroup.name);
      // Play each animation briefly to see what it does
      animGroup.play(true);
      setTimeout(() => {
        animGroup.stop();
      }, 2000); // Stop after 2 seconds
    });

    camera.target = character.position;
  } catch (error) {
    console.error("Error loading character:", error);
  }

  const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "https://assets.babylonjs.com/environments/environmentSpecular.env",
    scene
  );
  scene.environmentTexture = envTexture;

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