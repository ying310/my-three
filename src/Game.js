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

const Game = () => {
  const canvasRef = useRef();
  const smallCanvasRef = useRef();
  let renderer = useRef();
  let smallRenderer = useRef();
  let scene = useRef();
  let camera = useRef();
  let smallCamera = useRef();
  let model = useRef();
  let controls = useRef();
  let smallControls = useRef();
  let upDown = useRef('down');
  let mixer = useRef();
  let move = useRef(false);
  let starting = useRef(false);
  const [smallCanvasShow, setSmallCanvasShow] = useState(true);
  const [gameOverHTML, setGameOverHTML] = useState(false);
  const [victoryHTML, setVictoryHTML] = useState(false);
  const [restartHTML , setRestartHTML] = useState(true);
  useEffect(() => {
    // 初始化
    init();
    controls.current = new OrbitControls(camera.current, renderer.current.domElement)
    smallControls.current = new OrbitControls(smallCamera.current, smallRenderer.current.domElement);
    // controls.current.enableDamping = true
    // controls.current.dampingFactor = 0.25
    // controls.current.enableZoom = false
    controls.current.enabled = false;
    smallControls.current.enabled = false;

    // 建立光源
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(0, 15, 10)
    scene.current.add(pointLight)

    const ambientLight = new THREE.AmbientLight(0xffffff)

    scene.current.add(ambientLight)

    loadModel();
    environment();
    loadMesh();
    
    render();
    setTimeout(() => {
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

  const init = () => {
    // 建立場景
    scene.current = new THREE.Scene();
    // 建立渲染器
    renderer.current = new THREE.WebGLRenderer({ canvas: canvasRef.current})
    renderer.current.setSize(window.innerWidth - 4 , window.innerHeight - 4) // 場景大小
    renderer.current.setClearColor(0xffffff, 1.0) // 預設背景顏色
    renderer.current.shadowMap.enable = true // 陰影效果
    renderer.current.shadowMap.enabled = true // 設定需渲染陰影效果
    renderer.current.shadowMap.type = 2 // THREE.PCFSoftShadowMap

    smallRenderer.current = new THREE.WebGLRenderer({ canvas: smallCanvasRef.current})
    smallRenderer.current.setSize(200 , 150) // 場景大小
    smallRenderer.current.setClearColor(0xffffff, 1.0) // 預設背景顏色



    // 建立相機
    camera.current = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth - 4 ) / (window.innerHeight - 4),
      0.1,
      1000
    )
    // camera.position.set(0, 12, 30) // 相機位置
    camera.current.position.set(0, 5, 350);
    camera.current.lookAt((0, 10, 0)) // 相機焦點

    smallCamera.current = new THREE.PerspectiveCamera(
        75,
        200 / 150,
        0.1,
        1000
    )
    smallCamera.current.position.set(0, 5, 20);
    smallCamera.current.lookAt((0, 5, 0)) // 相機焦點
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
            fbx.rotation.y = Math.PI;
            const anim = new FBXLoader();
            anim.load(
              shake,
              (object) => {
                  console.log('loaded stand')
                  mixer.current = new THREE.AnimationMixer(fbx)
                  const animationAction = mixer.current.clipAction(object.animations[0]);
                  const clock = new THREE.Clock()
                  animationAction.play();
                  mixer.current.update(clock);
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
    skyboxMesh.name = 'skyboxMesh';

    scene.current.add(skyboxMesh);
  }

  const loadMesh = () => {
    const geometry = new THREE.BoxGeometry(300, 1, 1) // 幾何體
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xffffff 
    }) // 材質
    const cube = new THREE.Mesh(geometry, material) // 建立網格物件
    cube.position.set(0, 0, -2)
    scene.current.add(cube)
  }

  const render = () => {
    renderer.current.render(scene.current, camera.current)
    smallRenderer.current.render(scene.current, smallCamera.current)
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
    smallControls.current.update()
    model.current.rotation.y = Math.PI;
    setTimeout(() => {
      startCircle();
      starting.current = true;
    }, 500)
  }

  const closeCanvas = () => {
    setSmallCanvasShow(false);
  }

  const openCanvas = () => {
    setSmallCanvasShow(true);
  }

  return (
    <>
      <canvas className='canvas-outer' ref={canvasRef} />
      <canvas className='canvas-outer' style={{display: smallCanvasShow ? 'block': 'none'}} ref={smallCanvasRef} />
      {smallCanvasShow && <div onClick={closeCanvas} className='close-icon-outer-div'><div className='icon-div'>x</div></div>}
      {!smallCanvasShow && <div onClick={openCanvas} className='open-icon-outer-div'><div className='icon-div'>+</div></div>}
      {gameOverHTML && <div className='hint-div'>Game Over</div>}
      {victoryHTML && <div className='hint-div'>獲勝</div>}
      {restartHTML && <div onClick={RestartFun} className='restart-div'>開始</div>
      }
    </>
  )
}

export default Game;
