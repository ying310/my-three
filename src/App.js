import './App.css';
import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import xBot from './models/xBot.fbx';
import mouse from './models/mouse.fbx';
import flairAnimation from './animation/Flair.fbx';
import Capoeira from './animation/Capoeira.fbx';
import shake from './animation/shake.fbx';
import Ty from './models/Ty.fbx';


import rt from './assets/skybox/rt.png';
import bk from './assets/skybox/bk.png';
import dn from './assets/skybox/dn.png';
import ft from './assets/skybox/ft.png';
import up from './assets/skybox/up.png';
import lf from './assets/skybox/lf.png';

const App = () => {
  const canvasRef = useRef();
  let renderer;
  let cube;
  let scene;
  let camera;
  let handLeft;
  let leftHand;
  let rightHand;
  let i = 0;
  let minus = true;
  let model;
  let upDown = 'down';
  let mixer;
  let move = true;
  let starting = false;
  const [gameOver, setGameOver] = useState(false);
  const [start, setStart] = useState(false);
  const [restart , setRestart] = useState(false);
  // const [move, setMove] = useState(true);
  useEffect(() => {
    // 初始化
    init();
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    // 需要3個屬性：光的顏色、強度、和強度下降到0的距離。如果設置距離為0，那麼距離是無限的。
    const pointLight = new THREE.PointLight(0xffffff, 3, 150)
    pointLight.position.set(0, 15, 10);
    scene.add(pointLight);


    // const pointLight2 = new THREE.PointLight(0xffffff)
    // pointLight2.position.set(3, 0, 3)
    // scene.add(pointLight2)
    // plane();
    loadModel();
    environment();
    // loadModel();
    // 建立物體
    // createObject();
    // createCreeper()
    // people()
    // help()
    // setInterval(() => {
    //   console.log(i)
    //   if(i % 2 !== 0) {
    //     leftHand.rotateY(-0.5 * Math.PI)
    //     rightHand.rotateY(+0.5 * Math.PI)
    //   } else {
    //     leftHand.rotateY(0.5 * Math.PI)
    //     rightHand.rotateY(-0.5 * Math.PI)
    //   }
    //   i += 1;
    // }, 1000)
    render();
    setTimeout(() => {
      setStart(true);
      setTimeout(() => {
        setStart(false);
        starting = true;
        startCircle();
  
        window.addEventListener('keydown', (event) => {
          if(event.keyCode === 87 && starting) {
            if(camera.position.z > -7) {
              if(move) {
                camera.position.z -= 1;
              } else {
                setGameOver(true);
                setTimeout(() => {
                  setGameOver(false);
                  setTimeout(() => {
                    setRestart(true);
                    console.log(restart);
                  }, 100)
                }, 1000);
                starting = false;
                console.log('game over');
              }
            }
          }
  
          if(event.keyCode === 83 && starting) {
            if(camera.position.z < 150) {
              if(move) {
                camera.position.z += 1;
              } else {
                setGameOver(true);
                setTimeout(() => {
                  setGameOver(false);
                  setTimeout(() => {
                    setRestart(true);
                  }, 100)
                }, 1000);
                starting = false;
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
    scene = new THREE.Scene();
    // 建立渲染器

    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current});
    renderer.setSize(window.innerWidth, window.innerHeight); // 場景大小
    renderer.setClearColor(0x000000, 1.0); // 預設背景顏色

    renderer.shadowMap.enable = true // 陰影效果
    renderer.shadowMap.enabled = true // 設定需渲染陰影效果
    renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

    // 建立相機
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 100);
    camera.lookAt(scene.current.position);
    camera.lookAt((0, 10, 0)) // 相機焦點
  }

  const startCircle = () => {
    const c = setInterval(() => {
      if(!starting) {
        clearInterval(c);
        return;
      }
      if(upDown === 'up') {
        move = true;
        model.rotation.y += 0.07;
      } else {
        move = true;
        model.rotation.y -= 0.07;
      }
      if(model.rotation.y >= Math.PI && upDown === 'up') {
        upDown = 'down';
        move = true;
        clearInterval(c);
        const random  = parseInt(Math.random(1, 2) * 2 * 300);
        setTimeout(() => {
          startCircle();
        }, random);
      }
      if(model.rotation.y <= 0 && upDown === 'down') {
        upDown = 'up';
        move = false;
        clearInterval(c);
        const random  = parseInt(Math.random(1, 2) * 2 * 300) + 500;
        setTimeout(() => {
          startCircle();
        }, random);
      }
    }, 10)
  }

  const createCreeper = () => {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)
    // 馮氏材質設為紅色
    const headCreeperMat = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const head = new THREE.Mesh(headGeo, headCreeperMat)
    head.position.set(0, 6, 0)

    // 馮氏材質設為綠色
    const bodyCreeperMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    const body = new THREE.Mesh(bodyGeo, bodyCreeperMat)
    body.position.set(0, 0, 0)

    const footCreeperMat = new THREE.MeshPhongMaterial({ color: 0x0000ff })
    const foot1 = new THREE.Mesh(footGeo, footCreeperMat)
    foot1.position.set(-1, -5.5, 2)

    const foot2 = foot1.clone()
    foot2.position.set(-1, -5.5, -2)

    const foot3 = foot1.clone()
    foot3.position.set(1, -5.5, 2)

    const foot4 = foot1.clone()
    foot4.position.set(1, -5.5, -2)

    const feet = new THREE.Group()
    feet.add(foot1)
    feet.add(foot2)
    feet.add(foot3)
    feet.add(foot4)

    const creeper = new THREE.Group()
    creeper.add(head)
    creeper.add(body)
    creeper.add(feet)

    scene.add(creeper);    
  }

  const createObject = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1) // 幾何體
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xffffff 
    }) // 材質
    cube = new THREE.Mesh(geometry, material) // 建立網格模型
    cube.position.set(0, 0, 0)
    scene.add(cube)
  }


  const loadModel = () => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
        Ty,
        (fbx) => {
            model = fbx;
            fbx.scale.set(0.05, 0.05, 0.05);
            fbx.position.set(0, 0, 0)
            fbx.rotation.y = Math.PI;
            // const animationAction = mixer.clipAction(
                // fbx.animations[0]
            // )
            // const animationActions = []
            // animationActions.push(animationAction)
            // let activeAction = animatiosnActions[0]
            const anim = new FBXLoader();
            anim.load(
              shake,
              (object) => {
                  console.log('loaded stand')
                  mixer = new THREE.AnimationMixer(fbx)
                  const animationAction = mixer.clipAction(object.animations[0]);
                  const clock = new THREE.Clock()
                  animationAction.play();
                  mixer.update(clock);
            })
            scene.add(fbx)
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
    const skyboxGeometry = new THREE.BoxGeometry(200, 100, 200);
    const skyboxMaterials = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load(rt), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(lf), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(up), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(dn), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(bk), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(ft), side: THREE.DoubleSide }),
    ];
    const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    skyboxMesh.position.set(0, 50, 50)
    skyboxMesh.name = 'skyboxMesh';

    scene.add(skyboxMesh);
  }

  const render = () => {
    renderer.render(scene, camera)
    animate()
  }

  const animate = () => {
    // cube.position.x -= 0.01;
    // cube.rotation.y += 0.1;
    // model.rotateY(Math.PI);
    
    // for(let i = 0; i < mixer.length; i++) {
    // }
    
    requestAnimationFrame(render)
  }

  const plane = () => {
    const planeGeometry = new THREE.PlaneGeometry(200, 200)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    plane.position.set(0, -0.4, 0)
    scene.add(plane)
  }

  const help = () =>  {
    const axes = new THREE.AxesHelper(60) // 參數為座標軸長度
    scene.add(axes)
  }

  const people = () => {
    const headGeo = new THREE.SphereGeometry( 1, 32, 16 );
    const headMat = new THREE.MeshBasicMaterial( { color: 0xff3400 } );
    const bodyGeo = new THREE.BoxGeometry(3, 3, 3)

    const peopleMat = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const head = new THREE.Mesh(headGeo, headMat)
    head.position.set(0, 8, 0)
    const body = new THREE.Mesh(bodyGeo, peopleMat)
    body.position.set(0, 6, 0)


    const kneeGeo = new THREE.BoxGeometry(1, 3, 1)
    const kneeMat = new THREE.MeshPhongMaterial({ color: 0x00ffff })
    const kneeLeft = new THREE.Mesh(kneeGeo, kneeMat)
    kneeLeft.position.set(-1, 3, 0)

    const kneeRight = kneeLeft.clone()
    kneeRight.position.set(1, 3, 0)

    const feetGeo = new THREE.BoxGeometry(1, 3, 1)
    const feetMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    const feetLeft = new THREE.Mesh(feetGeo, feetMat)
    feetLeft.position.set(-1, 0, 0)
    
    const feetRight = feetLeft.clone()
    feetRight.position.set(1, 0, 0)


    const armGeo = new THREE.BoxGeometry(3, 1, 1)
    const armMat = new THREE.MeshPhongMaterial({ color: 0xff00ff})
    const armLeft = new THREE.Mesh(armGeo, armMat)
    armLeft.position.set(-3, 6, 0)

    const armRight = armLeft.clone()
    armRight.position.set(3, 6, 0)

    const handGeo = new THREE.BoxGeometry(2, 1, 1)
    const handMat = new THREE.MeshPhongMaterial({ color: 0xff00ff})
    handLeft = new THREE.Mesh(handGeo, handMat)
    handLeft.position.set(-4, 6, 0)

    const handRight = handLeft.clone()
    handRight.position.set(4, 6, 0)

    leftHand = new THREE.Group()
    leftHand.add(armLeft);
    leftHand.add(handLeft);

    rightHand = new THREE.Group()
    rightHand.add(armRight)
    rightHand.add(handRight)

    const people = new THREE.Group()
    people.add(head)
    people.add(body)
    people.add(leftHand)
    people.add(rightHand)
    people.add(kneeLeft)
    people.add(kneeRight)
    people.add(feetRight)
    people.add(feetLeft)
    scene.add(people)
    people.castShadow = true
    people.receiveShadow = true


    // console.log(leftHand.rotation.y = 0.5);
    let angle = 0;
    leftHand.rotation.y = angle / 180 * Math.PI;
    // leftHand.translate()
    // leftHand.rotation.z = 10;
    // leftHand.rotateY(0.5 * Math.PI)
    // leftHand.rotation.y = 0.5 * Math.PI;
      // leftHand.rotation.y = 0.3 * Math.PI;
    // leftHand.rotation.y = 0.5 * Math.PI;
        // rightHand.rotateY(+0.5 * Math.PI)
      // } else {
      //   leftHand.rotateY(0.5 * Math.PI)
      //   rightHand.rotateY(-0.5 * Math.PI)
    
  }

  const rotate = () => {
    const angle = i % 91;
    console.log(angle);
    leftHand.rotation.y = angle / 180 * Math.PI;
    if(i >= 90) {
      minus = true;
    }
    if(i === 0) {
      minus = false;
    }

    if(minus) {
      i -= 5;
    } else {
      i += 5;
    }
  }

  const RestartFun = () => {
    setRestart(false);
    setStart(true);
    // camera.position.set(0, 5, 100);
    // camera.lookAt((0, 10, 0)) // 相機焦點
    setTimeout(() => {
      setStart(false);
      startCircle();
      starting = true;
    }, 500)
  }

  return (
    <>
      <canvas ref={canvasRef} />
      <button onClick={rotate.bind(this)}>12213</button>
      {gameOver && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffffff', fontSize: '40px'}}>Game Over</div>}
      {start && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffffff', fontSize: '40px'}}>開始</div>}
      {restart && <div onClick={RestartFun.bind(this)} className='restart-div'>重新開始</div>}
    </>
  )
}

export default App;
