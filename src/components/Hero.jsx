import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import heroImage from '/assets/images/main_background.jpg';
import '../assets/css/hero.css';
import Testimonials from './Testimonials';
import Talk from './Talk';
import useClerkAuthHome from '../hooks/useClerkAuthHome';
import { 
    ArrowRightIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const threeRef = useRef(null);
    const modelPath = '/assets/anims/scene.gltf';

    useClerkAuthHome();

    // Add effect to handle auth state changes
    useEffect(() => {
        // This effect will run whenever the user state changes
        // You can add any additional logic here if needed
    }, [user]);

    // Three.js Implementation (Commented for future reference)
    /*
    useEffect(() => {
        if (!threeRef.current) return;
    
        // Clear any previous canvas
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
    
        // Light
        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);
    
        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
    
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
    */

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="relative h-[calc(82vh-0rem)] md:h-[calc(94vh-0rem)] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Luxury Real Estate Property"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
                </div>

                {/* Main Content */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="h-full flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-8">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                                <span className="block">Professional Real Estate</span>
                                <span className="block text-cyan-100">Management Platform</span>
                            </h1>
                            
                            <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6 max-w-2xl mx-auto lg:mx-0">
                                Realist is the premier platform for real estate professionals and contractors, 
                                offering AI-powered tools to streamline property management.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
                                {user ? (
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="group inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-300"
                                    >
                                        Access Professional Dashboard
                                        <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={openModal}
                                        className="group inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-300"
                                    >
                                        Get Started
                                        <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                                    <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-cyan-100 mb-1" />
                                    <div className="text-lg sm:text-xl font-bold text-white">10K+</div>
                                    <div className="text-xs text-white/80">Properties</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                                    <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-cyan-100 mb-1" />
                                    <div className="text-lg sm:text-xl font-bold text-white">5K+</div>
                                    <div className="text-xs text-white/80">Professionals</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                                    <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-cyan-100 mb-1" />
                                    <div className="text-lg sm:text-xl font-bold text-white">98%</div>
                                    <div className="text-xs text-white/80">Satisfaction</div>
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className="mt-4 sm:mt-6 space-y-2 text-white/90">
                                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Why Choose Realist?</h2>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-cyan-100/20 flex items-center justify-center mr-2">
                                            <ArrowRightIcon className="h-2 w-2 sm:h-3 sm:w-3 text-cyan-100" />
                                        </span>
                                        <span className="text-xs sm:text-sm">AI-powered property analysis tools</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-cyan-100/20 flex items-center justify-center mr-2">
                                            <ArrowRightIcon className="h-2 w-2 sm:h-3 sm:w-3 text-cyan-100" />
                                        </span>
                                        <span className="text-xs sm:text-sm">Comprehensive contractor network</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-cyan-100/20 flex items-center justify-center mr-2">
                                            <ArrowRightIcon className="h-2 w-2 sm:h-3 sm:w-3 text-cyan-100" />
                                        </span>
                                        <span className="text-xs sm:text-sm">Real-time market insights</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full" viewBox="0 0 1440 120">
                        <path
                            fill="#ffffff"
                            fillOpacity="0.1"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* Testimonials Section */}
            {/* <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Testimonials />
                </div>
            </div> */}

            {/* Talk Section */}
            {/* <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Talk />
                </div>
            </div> */}

            {/* Login Modal */}
            <LoginModal isOpen={isModalOpen} closeModal={closeModal} Method={0} />
        </>
    );
};

export default Hero;
