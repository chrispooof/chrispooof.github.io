import * as THREE from 'three'
import { ARM_SWING, IDLE_LERP, WALK_BOB, WALK_SWING } from '../utils/constants'

// Shared geometries — identical left/right pairs reuse the same buffer
const armGeo = new THREE.BoxGeometry(0.18, 0.55, 0.18)
const legGeo = new THREE.BoxGeometry(0.22, 0.55, 0.22)

class Player {
  public character: THREE.Group

  // Materials
  private skinMat = new THREE.MeshLambertMaterial({ color: 0xf5cba7 })
  private bodyMat = new THREE.MeshLambertMaterial({ color: 0x2980b9 })
  private pantsMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 })
  private eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 })

  // Geometries
  private torsoGeo = new THREE.BoxGeometry(0.55, 0.7, 0.3)
  private headGeo = new THREE.BoxGeometry(0.45, 0.45, 0.42)

  // Meshes
  private torso: THREE.Mesh
  private head: THREE.Mesh
  private leftArm: THREE.Mesh
  private rightArm: THREE.Mesh
  private leftLeg: THREE.Mesh
  private rightLeg: THREE.Mesh

  constructor() {
    this.character = new THREE.Group()
    this.torso = new THREE.Mesh(this.torsoGeo, this.bodyMat)
    this.head = new THREE.Mesh(this.headGeo, this.skinMat)
    this.leftArm = new THREE.Mesh(armGeo, this.bodyMat)
    this.rightArm = new THREE.Mesh(armGeo, this.bodyMat)
    this.leftLeg = new THREE.Mesh(legGeo, this.pantsMat)
    this.rightLeg = new THREE.Mesh(legGeo, this.pantsMat)

    this.createTorso()
    this.createHead()
    this.createArms()
    this.createLegs()
    this.createFace()
  }

  /**
   * Positions the torso and adds it to the character group.
   */
  createTorso(): void {
    this.torso.position.y = 1.1
    this.torso.castShadow = true
    this.character.add(this.torso)
  }

  /**
   * Positions the head and adds it to the character group.
   */
  createHead(): void {
    this.head.position.y = 1.7
    this.head.castShadow = true
    this.character.add(this.head)
  }

  /**
   * Positions both arms and adds them to the character group.
   */
  createArms(): void {
    this.leftArm.position.set(-0.38, 1.05, 0)
    this.leftArm.castShadow = true
    this.character.add(this.leftArm)

    this.rightArm.position.set(0.38, 1.05, 0)
    this.rightArm.castShadow = true
    this.character.add(this.rightArm)
  }

  /**
   * Positions both legs and adds them to the character group.
   */
  createLegs(): void {
    this.leftLeg.position.set(-0.15, 0.48, 0)
    this.leftLeg.castShadow = true
    this.character.add(this.leftLeg)

    this.rightLeg.position.set(0.15, 0.48, 0)
    this.rightLeg.castShadow = true
    this.character.add(this.rightLeg)
  }

  /**
   * Creates eyes and a mouth as children of the head mesh so they follow head animation.
   */
  createFace(): void {
    const faceMat = new THREE.MeshBasicMaterial({ color: 0x222222 })

    // Eyes — parented to head so they bob during walk animation
    const eyeXPositions = [-0.1, 0.1]
    eyeXPositions.forEach((eyeX) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), this.eyeMat)
      eye.position.set(eyeX, 1.73, 0.22)
      this.character.add(eye)
    })

    // Mouth
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.01), faceMat)
    mouth.position.set(0, -0.1, 0.22)
    this.head.add(mouth)
  }

  /** Snaps the character into a bonfire-sitting pose. */
  applySitPose(): void {
    this.leftLeg.rotation.x = Math.PI * 0.48
    this.rightLeg.rotation.x = Math.PI * 0.48
    this.leftArm.rotation.x = 0.65
    this.rightArm.rotation.x = 0.65
    this.torso.rotation.x = 0.12
    this.torso.position.y = 1.0
    this.head.position.y = 1.62
  }

  /**
   * Lerps all limb rotations back toward the neutral standing pose.
   * @param factor - Lerp factor per frame (e.g. dt * 2.5 for a slow rise)
   */
  lerpTowardStand(factor: number): void {
    this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, factor)
    this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, factor)
    this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, factor)
    this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, factor)
    this.torso.rotation.x = THREE.MathUtils.lerp(this.torso.rotation.x, 0, factor)
    this.torso.position.y = THREE.MathUtils.lerp(this.torso.position.y, 1.1, factor)
    this.head.position.y = THREE.MathUtils.lerp(this.head.position.y, 1.7, factor)
  }

  /**
   * Animates the character's walk cycle.
   * @param dt - Delta time in seconds
   * @param isMoving - Whether the character is moving
   * @param walkPhase - Current walk phase
   */
  animateCharacter = (dt: number, isMoving: boolean, walkPhase: number): void => {
    if (isMoving) {
      const sw = Math.sin(walkPhase)
      this.leftLeg.rotation.x = sw * WALK_SWING
      this.rightLeg.rotation.x = -sw * WALK_SWING
      this.leftArm.rotation.x = -sw * ARM_SWING
      this.rightArm.rotation.x = sw * ARM_SWING
      this.torso.position.y = 1.1 + Math.abs(sw) * WALK_BOB
      this.head.position.y = 1.7 + Math.abs(sw) * WALK_BOB
    } else {
      const t = IDLE_LERP * dt
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, t)
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, t)
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, t)
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, t)
      this.torso.position.y = THREE.MathUtils.lerp(this.torso.position.y, 1.1, t)
      this.head.position.y = THREE.MathUtils.lerp(this.head.position.y, 1.7, t)
    }
  }
}

const PlayerInstance = new Player()

export default PlayerInstance
