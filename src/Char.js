import './Game.css';
import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import shake from './animation/shake.fbx';
import Ty from './models/Ty.fbx';

import rt from './assets/skybox/rt.png';
import bk from './assets/skybox/bk.png';
import dn from './assets/skybox/dn.png';
import ft from './assets/skybox/ft.png';
import up from './assets/skybox/up.png';
import lf from './assets/skybox/lf.png';

const Char = () => {
  const canvasRef = useRef();
  const smallCanvasRef = useRef();
  let renderer = useRef();
  let scene = useRef();
  let camera = useRef();
  let model = useRef();
  let controls = useRef();
  let upDown = useRef('down');
  let mixer = useRef();
  let move = useRef(false);
  let starting = useRef(false);
  let animation = useRef();
  const clock = new THREE.Clock()
  const [smallCanvasShow, setSmallCanvasShow] = useState(true);
  const [gameOverHTML, setGameOverHTML] = useState(false);
  const [victoryHTML, setVictoryHTML] = useState(false);
  const [restartHTML , setRestartHTML] = useState(true);
  useEffect(() => {
    // 初始化
    init();
    controls.current = new OrbitControls(camera.current, renderer.current.domElement)
    // controls.current.enableDamping = true
    // controls.current.dampingFactor = 0.25
    // controls.current.enableZoom = false
    controls.current.enabled = true;

    // 建立光源
    // const pointLight = new THREE.PointLight(0xffffff)
    // pointLight.position.set(0, 15, 10)
    // scene.current.add(pointLight)

    // const ambientLight = new THREE.AmbientLight(0xffffff)
    // scene.current.add(ambientLight)

    // 顏色，強度，距離，角度和指數
    // 角度是錐形將採取的角度。
    // 指數是指光從目標方向落到0的速度。數字越高，光線越暗。
    const spotLight = new THREE.SpotLight(0xffffff, 2, 100, 15, 0);
    spotLight.position.set(0, 10, 3);
    scene.current.add(spotLight);

    spotLight.shadow.mapSize.width = 512; // default
    spotLight.shadow.mapSize.height = 512; // default
    spotLight.shadow.camera.near = 0.5; // default
    spotLight.shadow.camera.far = 500; // default

    var helper = new THREE.CameraHelper(spotLight.shadow.camera );
    scene.current.add(helper);

    const sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
    const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.position.set(0, 5 , 0);
    sphere.castShadow = true; //default is false
    sphere.receiveShadow = false; //default
    scene.current.add( sphere );

    // loadModel();
    // environment();
    plane()
    loadMesh();
    
    setTimeout(() => {
      render();
      setTimeout(() => {
        // starting.current = true;
        // startCircle();
        window.addEventListener('keydown', (event) => {
          if(event.keyCode === 87 && starting.current) {
            if(camera.current.position.z > -7) {
              if(move.current) {
                camera.current.position.z -= 0.5;
                if(camera.current.position.z < 1) {
                    setVictoryHTML(true);
                    setTimeout(() => {
                        setVictoryHTML(false);
                        setTimeout(() => {
                          setRestartHTML(true);
                        }, 100)
                    }, 1000);
                    starting.current = false;
                }
              } else {
                setGameOverHTML(true);
                setTimeout(() => {
                  setGameOverHTML(false);
                  setTimeout(() => {
                    setRestartHTML(true);
                  }, 100)
                }, 1000);
                starting.current = false;
                console.log('game over');
              }
            }
          }
  
          if(event.keyCode === 83 && starting.current) {
            if(camera.current.position.z < 150) {
              if(move.current) {
                camera.current.position.z += 0.5;
              } else {
                setGameOverHTML(true);
                setTimeout(() => {
                  setGameOverHTML(false);
                  setTimeout(() => {
                    setRestartHTML(true);
                  }, 100)
                }, 1000);
                starting.current = false;
                console.log('game over');
              }
            }
          }
        });
      }, 500)
    }, 2500)
  }, []);

  const plane = () => {
    const planeGeometry = new THREE.PlaneGeometry(200, 200)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    plane.position.set(0, -0.4, 0)
    scene.current.add(plane)
  }

  const init = () => {
    // 建立場景
    scene.current = new THREE.Scene();
    // 建立渲染器
    renderer.current = new THREE.WebGLRenderer({ canvas: canvasRef.current})
    renderer.current.setSize(window.innerWidth - 4 , window.innerHeight - 4) // 場景大小
    renderer.current.setClearColor(0xffffff, 1.0) // 預設背景顏色
    renderer.current.shadowMap.enable = true // 陰影效果
    renderer.current.shadowMap.enabled = true // 設定需渲染陰影效果
    renderer.current.shadowMap.type = THREE.PCFShadowMap // THREE.PCFSoftShadowMap


    // 建立相機
    camera.current = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth - 4 ) / (window.innerHeight - 4),
      0.1,
      1000
    )
    // camera.position.set(0, 12, 30) // 相機位置
    camera.current.position.set(0, 5, 30);
    camera.current.lookAt((0, 10, 0)) // 相機焦點
  }

  const startCircle = () => {
    const c = setInterval(() => {
      if(!starting.current) {
        clearInterval(c);
        return;
      }
      if(upDown.current === 'up') {
        move.current = true;
        model.current.rotation.y += 0.07;
      } else {
        move.current = true;
        model.current.rotation.y -= 0.07;
      }
      if(model.current.rotation.y >= Math.PI && upDown.current === 'up') {
        upDown.current = 'down';
        move.current = true;
        clearInterval(c);
        const random  = parseInt(Math.random(1, 2) * 2 * 300);
        setTimeout(() => {
          startCircle();
        }, random);
      }
      if(model.current.rotation.y <= 0 && upDown.current === 'down') {
        upDown.current = 'up';
        move.current = false;
        clearInterval(c);
        const random  = parseInt(Math.random(1, 2) * 2 * 300) + 500;
        setTimeout(() => {
          startCircle();
        }, random);
      }
    }, 10)
  }

  const loadModel = () => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
        Ty,
        (fbx) => {
            model.current = fbx;
            fbx.scale.set(0.05, 0.05, 0.05);
            fbx.position.set(0, 0, 0)
            fbx.castShadow = true;
            const anim = new FBXLoader();
            anim.load(
              shake,
              (object) => {
                  console.log('loaded stand')
                  animation.current = object;
                  mixer.current = new THREE.AnimationMixer(fbx)
                  const animationAction = mixer.current.clipAction(object.animations[0]);
                  animationAction.play();
                  mixer.current.update();
            })
            scene.current.add(fbx)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
  }

  const environment = () => {
    const textureLoader = new THREE.TextureLoader();
    const skyboxGeometry = new THREE.BoxGeometry(600, 200, 600);
    const skyboxMaterials = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load(rt), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(lf), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(up), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(dn), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(bk), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(ft), side: THREE.DoubleSide }),
    ];
    const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    skyboxMesh.position.set(0, 100, 50)
    skyboxMesh.receiveShadow = true;
    skyboxMesh.name = 'skyboxMesh';

    scene.current.add(skyboxMesh);
  }

  const loadMesh = () => {
    const geometry = new THREE.BoxGeometry(300, 0, 1) // 幾何體
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xffffff 
    }) // 材質
    const cube = new THREE.Mesh(geometry, material) // 建立網格物件
    cube.position.set(0, 0, -2)
    scene.current.add(cube)
  }

  const render = () => {
    renderer.current.render(scene.current, camera.current)
    const delta = clock.getDelta();
    // if ( mixer ) {
      // mixer.current.update( delta );
    // }
    animate()
  }

  const animate = () => {
    // cube.position.x -= 0.01;
    // cube.rotation.y += 0.1;
    // model.rotateY(Math.PI);
    requestAnimationFrame(render)
  }

  const RestartFun = () => {
    setRestartHTML(false);
    camera.current.position.set(0, 5, 350);
    camera.current.lookAt((0, 10, 0)) // 相機焦點
    controls.current.update()
    model.current.rotation.y = Math.PI;
    setTimeout(() => {
      startCircle();
      starting.current = true;
    }, 500)
  }

  return (
    <>
      <canvas className='canvas-outer' ref={canvasRef} />
      {gameOverHTML && <div className='hint-div'>Game Over</div>}
      {victoryHTML && <div className='hint-div'>獲勝</div>}
      {/* {restartHTML && <div onClick={RestartFun} className='restart-div'>開始</div>} */}
    </>
  )
}

export default Char;
