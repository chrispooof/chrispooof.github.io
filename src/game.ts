import * as THREE from 'three'
import PlayerInstance from './characters/player'
import './controls/camera'
import { getInteractPressed, getMovement, isInputBlocked } from './controls/user'
import './hud/controls'
import { hidePrompt, showPrompt } from './hud/prompt'
import { openBonfireMenu } from './interactions/bonfireMenu'
import { getNearby, registerInteractable, updateNearby } from './interactions/interactables'
import { openPhotoViewer } from './interactions/photoViewer'
import {
  CAMERA_DIST,
  CAMERA_HEIGHT,
  CAMERA_LERP,
  CAMERA_LOOK_OFFSET,
  CAMERA_PITCH,
  CAMERA_YAW,
  MOVE_SPEED,
  PLAYER_RADIUS,
  TURN_LERP_FACTOR,
  TURN_SPEED,
  WALK_SPEED_FACTOR,
} from './utils/constants'
import { addScenery, getHeight } from './utils/utils'
import { cameraBlockers } from './world/cameraBlockers'
import { checkCollision } from './world/colliders'
import { addCorridor, updateTorches } from './world/corridor'
import BonfireInstance from './world/features/bonfire'
import { Painting } from './world/features/painting'
import { Boundaries, Terrain } from './world/terrain'

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
  private readonly cameraDesired = new THREE.Vector3()
  private readonly cameraForward = new THREE.Vector3()
  private readonly cameraSide = new THREE.Vector3()
  private readonly moveVec = new THREE.Vector3()
  private readonly nextPos = new THREE.Vector3()
  private readonly camRaycaster = new THREE.Raycaster()
  private readonly camRayOrigin = new THREE.Vector3()
  private readonly camRayDir = new THREE.Vector3()
  private readonly promptWorldPos = new THREE.Vector3()
  private lastTime = performance.now()

  // Character state
  private characterYaw = Math.PI
  private walkPhase = 0
  private totalTime = 0

  // Light state
  private ambient: THREE.AmbientLight
  private sun: THREE.DirectionalLight

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.ambient = new THREE.AmbientLight(0x151520, 0.8)
    this.sun = new THREE.DirectionalLight(0x221111, 0.25)
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0f)
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.09)
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

    // Add lights — dim ambient + weak directional for shadow casting
    this.scene.add(this.ambient)
    this.sun.position.set(0, 10, 0)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(1024, 1024)
    this.sun.shadow.camera.near = 1
    this.sun.shadow.camera.far = 30
    const sc: THREE.OrthographicCamera = this.sun.shadow.camera
    sc.left = sc.bottom = -12
    sc.right = sc.top = 12
    this.scene.add(this.sun)

    // Add terrain, corridor, scenery, and bonfire
    this.scene.add(Terrain)
    addCorridor(this.scene)
    addScenery(this.scene)
    BonfireInstance.place(this.scene, new THREE.Vector3(0, 0, -1))

    // Mount paintings centered between each pair of pillars (pillars at z=-2,-5,-8; midpoints below)
    new Painting(this.scene, 0x1a1040).place(new THREE.Vector3(2.7, 1.8, 0)) // eclipse    — midpoint: pillar z=+2 → pillar z=-2
    new Painting(this.scene, 0x3a1020).place(new THREE.Vector3(2.7, 1.8, -3.5)) // japan      — midpoint: pillar z=-2 → pillar z=-5
    new Painting(this.scene, 0x0a2a20).place(new THREE.Vector3(2.7, 1.8, -6.5)) // costa-rica — midpoint: pillar z=-5 → pillar z=-8

    // Register interactables
    registerInteractable({
      x: 0,
      y: 1.8,
      z: -1,
      radius: 2,
      label: 'interact with bonfire',
      onInteract: openBonfireMenu,
    })
    registerInteractable({
      x: 2.7,
      y: 2.6,
      z: 0,
      radius: 1.8,
      label: 'view eclipse photos',
      onInteract: () => openPhotoViewer('eclipse', 'Eclipse'),
    })
    registerInteractable({
      x: 2.7,
      y: 2.6,
      z: -3.5,
      radius: 1.8,
      label: 'view japan photos',
      onInteract: () => openPhotoViewer('japan', 'Japan'),
    })
    registerInteractable({
      x: 2.7,
      y: 2.6,
      z: -6.5,
      radius: 1.8,
      label: 'view costa rica photos',
      onInteract: () => openPhotoViewer('costa-rica', 'Costa Rica'),
    })

    // Add character
    this.scene.add(PlayerInstance.character)

    // Add windowresize listener
    addEventListener('resize', () => {
      this.camera.aspect = innerWidth / innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(innerWidth, innerHeight)
    })

    this.renderer.setAnimationLoop(() => this.update())
  }

  /**
   * @description
   * Updates the game state and renders the scene
   */
  private update() {
    const now = performance.now()
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now
    this.totalTime += deltaTime
    BonfireInstance.update(this.totalTime)
    updateTorches(this.totalTime)

    const { moveX, moveZ } = getMovement()

    const yaw = CAMERA_YAW.value
    this.cameraForward.set(Math.sin(yaw), 0, Math.cos(yaw))
    this.cameraSide.set(Math.cos(yaw), 0, -Math.sin(yaw))

    const isMoving = moveX !== 0 || moveZ !== 0

    if (isMoving) {
      // Move character based on input
      this.moveVec
        .set(0, 0, 0)
        .addScaledVector(this.cameraForward, -moveZ)
        .addScaledVector(this.cameraSide, moveX)
        .normalize()
        .multiplyScalar(MOVE_SPEED * deltaTime)

      this.nextPos.copy(PlayerInstance.character.position).add(this.moveVec)
      if (
        Boundaries.containsPoint(this.nextPos) &&
        !checkCollision(this.nextPos.x, this.nextPos.z, PLAYER_RADIUS)
      ) {
        PlayerInstance.character.position.add(this.moveVec)
      }

      // Calculate the angle the character should face based on the movement direction
      const targetYaw = Math.atan2(this.moveVec.x, this.moveVec.z)

      // Finds the difference between where the character wants to face and where it's currently facing
      let diff = targetYaw - this.characterYaw

      // Normalize the difference to be within -π to π, preventing character from spinning around too much
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2

      // Character smoothly turns to face the direction it's moving, rather than instantly snapping to the new direction
      this.characterYaw += diff * Math.min(1, TURN_SPEED * deltaTime * TURN_LERP_FACTOR)

      // Update walk animation
      this.walkPhase += deltaTime * WALK_SPEED_FACTOR
    }

    PlayerInstance.character.rotation.y = this.characterYaw
    PlayerInstance.animateCharacter(deltaTime, isMoving, this.walkPhase)

    // Interaction proximity check
    updateNearby(PlayerInstance.character.position.x, PlayerInstance.character.position.z)
    const nearby = getNearby()
    if (nearby !== null) {
      this.promptWorldPos.set(nearby.x, nearby.y, nearby.z)
      this.promptWorldPos.project(this.camera)
      const screenX = ((this.promptWorldPos.x + 1) / 2) * innerWidth
      const screenY = ((-this.promptWorldPos.y + 1) / 2) * innerHeight
      showPrompt(nearby.label, screenX, screenY)
      if (!isInputBlocked() && getInteractPressed()) nearby.onInteract()
    } else {
      hidePrompt()
    }

    PlayerInstance.character.position.y = getHeight(PlayerInstance.character.position)

    // Calculate ideal camera position based on character position and orbit settings
    const pitch = CAMERA_PITCH.value
    const cosPitch = Math.cos(pitch)
    const camX = PlayerInstance.character.position.x + Math.sin(yaw) * CAMERA_DIST * cosPitch
    const camY = PlayerInstance.character.position.y + CAMERA_HEIGHT + Math.sin(pitch) * CAMERA_DIST
    const camZ = PlayerInstance.character.position.z + Math.cos(yaw) * CAMERA_DIST * cosPitch
    this.cameraDesired.set(camX, camY, camZ)

    // Pull the camera in if a wall or ceiling is between the player and the desired position
    this.camRayOrigin.copy(PlayerInstance.character.position)
    this.camRayOrigin.y += CAMERA_LOOK_OFFSET
    this.camRayDir.subVectors(this.cameraDesired, this.camRayOrigin)
    const fullDist = this.camRayDir.length()
    this.camRayDir.divideScalar(fullDist)
    this.camRaycaster.set(this.camRayOrigin, this.camRayDir)
    this.camRaycaster.far = fullDist
    const hits = this.camRaycaster.intersectObjects(cameraBlockers)
    if (hits.length > 0) {
      const safeDist = Math.max(0.5, hits[0].distance - 0.3)
      this.cameraDesired.copy(this.camRayOrigin).addScaledVector(this.camRayDir, safeDist)
    }

    this.camera.position.lerp(this.cameraDesired, CAMERA_LERP * deltaTime)
    this.cameraTarget.set(
      PlayerInstance.character.position.x,
      PlayerInstance.character.position.y + CAMERA_LOOK_OFFSET,
      PlayerInstance.character.position.z,
    )
    this.camera.lookAt(this.cameraTarget)

    this.renderer.render(this.scene, this.camera)
  }
}
