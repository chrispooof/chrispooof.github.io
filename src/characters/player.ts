import * as THREE from 'three'

const skinMat = new THREE.MeshLambertMaterial({ color: 0xf5cba7 })
const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2980b9 })
const pantsMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 })
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 })

const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.3), bodyMat)
torso.position.y = 1.1
torso.castShadow = true

const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.42), skinMat)
head.position.y = 1.7
head.castShadow = true

const armGeo = new THREE.BoxGeometry(0.18, 0.55, 0.18)
const leftArm = new THREE.Mesh(armGeo, bodyMat)
leftArm.position.set(-0.38, 1.05, 0)
leftArm.castShadow = true

const rightArm = new THREE.Mesh(armGeo, bodyMat)
rightArm.position.set(0.38, 1.05, 0)
rightArm.castShadow = true

const legGeo = new THREE.BoxGeometry(0.22, 0.55, 0.22)
const leftLeg = new THREE.Mesh(legGeo, pantsMat)
leftLeg.position.set(-0.15, 0.48, 0)
leftLeg.castShadow = true

const rightLeg = new THREE.Mesh(legGeo, pantsMat)
rightLeg.position.set(0.15, 0.48, 0)
rightLeg.castShadow = true

export const Character = new THREE.Group()
;[-0.1, 0.1].forEach((ex) => {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat)
  eye.position.set(ex, 1.73, 0.22)
  Character.add(eye)
})

Character.add(torso, head, leftArm, rightArm, leftLeg, rightLeg)

/**
 * Animates the character's walk cycle
 * @param dt - Delta time
 * @param isMoving - Whether the character is moving
 * @param walkPhase - Current walk phase
 */
export const animateCharacter = (dt: number, isMoving: boolean, walkPhase: number) => {
  if (isMoving) {
    const sw = Math.sin(walkPhase)
    leftLeg.rotation.x = sw * 0.55
    rightLeg.rotation.x = -sw * 0.55
    leftArm.rotation.x = -sw * 0.45
    rightArm.rotation.x = sw * 0.45
    torso.position.y = 1.1 + Math.abs(sw) * 0.04
    head.position.y = 1.7 + Math.abs(sw) * 0.04
  } else {
    leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, 10 * dt)
    rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, 10 * dt)
    leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, 10 * dt)
    rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 10 * dt)
    torso.position.y = THREE.MathUtils.lerp(torso.position.y, 1.1, 10 * dt)
    head.position.y = THREE.MathUtils.lerp(head.position.y, 1.7, 10 * dt)
  }
}
