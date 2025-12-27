   const FACE_SCAN_URL = 'https://www.thotiacorp.com.br/assets/images/supportitseez3d.com.glb';
    const container = document.getElementById('model-container');
    const progressBar = document.getElementById('model-progress-bar');
    const errorMsg = document.getElementById('model-error');
    const protectionLayer = document.getElementById('model-protection');

    if (!container) console.error("Contêiner #model-container não encontrado.");
    if (typeof THREE.GLTFLoader === 'undefined') console.error("GLTFLoader não está definido.");
    if (typeof THREE.OrbitControls === 'undefined') console.error("OrbitControls não está definido.");

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAFAFA);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 5, 5).normalize();
    scene.add(dirLight);

    let model = null;
    const loader = new THREE.GLTFLoader();

    // --- IndexedDB ---
    const dbName = "glbCacheDB";
    const storeName = "models";

    function openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = e => e.target.result.createObjectStore(storeName);
        request.onsuccess = e => resolve(e.target.result);
        request.onerror = e => reject(e.target.error);
      });
    }

    async function getCachedModel(key) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = e => reject(e.target.error);
      });
    }

    async function setCachedModel(key, data) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.put(data, key);
        req.onsuccess = () => resolve();
        req.onerror = e => reject(e.target.error);
      });
    }

    async function loadModel() {
      try {
        let arrayBuffer = await getCachedModel(FACE_SCAN_URL);

        if (!arrayBuffer) {
          const res = await fetch(FACE_SCAN_URL);
          if (!res.ok) throw new Error(`Falha ao baixar: ${res.status}`);

          const reader = res.body.getReader();
          const contentLength = +res.headers.get('Content-Length');
          let receivedLength = 0;
          const chunks = [];

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            if (contentLength) {
              progressBar.style.width = ((receivedLength / contentLength) * 100).toFixed(0) + '%';
            }
          }

          const tempArray = new Uint8Array(receivedLength);
          let position = 0;
          for (const chunk of chunks) {
            tempArray.set(chunk, position);
            position += chunk.length;
          }

          arrayBuffer = tempArray.buffer;
          await setCachedModel(FACE_SCAN_URL, arrayBuffer);

          console.log("Modelo baixado e salvo no cache!");
          progressBar.style.width = "100%";
          setTimeout(() => { progressBar.parentElement.style.display = "none"; }, 500);
        } else {
          console.log("Modelo carregado do cache!");
          progressBar.style.width = "100%";
          setTimeout(() => { progressBar.parentElement.style.display = "none"; }, 500);
        }

        // --- Garantia de parse correto ---
        const dataToParse = arrayBuffer instanceof ArrayBuffer ? arrayBuffer : arrayBuffer.buffer;
        loader.parse(dataToParse, '', (gltf) => {
          model = gltf.scene;
          scene.add(model);

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          model.position.sub(center);

          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
          camera.position.set(0, 0, cameraZ * 1.8);
          controls.minDistance = cameraZ * 0.5;
          controls.maxDistance = cameraZ * 5;
          controls.update();
        });

      } catch (err) {
        console.error("Erro ao carregar modelo:", err);
        errorMsg.style.display = "block";
      }
    }

    loadModel();

    // --- Loop animação ---
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // --- Responsividade ---
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // --- Proteção mobile ---
    if (window.innerWidth < 768 && protectionLayer) {
      controls.enabled = false;
      protectionLayer.addEventListener('click', () => {
        controls.enabled = true;
        controls.autoRotate = false;
        protectionLayer.classList.add('hidden');
      });
    } else {
      controls.enabled = true;
    }