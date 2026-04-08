const FACE_SCAN_URL = "public/supportitseez3d.com.glb";
const container = document.getElementById("model-container");
const progressBar = document.getElementById("model-progress-bar");
const errorMessage = document.getElementById("model-error");
const protectionLayer = document.getElementById("model-protection");

if (container && typeof THREE !== "undefined" && typeof THREE.GLTFLoader !== "undefined" && typeof THREE.OrbitControls !== "undefined") {
  const width = container.clientWidth || 640;
  const height = container.clientHeight || 420;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;
  controls.minPolarAngle = Math.PI * 0.32;
  controls.maxPolarAngle = Math.PI * 0.68;

  const ambientLight = new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 1.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
  keyLight.position.set(4, 6, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.75);
  rimLight.position.set(-6, 2, -6);
  scene.add(rimLight);

  const loader = new THREE.GLTFLoader();
  const dbName = "glbCacheDB";
  const storeName = "models";

  function hideProgress() {
    const progressWrapper = progressBar?.parentElement;

    if (progressWrapper) {
      setTimeout(() => {
        progressWrapper.style.display = "none";
      }, 350);
    }
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
        event.target.result.createObjectStore(storeName);
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async function getCachedModel(key) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async function setCachedModel(key, data) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  function setProgress(value) {
    if (progressBar) {
      progressBar.style.width = `${Math.max(0, Math.min(value, 100))}%`;
    }
  }

  async function loadModel() {
    try {
      setProgress(10);

      let arrayBuffer = await getCachedModel(FACE_SCAN_URL);

      if (!arrayBuffer) {
        const response = await fetch(FACE_SCAN_URL);

        if (!response.ok) {
          throw new Error(`Falha ao baixar o modelo: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const contentLength = Number(response.headers.get("Content-Length")) || 0;

        if (!reader) {
          arrayBuffer = await response.arrayBuffer();
          setProgress(100);
        } else {
          let receivedLength = 0;
          const chunks = [];

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            chunks.push(value);
            receivedLength += value.length;

            if (contentLength > 0) {
              setProgress((receivedLength / contentLength) * 100);
            } else {
              setProgress(Math.min(85, 18 + receivedLength / 28000));
            }
          }

          const tempArray = new Uint8Array(receivedLength);
          let position = 0;

          chunks.forEach((chunk) => {
            tempArray.set(chunk, position);
            position += chunk.length;
          });

          arrayBuffer = tempArray.buffer;
          await setCachedModel(FACE_SCAN_URL, arrayBuffer);
          setProgress(100);
        }
      } else {
        setProgress(100);
      }

      hideProgress();

      const dataToParse = arrayBuffer instanceof ArrayBuffer ? arrayBuffer : arrayBuffer.buffer;

      loader.parse(dataToParse, "", (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
          }
        });

        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        const maxDimension = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs((maxDimension / 2) / Math.tan(fov / 2));

        camera.position.set(0, 0, cameraDistance * 1.85);
        controls.minDistance = cameraDistance * 0.8;
        controls.maxDistance = cameraDistance * 3.2;
        controls.update();
      });
    } catch (error) {
      console.error("Erro ao carregar o modelo 3D:", error);

      if (errorMessage) {
        errorMessage.style.display = "block";
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  loadModel();
  animate();

  window.addEventListener("resize", () => {
    const nextWidth = container.clientWidth || width;
    const nextHeight = container.clientHeight || height;

    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
  });

  if (window.innerWidth < 768 && protectionLayer) {
    controls.enabled = false;

    protectionLayer.addEventListener("click", () => {
      controls.enabled = true;
      controls.autoRotate = false;
      protectionLayer.classList.add("hidden");
    });
  } else {
    controls.enabled = true;
    protectionLayer?.classList.add("hidden");
  }
} else if (container) {
  console.error("Bibliotecas 3D não carregadas corretamente.");
}
