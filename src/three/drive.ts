import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Fog,
  Group,
  Line,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'

const BG = 0x090b10
const ASPHALT = 0x0e121a
const LIME = 0xc4f542
const STEEL = 0x9fb1d0
const GRID = 0x4c6a8a
const GOLD = 0xffcb47
const RED = 0xff5d73

// The car stays at z = 0 and the world scrolls towards the camera (+Z).
const ROAD_HALF = 3.6
const ROAD_NEAR = 14
const ROAD_FAR = -120
const GRID_EXTENT = 50
const LANES = [-2.4, 0, 2.4]
const MAX_STEER = 2.7
const SPEED = 38 // world units per second
const DASH_PERIOD = 6
const GRID_PERIOD = 4
const LAMP_PERIOD = 16
const SKY_Z = -125

const SPAWN_Z = -92
const SPAWN_GAP = 1.25 // seconds between pickups
const MISS_Z = 7
const GRAB_DEPTH = 1.6
const GRAB_WIDTH = 1.2
const AUTOPILOT_AFTER_MS = 3500

const FOV = 55
// On wide screens the hero copy sits on the left, so the road is shifted right of centre.
const WIDE_FROM = 1080
const VIEW_SHIFT = 0.14

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

// Small seeded generator so the skyline and stars look the same on every visit.
function seeded(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647
}

interface LineOptions {
  color?: number
  opacity?: number
  fog?: boolean
  /** Per-vertex RGB triples; overrides `color`. */
  colors?: number[]
}

interface DotOptions {
  color: number
  size: number
  opacity?: number
  fog?: boolean
  attenuate?: boolean
}

function lines(points: number[], { color = 0xffffff, opacity = 1, fog = true, colors }: LineOptions = {}) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  if (colors) geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  const material = new LineBasicMaterial({
    color,
    opacity,
    transparent: opacity < 1,
    fog,
    vertexColors: Boolean(colors),
  })
  return new LineSegments(geometry, material)
}

function dots(points: number[], { color, size, opacity = 1, fog = true, attenuate = true }: DotOptions) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  const material = new PointsMaterial({
    color,
    size,
    opacity,
    transparent: opacity < 1,
    fog,
    sizeAttenuation: attenuate,
  })
  return new Points(geometry, material)
}

function buildRoad() {
  const surface = new Mesh(
    new PlaneGeometry(ROAD_HALF * 2, ROAD_NEAR - ROAD_FAR),
    new MeshBasicMaterial({ color: ASPHALT }),
  )
  surface.rotation.x = -Math.PI / 2
  surface.position.set(0, -0.02, (ROAD_NEAR + ROAD_FAR) / 2)

  const edges = []
  const rails = []
  for (const side of [-1, 1]) {
    edges.push(side * ROAD_HALF, 0, ROAD_NEAR, side * ROAD_HALF, 0, ROAD_FAR)
    for (let x = ROAD_HALF + 4; x <= GRID_EXTENT; x += 4) rails.push(side * x, 0, ROAD_NEAR, side * x, 0, ROAD_FAR)
  }
  const fixed = new Group()
  fixed.add(surface, lines(edges, { color: LIME, opacity: 0.9 }), lines(rails, { color: GRID, opacity: 0.35 }))

  // Everything below repeats, so each group only ever moves by one period before wrapping.
  const dashPoints = []
  for (let z = ROAD_NEAR; z > ROAD_FAR - DASH_PERIOD; z -= DASH_PERIOD) {
    for (const x of [-1.2, 1.2]) dashPoints.push(x, 0, z, x, 0, z - 2.4)
  }

  const crossPoints = []
  for (let z = ROAD_NEAR; z > ROAD_FAR - GRID_PERIOD; z -= GRID_PERIOD) {
    for (const side of [-1, 1]) crossPoints.push(side * ROAD_HALF, 0, z, side * GRID_EXTENT, 0, z)
  }

  const postPoints = []
  const headPoints = []
  for (let z = ROAD_NEAR; z > ROAD_FAR - LAMP_PERIOD; z -= LAMP_PERIOD) {
    for (const side of [-1, 1]) {
      const x = side * (ROAD_HALF + 1)
      const armX = x - side * 1.1
      postPoints.push(x, 0, z, x, 3.4, z, x, 3.4, z, armX, 3.4, z)
      headPoints.push(armX, 3.4, z)
    }
  }
  const lamps = new Group()
  lamps.add(lines(postPoints, { color: STEEL, opacity: 0.45 }), dots(headPoints, { color: GOLD, size: 0.34 }))

  return {
    fixed,
    dashes: lines(dashPoints, { color: STEEL, opacity: 0.8 }),
    cross: lines(crossPoints, { color: GRID, opacity: 0.35 }),
    lamps,
  }
}

