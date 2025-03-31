import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import heroImage from '../assets/images/front_info_03.png';
import '../assets/css/hero.css';
import Testimonials from './Testimonials';
import Talk from './Talk';
import RegisterModal from './RegisterModal'; // Import Modal

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

    const threeRef = useRef(null);
    const modelPath = '/assets/anims/scene.gltf'; // Ensure the file is inside public/assets/anims/
  
    useEffect(() => {
      if (!threeRef.current) return;
    
      // ✅ Clear any previous canvas
      while (threeRef.current.firstChild) {
        threeRef.current.removeChild(threeRef.current.firstChild);
      }
    
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.set(3, 2, 3); // above the model
      camera.lookAt(3, 6, 3);
    
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0); // Fully transparent background
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setSize(300, 300);
      renderer.setClearColor(0x000000, 0); // transparent background
      threeRef.current.appendChild(renderer.domElement);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);
  
      // renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // renderer.outputEncoding = THREE.sRGBEncoding;
      
      // Light
      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);
  
      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enableRotate = false;
      controls.enablePan = false;
  
      // controls.enableDamping = false;
      // controls.dampingFactor = 0.05;
      // controls.enableZoom = true;
      // controls.minDistance = 2;
      // controls.maxDistance = 20;
      // controls.target.set(0, 0, 0); // orbit focus
      // controls.update();
  
      // Load model
      const loader = new GLTFLoader();
      let model = null;
  
      loader.load(
        modelPath,
        (gltf) => {
          model = gltf.scene;
          model.scale.set(0.5, 0.5, 0.5);
          model.position.set(0, -0.5, 0);
          scene.add(model);
        },
        undefined,
        (error) => console.error("❌ Error loading GLTF model:", error)
      );
  
      // Animation loop
      let animationId;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (model) model.rotation.y += 0.0015;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
  
      // Cleanup
      return () => {
        cancelAnimationFrame(animationId);
        controls.dispose();
        renderer.dispose();
        if (threeRef.current) {
          while (threeRef.current.firstChild) {
            threeRef.current.removeChild(threeRef.current.firstChild);
          }
        }
      };
    }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex  flex-col mx-auto  md:flex-row items-center justify-between gap-10 px-4 md:px-16 py-10   md:h-[65rem] max-w-screen-xl ">

        {/* Video Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="rounded-lg  overflow-hidden w-full max-w-xl flex flex-col items-center justify-center  p-6 md:p-8 lg:p-10 text-black">
            <section className="w-full pt-10">
              <h3 className="text-xl 0 md:text-2xl font-semibold mb-4 text-center md:text-left">
                Streamline Your Real Estate Workflow with Realist
              </h3>
              <div className="list-disc space-y-2 text-sm md:text-base">
            
                  Realist combines advanced AI, detailed property data, and curated contractor networks to simplify your workflow and maximize client satisfaction.
               
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={openModal}
                  className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-cyan-600 px-6 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                >
                  Register
                </button>
              </div>
            </section>
          </div>
        </div>


        {/* Text and Image Section */}
        <div className=" w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-10 max-w-3xl mx-auto">
          <div className="w-full h-full">
         
            <div
              ref={threeRef}
              className="rounded-lg overflow-hidden min-h-[300px] flex items-center justify-center"
            ></div>
            {/* Overlay content */}
           
          </div>
        </div>
      </div>

      {/* Include Modal */}
      <RegisterModal isOpen={isModalOpen} closeModal={closeModal} />

      {/* <div className="container mx-auto px-6 py-12 bg-black/30 rounded-lg">
   
          <Testimonials />
        </div>

        <div className="container mx-auto px-6 py-12 bg-black/30 rounded-lg mt-12">
       
          <Talk />
        </div> */}

    </>
  );
};

export default Hero;
