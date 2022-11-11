import './App.css';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import xBot from './models/xBot.fbx';
function App() {
  const canvasRef = useRef();
  let renderer;
  let scene;
  let camera;
  let handLeft;
  let leftHand;
  let rightHand;
  useEffect(() => {
    // 初始化
    init();
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    // 建立光源
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(120, 120, -120)
    scene.add(pointLight)
    plane()
    // 建立物體
    // people()
    const fbxLoader = new FBXLoader()
    fbxLoader.load(
        xBot,
        (object) => {
            console.log(object)
            // object.traverse(function (child) {
            //     if ((child as THREE.Mesh).isMesh) {
            //         // (child as THREE.Mesh).material = material
            //         if ((child as THREE.Mesh).material) {
            //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
            //         }
            //     }
            // })
            object.scale.set(.01, .01, .01)
            scene.add(object)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    help()
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
  });

  const init = () => {
    // 建立場景
    scene = new THREE.Scene();
    // 建立渲染器
    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current})
    renderer.setSize(window.innerWidth, window.innerHeight) // 場景大小
    renderer.setClearColor(0x000000, 1.0) // 預設背景顏色
    renderer.shadowMap.enable = true // 陰影效果
    renderer.shadowMap.enabled = true // 設定需渲染陰影效果
    renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

    // 建立相機
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.set(15, 15, 15) // 相機位置
    camera.lookAt(scene.position) // 相機焦點
  }

  const render = () => {
    renderer.render(scene, camera)
    animate()
  }

  const animate = () => {
    // cube.position.x -= 0.01;
    // cube.rotation.y += 0.1;
    
    requestAnimationFrame(render)
  }

  const plane = () => {
    const planeGeometry = new THREE.PlaneGeometry(120, 120)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    plane.position.set(0, -0.5, 0)
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

  return <canvas ref={canvasRef} />;
}

export default App;