/** Striped sun, city skyline and stars. All sit beyond the fog, so they ignore it. */
function buildSky() {
  const random = seeded(11)

  const sunPoints = []
  const sunColors = []
  const radius = 15
  for (let y = 0.4; y < radius; y += 0.45) {
    const half = Math.sqrt(radius * radius - y * y)
    const k = y / radius
    sunPoints.push(-half, y, SKY_Z - 10, half, y, SKY_Z - 10)
    // Gold at the top, shading to red at the horizon.
    const color = [1, 0.36 + 0.44 * k, 0.45 - 0.17 * k]
    sunColors.push(...color, ...color)
  }

  const fill = []
  const outline = []
  const windows = []
  let x = -150
  while (x < 150) {
    const width = 2.5 + random() * 4.5
    // Keep the towers in front of the sun low so it stays visible above them.
    const nearSun = Math.abs(x + width / 2) < 17
    const height = nearSun ? 1.5 + random() * 3 : 2 + random() * random() * 22
    const left = x
    const right = x + width
    x = right + random() * 1.5
    fill.push(
      left,
      0,
      SKY_Z,
      right,
      0,
      SKY_Z,
      right,
      height,
      SKY_Z,
      left,
      0,
      SKY_Z,
      right,
      height,
      SKY_Z,
      left,
      height,
      SKY_Z,
    )
    outline.push(
      left,
      0,
      SKY_Z,
      left,
      height,
      SKY_Z,
      left,
      height,
      SKY_Z,
      right,
      height,
      SKY_Z,
      right,
      height,
      SKY_Z,
      right,
      0,
      SKY_Z,
    )
    for (let n = 0; n < height / 3; n++) {
      windows.push(left + 0.5 + random() * (width - 1), 0.6 + random() * (height - 1.2), SKY_Z + 0.1)
    }
  }
  const fillGeometry = new BufferGeometry()
  fillGeometry.setAttribute('position', new Float32BufferAttribute(fill, 3))
  const towers = new Mesh(fillGeometry, new MeshBasicMaterial({ color: BG, fog: false }))

  const starPoints = []
  for (let n = 0; n < 170; n++) starPoints.push((random() - 0.5) * 320, 10 + random() * 90, SKY_Z - 20)

  return [
    dots(starPoints, { color: STEEL, size: 1.5, opacity: 0.6, fog: false, attenuate: false }),
    lines(sunPoints, { colors: sunColors, opacity: 0.8, fog: false }),
    towers,
    lines(outline, { color: STEEL, opacity: 0.4, fog: false }),
    dots(windows, { color: GOLD, size: 1.5, opacity: 0.55, fog: false, attenuate: false }),
  ]
}

/** A boxy wireframe coupe seen from behind, with tail lights and underglow. */
function buildCar() {
  const car = new Group()
  // Offset the fill slightly so the edge lines drawn on top of it do not z-fight.
  const body = new MeshBasicMaterial({
    color: 0x0b0e15,
    fog: false,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  })
  const wire = new LineBasicMaterial({ color: LIME, fog: false })

  const part = (width: number, height: number, depth: number, x: number, y: number, z: number) => {
    const geometry = new BoxGeometry(width, height, depth)
    const mesh = new Mesh(geometry, body)
    mesh.position.set(x, y, z)
    mesh.add(new LineSegments(new EdgesGeometry(geometry), wire))
    car.add(mesh)
  }
  part(1.7, 0.42, 3.7, 0, 0.5, 0)
  part(1.3, 0.36, 1.6, 0, 0.89, 0.35)
  part(1.7, 0.06, 0.32, 0, 1.13, 1.62)
  for (const x of [-0.9, 0.9]) for (const z of [-1.15, 1.15]) part(0.22, 0.44, 0.7, x, 0.24, z)

  const tailLight = new MeshBasicMaterial({ color: RED, fog: false })
  for (const x of [-0.55, 0.55]) {
    const light = new Mesh(new BoxGeometry(0.44, 0.1, 0.04), tailLight)
    light.position.set(x, 0.56, 1.87)
    car.add(light)
  }

  const glow = new Mesh(
    new PlaneGeometry(2.7, 4.7),
    new MeshBasicMaterial({
      color: LIME,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: AdditiveBlending,
      fog: false,
    }),
  )
  glow.rotation.x = -Math.PI / 2
  glow.position.y = 0.02
  car.add(glow)
  return car
}

function buildRing() {
  const points = []
  for (let k = 0; k < 32; k++) points.push(Math.cos((k / 32) * Math.PI * 2), 0, Math.sin((k / 32) * Math.PI * 2))
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  const ring = new LineLoop(geometry, new LineBasicMaterial({ color: LIME, transparent: true, fog: false }))
  ring.visible = false
  return ring
}

