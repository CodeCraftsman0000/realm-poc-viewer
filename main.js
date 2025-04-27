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
    console.log("Starting to load test model...");
    
    // Use GLTF loader explicitly
    BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce((loader) => {
      console.log("Loader activated:", loader.name);
    });

    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./assets/",
      "StoreMart.glb",
      scene,
      null,
      ".glb"
    );

    console.log("Load result:", result);
    
    if (!result.meshes || result.meshes.length === 0) {
      throw new Error("No meshes found in the loaded file");
    }

    const model = result.meshes[0];
    console.log("Model loaded:", model.name);
    
    model.position = new BABYLON.Vector3(0, 1, 0);
    model.scaling = new BABYLON.Vector3(1, 1, 1);

    // Log animation groups
    console.log("Animation groups:", scene.animationGroups);
    
    if (scene.animationGroups && scene.animationGroups.length > 0) {
      scene.animationGroups.forEach((animGroup, index) => {
        console.log(`Animation ${index}:`, animGroup.name);
        animGroup.play(true);
      });
    } else {
      console.log("No animations found in the file");
    }

    camera.target = model.position;
  } catch (error) {
    console.error("Error loading model:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack
    });
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