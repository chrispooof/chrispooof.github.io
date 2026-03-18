import * as THREE from 'three'
import { ARM_SWING, IDLE_LERP, WALK_BOB, WALK_SWING } from '../utils/constants'

// Shared geometries — identical left/right pairs reuse the same buffer
const armGeo = new THREE.BoxGeometry(0.2, 0.55, 0.2)
const legGeo = new THREE.BoxGeometry(0.24, 0.55, 0.24)

/**
 * The player character: a Dark Souls-style armored knight assembled from box geometry.
 * Manages limb references for walk-cycle animation and sit/stand transitions.
 */
class Player {
  public character: THREE.Group

  // Materials
  private armorMat = new THREE.MeshLambertMaterial({ color: 0x3d3d48 })
  private darkArmorMat = new THREE.MeshLambertMaterial({ color: 0x252530 })
  private visorMat = new THREE.MeshBasicMaterial({ color: 0x060608 })
  private plumeMat = new THREE.MeshLambertMaterial({ color: 0x5a1010 })

  // Geometries
  private torsoGeo = new THREE.BoxGeometry(0.6, 0.72, 0.32)
  private headGeo = new THREE.BoxGeometry(0.5, 0.52, 0.48)

  // Meshes
  private torso: THREE.Mesh
  private head: THREE.Mesh
  private leftArm: THREE.Mesh
  private rightArm: THREE.Mesh
  private leftLeg: THREE.Mesh
  private rightLeg: THREE.Mesh

  constructor() {
    this.character = new THREE.Group()
    this.torso = new THREE.Mesh(this.torsoGeo, this.armorMat)
    this.head = new THREE.Mesh(this.headGeo, this.armorMat)
    this.leftArm = new THREE.Mesh(armGeo, this.armorMat)
    this.rightArm = new THREE.Mesh(armGeo, this.armorMat)
    this.leftLeg = new THREE.Mesh(legGeo, this.darkArmorMat)
    this.rightLeg = new THREE.Mesh(legGeo, this.darkArmorMat)

    this.createTorso()
    this.createHead()
    this.createArms()
    this.createLegs()
    this.createHelmetDetails()
    this.createPauldrons()
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
   * Positions the helmet and adds it to the character group.
   */
  createHead(): void {
    this.head.position.y = 1.72
    this.head.castShadow = true
    this.character.add(this.head)
  }

  /**
   * Positions both arms and adds them to the character group.
   */
  createArms(): void {
    this.leftArm.position.set(-0.41, 1.05, 0)
    this.leftArm.castShadow = true
    this.character.add(this.leftArm)

    this.rightArm.position.set(0.41, 1.05, 0)
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
   * Adds a visor slit and crest plume as children of the helmet mesh.
   * Parenting means they animate with any head movement.
   */
  createHelmetDetails(): void {
    // Visor slit — dark horizontal bar across the front face
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.02), this.visorMat)
    visor.position.set(0, 0.04, 0.25)
    this.head.add(visor)

    // Helmet crest running front-to-back along the top
    const plume = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.4), this.plumeMat)
    plume.position.set(0, 0.35, 0)
    this.head.add(plume)
  }

  /**
   * Adds pauldrons (shoulder plates) as children of the torso so they
   * inherit torso rotation during sit/stand animations.
   */
  createPauldrons(): void {
    const pauldronGeo = new THREE.BoxGeometry(0.24, 0.14, 0.3)

    const leftPauldron = new THREE.Mesh(pauldronGeo, this.darkArmorMat)
    leftPauldron.position.set(-0.4, 0.3, 0)
    this.torso.add(leftPauldron)

    const rightPauldron = new THREE.Mesh(pauldronGeo, this.darkArmorMat)
    rightPauldron.position.set(0.4, 0.3, 0)
    this.torso.add(rightPauldron)
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
    this.head.position.y = THREE.MathUtils.lerp(this.head.position.y, 1.72, factor)
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
      this.head.position.y = 1.72 + Math.abs(sw) * WALK_BOB
    } else {
      const t = IDLE_LERP * dt
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, t)
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, t)
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, t)
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, t)
      this.torso.position.y = THREE.MathUtils.lerp(this.torso.position.y, 1.1, t)
      this.head.position.y = THREE.MathUtils.lerp(this.head.position.y, 1.72, t)
    }
  }
}

const PlayerInstance = new Player()

export default PlayerInstance