export interface DriveOptions {
  /** Element whose size the scene follows and that pointer steering is measured against. */
  host: HTMLElement
  canvas: HTMLCanvasElement
  /** HTML elements used as name tags for the pickups; one pickup can be on the road per tag. */
  tags: HTMLElement[]
  /** Skill names, in the order they come down the road. */
  skills: string[]
  speedEl: HTMLElement | null
  onCollect: (skillIndex: number, byVisitor: boolean) => void
  onMode: (manual: boolean) => void
}

interface Pickup {
  gem: Mesh
  tag: HTMLElement
  active: boolean
  /** Index into `skills`, or -1 while unused. */
  skill: number
}

/**
 * Renders the night drive into `canvas`. Skills come down the road as pickups; the car grabs them on
 * autopilot until the visitor steers. Returns a dispose function.
 */
export function createDrive({ host, canvas, tags, skills, speedEl, onCollect, onMode }: DriveOptions) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  scene.fog = new Fog(BG, 30, 105)
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 260)
  const road = buildRoad()
  const car = buildCar()
  const ring = buildRing()
  scene.add(...buildSky(), road.fixed, road.dashes, road.cross, road.lamps, car, ring)

  const gemGeometry = new OctahedronGeometry(0.5)
  const pickups = tags.map((tag): Pickup => {
    const gem = new Mesh(gemGeometry, new MeshBasicMaterial({ color: LIME }))
    gem.visible = false
    scene.add(gem)
    return { gem, tag, active: false, skill: -1 }
  })

  const tanHalfFov = Math.tan((FOV / 2) * (Math.PI / 180))
  const collected = new Set()
  const keys = new Set()
  const projected = new Vector3()
  let width = 1
  let height = 1
  let roadCentre = 0.5 // horizontal position of the road on screen, 0..1
  let last = 0
  let travelled = 0
  let sinceSpawn = SPAWN_GAP
  let sinceReadout = 1
  let lastLane = 1
  let nextSkill = 0
  let targetX = 0
  let lastInput = -Infinity
  let manual = false
  let ringAge = 1

  function pickSkill() {
    const onRoad = new Set(pickups.filter((pickup) => pickup.active).map((pickup) => pickup.skill))
    const allCollected = collected.size >= skills.length
    for (let n = 0; n < skills.length; n++) {
      const index = (nextSkill + n) % skills.length
      if (onRoad.has(index) || (!allCollected && collected.has(index))) continue
      nextSkill = index + 1
      return index
    }
    return -1
  }

  function spawn(pickup: Pickup) {
    const skill = pickSkill()
    if (skill < 0) return false
    const lane = (lastLane + 1 + Math.floor(Math.random() * (LANES.length - 1))) % LANES.length
    lastLane = lane
    pickup.active = true
    pickup.skill = skill
    pickup.gem.visible = true
    pickup.gem.position.set(LANES[lane], 0.9, SPAWN_Z)
    pickup.tag.textContent = skills[skill]
    return true
  }

  function retire(pickup: Pickup) {
    pickup.active = false
    pickup.gem.visible = false
  }

  function step(dt: number, now: number) {
    travelled += SPEED * dt
    road.dashes.position.z = travelled % DASH_PERIOD
    road.cross.position.z = travelled % GRID_PERIOD
    road.lamps.position.z = travelled % LAMP_PERIOD

    const left = keys.has('arrowleft') || keys.has('a')
    const right = keys.has('arrowright') || keys.has('d')
    if (left !== right) {
      targetX = clamp(targetX + (right ? 1 : -1) * 9 * dt, -MAX_STEER, MAX_STEER)
      lastInput = now
    }

    const driving = now - lastInput < AUTOPILOT_AFTER_MS
    if (driving !== manual) {
      manual = driving
      onMode(manual)
    }
    if (!manual) {
      // Autopilot: line up with the closest pickup that is still ahead of the car.
      const ahead = pickups.filter((pickup) => pickup.active && pickup.gem.position.z < -GRAB_DEPTH)
      const next = ahead.sort((a, b) => b.gem.position.z - a.gem.position.z)[0]
      if (next && next.gem.position.z > -70) targetX = next.gem.position.x
    }

    const steer = targetX - car.position.x
    car.position.x += steer * (1 - Math.exp(-dt * 7))
    car.rotation.y = clamp(-steer * 0.09, -0.3, 0.3)
    car.rotation.z = clamp(-steer * 0.05, -0.12, 0.12)

    sinceSpawn += dt
    if (sinceSpawn >= SPAWN_GAP) {
      const free = pickups.find((pickup) => !pickup.active)
      if (free && spawn(free)) sinceSpawn = 0
    }

    for (const pickup of pickups) {
      if (!pickup.active) continue
      const { position, rotation } = pickup.gem
      position.z += SPEED * dt
      rotation.y += dt * 2.4
      if (Math.abs(position.z) < GRAB_DEPTH && Math.abs(position.x - car.position.x) < GRAB_WIDTH) {
        retire(pickup)
        collected.add(pickup.skill)
        ring.position.set(car.position.x, 0.6, 0)
        ring.visible = true
        ringAge = 0
        onCollect(pickup.skill, manual)
      } else if (position.z > MISS_Z) {
        retire(pickup)
      }
    }

    if (ring.visible) {
      ringAge += dt / 0.45
      ring.scale.setScalar(1 + ringAge * 3.2)
      ring.material.opacity = 1 - ringAge
      ring.visible = ringAge < 1
    }

    sinceReadout += dt
    if (speedEl && sinceReadout >= 0.25) {
      sinceReadout = 0
      speedEl.textContent = `${Math.round(196 + 7 * Math.sin(now / 900) + collected.size * 2)} km/h`
    }
  }

  function draw() {
    camera.position.set(car.position.x * 0.3, 3.2, 8.5)
    camera.lookAt(car.position.x * 0.15, 0.8, -12)
    camera.updateMatrixWorld()

    for (const { gem, tag, active } of pickups) {
      if (!tag) continue
      if (!active) {
        tag.style.opacity = '0'
        continue
      }
      projected.set(gem.position.x, gem.position.y + 0.9, gem.position.z).project(camera)
      const x = ((projected.x + 1) / 2) * width
      const y = ((1 - projected.y) / 2) * height
      // Fade in out of the fog, and out again just before the car reaches the pickup.
      const fadeIn = clamp((gem.position.z - SPAWN_Z) / 35, 0, 1)
      const fadeOut = clamp((-gem.position.z - 1) / 5, 0, 1)
      tag.style.opacity = Math.min(fadeIn, fadeOut).toFixed(2)
      tag.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`
    }

    renderer.render(scene, camera)
  }

  function frame(ms = performance.now()) {
    const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0
    last = ms
    step(dt, ms)
    draw()
  }

  function resize() {
    width = host.clientWidth
    height = host.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    if (width >= WIDE_FROM) {
      camera.setViewOffset(width, height, -width * VIEW_SHIFT, 0, width, height)
      roadCentre = 0.5 + VIEW_SHIFT
    } else {
      camera.clearViewOffset()
      roadCentre = 0.5
    }
    camera.updateProjectionMatrix()
    if (reducedMotion) draw()
  }

  let visible = true
  function syncLoop() {
    const run = !reducedMotion && visible && !document.hidden
    if (!run) last = 0
    renderer.setAnimationLoop(run ? frame : null)
  }

  function onPointer(event: PointerEvent) {
    const rect = host.getBoundingClientRect()
    if (event.clientY < rect.top || event.clientY > rect.bottom) return
    // Map the pointer to the road position underneath it at the car's depth.
    const halfWidthAtCar = 9 * tanHalfFov * camera.aspect
    targetX = clamp(((event.clientX - rect.left) / rect.width - roadCentre) * 2 * halfWidthAtCar, -MAX_STEER, MAX_STEER)
    lastInput = performance.now()
  }

  function onKey(event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    if (!['arrowleft', 'arrowright', 'a', 'd'].includes(key)) return
    if (event.type === 'keyup') {
      keys.delete(key)
      return
    }
    // Leave the arrow keys alone while they are driving a tab list further down the page.
    const inTabList = event.target instanceof Element && event.target.closest('[role="tablist"]')
    if (visible && !inTabList) keys.add(key)
  }

  const clearKeys = () => keys.clear()

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (!visible) keys.clear()
    syncLoop()
  })
  visibilityObserver.observe(host)
  document.addEventListener('visibilitychange', syncLoop)
  if (!reducedMotion) {
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    window.addEventListener('blur', clearKeys)
  }

  resize()
  if (reducedMotion) {
    // A still frame with two pickups already on the road.
    ;[-24, -52].forEach((z, i) => {
      if (pickups[i] && spawn(pickups[i])) pickups[i].gem.position.z = z
    })
  }
  draw()
  syncLoop()

  return function dispose() {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    document.removeEventListener('visibilitychange', syncLoop)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('pointerdown', onPointer)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('keyup', onKey)
    window.removeEventListener('blur', clearKeys)
    scene.traverse((object) => {
      // Meshes, lines and points are the only objects here that own GPU resources.
      if (!(object instanceof Mesh || object instanceof Line || object instanceof Points)) return
      object.geometry.dispose()
      for (const material of [object.material].flat()) material.dispose()
    })
    renderer.dispose()
  }
}
