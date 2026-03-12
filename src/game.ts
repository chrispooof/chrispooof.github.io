import * as THREE from 'three'
import { Character, animateCharacter } from './characters/player'
import { getMovement } from './controls/user'
import './hud/controls'
import {
  CAMERA_DIST,
  CAMERA_HEIGHT,
  CAMERA_PITCH,
  CAMERA_YAW,
  MOVE_SPEED,
  TURN_SPEED,
} from './utils/constants'
import { addScenery } from './world/scenery'
import { Boundaries, Terrain, getHeight } from './world/terrain'

/**
 * Main game class that manages the Three.js scene, camera, and game loop.
 *
 * @class Game
 * @property {THREE.WebGLRenderer} renderer - The WebGL renderer.
 * @property {THREE.Scene} scene - The Three.js scene.
 * @property {THREE.PerspectiveCamera} camera - The perspective camera.
 * @property {number} lastTime - The last time the game was updated.
 * @property {number} characterYaw - The character's yaw represents the character's horizontal rotation/direction they're facing.
 * 0 typically means facing forward (along positive Z axis)
 * π/2 (90°) means facing right (along positive X axis)
 * π (180°) means facing backward (along negative Z axis)
 * 3π/2 (270°) means facing left (along negative X axis)
 * @property {number} walkPhase - The character's walk phase.
 * @property {THREE.Vector3} cameraTarget - The camera's target position.
 */
export class Game {
  // Renderer and scene state
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private readonly cameraTarget = new THREE.Vector3()
  private lastTime = performance.now()

  // Character state
  private characterYaw = 0
  private walkPhase = 0

  // Light state
  private ambient: THREE.AmbientLight
  private sun: THREE.DirectionalLight

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.ambient = new THREE.AmbientLight(0xffffff, 0.6)
    this.sun = new THREE.DirectionalLight(0xfff5cc, 1.8)
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87ceeb)
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.018)
    this.camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 500)

    this.init()
  }

  private init() {
    // Set view size and pixel ratio
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setPixelRatio(devicePixelRatio)

    // Add Shadows
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    document.body.appendChild(this.renderer.domElement)

    // Add lights
    this.scene.add(this.ambient)
    this.sun.position.set(40, 80, 20)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.camera.near = 1
    this.sun.shadow.camera.far = 300
    const sc: THREE.OrthographicCamera = this.sun.shadow.camera
    sc.left = sc.bottom = -80
    sc.right = sc.top = 80
    this.scene.add(this.sun)

    // Add terrain and scenery
    this.scene.add(Terrain)
    addScenery(this.scene)

    // Add character
    this.scene.add(Character)

    // Add windowresize listener
    addEventListener('resize', () => {
      this.camera.aspect = innerWidth / innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(innerWidth, innerHeight)
    })

    this.renderer.setAnimationLoop(() => this.update())
  }

  private update() {
    const now = performance.now()
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now

    const { moveX, moveZ } = getMovement()

    const cameraForwardBack = new THREE.Vector3(
      Math.sin(CAMERA_YAW.value),
      0,
      Math.cos(CAMERA_YAW.value),
    )
    const cameraLeftRight = new THREE.Vector3(
      Math.cos(CAMERA_YAW.value),
      0,
      -Math.sin(CAMERA_YAW.value),
    )

    const isMoving = moveX !== 0 || moveZ !== 0

    if (isMoving) {
      // Move character based on input
      const move = new THREE.Vector3()
        .addScaledVector(cameraForwardBack, -moveZ)
        .addScaledVector(cameraLeftRight, moveX)
        .normalize()
        .multiplyScalar(MOVE_SPEED * deltaTime)

      if (Boundaries.containsPoint(Character.position.clone().add(move))) {
        Character.position.add(move)
      }

      // Calculate the angle the character should face based on the movement direction
      const targetYaw = Math.atan2(move.x, move.z)

      // Finds the difference between where the character wants to face and where it's currently facing
      let diff = targetYaw - this.characterYaw

      // Normalize the difference to be within -π to π, preventing character from spinning around too much
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2

      // Character smoothly turns to face the direction it's moving, rather than instantly snapping to the new direction
      this.characterYaw += diff * Math.min(1, TURN_SPEED * deltaTime * 8)
      Character.rotation.y = this.characterYaw

      // Update walk animation
      this.walkPhase += deltaTime * 9
    }

    animateCharacter(deltaTime, isMoving, this.walkPhase)

    Character.position.y = getHeight(Character.position.x, Character.position.z)

    // Calculate camera position based on character position and camera settings so it's following the character
    const camX =
      Character.position.x + Math.sin(CAMERA_YAW.value) * CAMERA_DIST * Math.cos(CAMERA_PITCH.value)
    const camY = Character.position.y + CAMERA_HEIGHT + Math.sin(CAMERA_PITCH.value) * CAMERA_DIST
    const camZ =
      Character.position.z + Math.cos(CAMERA_YAW.value) * CAMERA_DIST * Math.cos(CAMERA_PITCH.value)
    this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 10 * deltaTime)
    this.cameraTarget.set(Character.position.x, Character.position.y + 1.2, Character.position.z)
    this.camera.lookAt(this.cameraTarget)

    this.renderer.render(this.scene, this.camera)
  }
}
