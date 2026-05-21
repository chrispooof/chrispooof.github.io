# Graph Report - .  (2026-05-21)

## Corpus Check
- Corpus is ~19,630 words - fits in a single context window. You may not need a graph.

## Summary
- 437 nodes · 807 edges · 33 communities (23 shown, 10 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.88)
- Token cost: 147,000 input · 38,000 output

## Community Hubs (Navigation)
- [[_COMMUNITY_HUD Controls & Input Blocking|HUD Controls & Input Blocking]]
- [[_COMMUNITY_AnimeAbout Overlay Viewers|Anime/About Overlay Viewers]]
- [[_COMMUNITY_Resume & Social Presence|Resume & Social Presence]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_User Input & Touch Prompts|User Input & Touch Prompts]]
- [[_COMMUNITY_Bookshelf Build & Materials|Bookshelf Build & Materials]]
- [[_COMMUNITY_Overlay Viewer Pattern|Overlay Viewer Pattern]]
- [[_COMMUNITY_Proximity Interaction System|Proximity Interaction System]]
- [[_COMMUNITY_Player Character Rig|Player Character Rig]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Camera Blocker System|Camera Blocker System]]
- [[_COMMUNITY_Pillar & Raycaster Utils|Pillar & Raycaster Utils]]
- [[_COMMUNITY_Collider Registry|Collider Registry]]
- [[_COMMUNITY_CD Table Feature|CD Table Feature]]
- [[_COMMUNITY_Camera & Terrain Constants|Camera & Terrain Constants]]
- [[_COMMUNITY_Animated Flame Features|Animated Flame Features]]
- [[_COMMUNITY_Book Viewer Overlay|Book Viewer Overlay]]
- [[_COMMUNITY_Game Bootstrap|Game Bootstrap]]
- [[_COMMUNITY_Painting & Wall Features|Painting & Wall Features]]
- [[_COMMUNITY_Start Screen|Start Screen]]
- [[_COMMUNITY_Bonfire Construction|Bonfire Construction]]
- [[_COMMUNITY_Camera Blocker Tests|Camera Blocker Tests]]
- [[_COMMUNITY_User Controls Tests|User Controls Tests]]
- [[_COMMUNITY_cspell Config|cspell Config]]
- [[_COMMUNITY_Vitest Pre-push Hook|Vitest Pre-push Hook]]
- [[_COMMUNITY_GitHub Pages Deploy|GitHub Pages Deploy]]
- [[_COMMUNITY_Tailwind Dependency|Tailwind Dependency]]
- [[_COMMUNITY_TypeScript Strict Settings|TypeScript Strict Settings]]
- [[_COMMUNITY_Vite Default Export|Vite Default Export]]

## God Nodes (most connected - your core abstractions)
1. `setInputBlocked()` - 28 edges
2. `hideControls()` - 17 edges
3. `showControls()` - 17 edges
4. `compilerOptions` - 15 edges
5. `isTouchDevice` - 15 edges
6. `Prompt` - 13 edges
7. `registerCollider()` - 12 edges
8. `Player` - 12 edges
9. `Menu` - 11 edges
10. `Project: Slingshot (Capital One)` - 11 edges

## Surprising Connections (you probably didn't know these)
- `three.js dependency` --references--> `Game`  [INFERRED]
  package.json → src/game.ts
- `GitHub Pages deploy workflow (source -> master)` --references--> `website (package.json)`  [EXTRACTED]
  .github/workflows/deploy.yml → package.json
- `HTML entry mounting /src/main.ts` --references--> `main.ts bootstrap (new Game())`  [EXTRACTED]
  index.html → src/main.ts
- `Book` --semantically_similar_to--> `MAL types`  [INFERRED] [semantically similar]
  src/types/hardcover.ts → src/types/mal.ts
- `Bookshelf` --semantically_similar_to--> `CDTable`  [INFERRED] [semantically similar]
  src/world/features/bookshelf.ts → src/world/features/cdTable.ts

## Hyperedges (group relationships)
- **Full-screen overlay viewer family (consistent open/close + input-block pattern)** — interactions_aboutviewer_class, interactions_resumeviewer_class, interactions_mangaviewer_class, interactions_animeviewer_class, interactions_bookviewer_class, interactions_photoviewer_class [INFERRED 0.95]
- **Game.init wires interactables to viewer/menu openers** — src_game_init, interactions_interactables_registerinteractable, interactions_bonfiremenu_openbonfiremenu, interactions_photoviewer_openphotoviewer, interactions_mangaviewer_openmangaviewer, interactions_bookviewer_openbookviewer, interactions_animeviewer_openanimeviewer [EXTRACTED 1.00]
- **Bonfire menu flow: openBonfireMenu -> Menu -> About/Resume viewers** — interactions_bonfiremenu_openbonfiremenu, interactions_menu_menu, interactions_aboutviewer_openaboutviewer, interactions_resumeviewer_openresumeviewer [EXTRACTED 1.00]
- **Corridor construction trio** — world_corridor_cls, world_terrain_terrain, world_decay_cls [INFERRED 0.85]
- **Singleton registry pattern for spatial state** — world_colliders_cls, world_camerablockers_cls [INFERRED 0.85]
- **Wall-mounted corridor decorations** — features_painting_painting, features_bookshelf_bookshelf, features_cdtable_cdtable, features_torch_torch [INFERRED 0.75]
- **Unified Input System (keyboard + touch + blocking)** — controls_user_getmovement, controls_user_settouchmovement, controls_user_setinputblocked, hud_touchcontrols_touchcontrols, controls_camera_setorbitblocked [INFERRED 0.85]
- **DOM HUD Overlay Suite** — hud_prompt_prompt, hud_startscreen_startscreen, hud_controls_controls, hud_touchcontrols_touchcontrols [INFERRED 0.85]
- **MAL/Hardcover Lambda Fetchers** — utils_api_fetchanimelist, utils_api_fetchmangalist, utils_api_fetchbooklist, utils_api_lambdapost [EXTRACTED 1.00]
- **Social Links Icon Set** — icons_github_icon, icons_facebook_icon, icons_linkedin_icon, icons_instagram_icon [INFERRED 0.95]
- **Capital One Tenure (Employer + Roles)** — resume_employer_capital_one, resume_role_senior_associate_swe, resume_role_associate_swe [EXTRACTED 1.00]
- **Resume Core Tech Stack (TS/React/AWS)** — resume_tech_typescript, resume_tech_react, resume_tech_aws [INFERRED 0.85]

## Communities (33 total, 10 thin omitted)

### Community 0 - "HUD Controls & Input Blocking"
Cohesion: 0.07
Nodes (27): CloudFront Photo Assets, Input blocking on overlay open, PHOTO_ALBUMS, setOrbitBlocked(), setInputBlocked(), Controls, hideControls(), showControls() (+19 more)

### Community 1 - "Anime/About Overlay Viewers"
Cohesion: 0.09
Nodes (24): AWS Lambda API Proxy, Lambda Proxy External API, AnimeViewer, openAnimeViewer(), STATUS_LABELS, STATUS_ORDER, viewer, STATUS_LABELS (+16 more)

### Community 2 - "Resume & Social Presence"
Cohesion: 0.09
Nodes (33): Social Links (concept), Facebook Icon (SVG), GitHub Icon (SVG), Instagram Icon (PNG), LinkedIn Icon (SVG), Certification: AWS Certified Solutions Architect - Associate, Christian Bjerre-Fernandes Resume, Education: University of Chicago, BS CS (2021) (+25 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.06
Nodes (31): dependencies, gh-pages, tailwindcss, @tailwindcss/vite, three, devDependencies, husky, jsdom (+23 more)

### Community 4 - "User Input & Touch Prompts"
Cohesion: 0.14
Nodes (13): user.test, getInteractPressed(), getMovement(), isInputBlocked(), keys, setTouchMovement(), triggerTouchInteract(), blockTouchBtn() (+5 more)

### Community 5 - "Bookshelf Build & Materials"
Cohesion: 0.15
Nodes (14): BOOK_COLORS, bookMats, Bookshelf, shelfMat, woodMat, makePRNG(), rand(), randInt() (+6 more)

### Community 6 - "Overlay Viewer Pattern"
Cohesion: 0.14
Nodes (13): Full-screen overlay viewer pattern (open/close blocks input), AboutViewer class, AnimeViewer class, BookViewer class, openBookViewer(), MangaViewer class, MangaViewer, openMangaViewer() (+5 more)

### Community 7 - "Proximity Interaction System"
Cohesion: 0.16
Nodes (13): Proximity-based interactable system (radius hit-test), interactables.test.ts (vitest suite), Interactables registry class, getNearby(), Interactable, Interactables, registerInteractable(), updateNearby() (+5 more)

### Community 8 - "Player Character Rig"
Cohesion: 0.16
Nodes (7): Player.applySitPose, armGeo, legGeo, Player.lerpTowardStand, Player, PlayerInstance, sw

### Community 9 - "TypeScript Compiler Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - "Camera Blocker System"
Cohesion: 0.15
Nodes (12): Collision System, cameraBlockers test suite, cameraBlockers, CameraBlockers, CameraBlockers, instance, registerCameraBlocker(), addCorridor() (+4 more)

### Community 11 - "Pillar & Raycaster Utils"
Cohesion: 0.20
Nodes (11): Dungeon World, PILLAR_Z_POSITIONS, pillarLocations, Pillar, _downDir, getHeight(), _raycaster, _rayOrigin (+3 more)

### Community 12 - "Collider Registry"
Cohesion: 0.22
Nodes (9): BonfireInstance, FLAME_CONFIGS, FlameConfig, colliders test suite, checkCollision(), Colliders, Collider, Colliders (+1 more)

### Community 13 - "CD Table Feature"
Cohesion: 0.23
Nodes (6): CASE_COLORS, caseMats, cdSilverMat, CDTable, metalMat, woodMat

### Community 14 - "Camera & Terrain Constants"
Cohesion: 0.31
Nodes (7): Player.animateCharacter, onDrag(), CAMERA_PITCH, CAMERA_YAW, constants, Boundaries, terrainGeo

### Community 15 - "Animated Flame Features"
Cohesion: 0.24
Nodes (5): Animated Flame Feature, Bonfire, FLAME_CONFIGS, Torch, TorchFlameConfig

### Community 17 - "Game Bootstrap"
Cohesion: 0.22
Nodes (6): HTML entry mounting /src/main.ts, three.js dependency, Game, main.ts bootstrap (new Game()), addScenery(), addDecay()

### Community 19 - "Start Screen"
Cohesion: 0.38
Nodes (3): Touch Device Branching, showStartScreen(), StartScreen

### Community 21 - "Camera Blocker Tests"
Cohesion: 0.40
Nodes (4): a, b, c, mesh

## Knowledge Gaps
- **130 isolated node(s):** `words`, `name`, `version`, `private`, `type` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `setInputBlocked()` connect `HUD Controls & Input Blocking` to `Anime/About Overlay Viewers`, `User Input & Touch Prompts`, `Overlay Viewer Pattern`, `Camera & Terrain Constants`, `Book Viewer Overlay`, `Game Bootstrap`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `hideControls()` connect `HUD Controls & Input Blocking` to `Anime/About Overlay Viewers`, `Overlay Viewer Pattern`, `Camera & Terrain Constants`, `Book Viewer Overlay`, `Game Bootstrap`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `setInputBlocked()` (e.g. with `Input blocking on overlay open` and `setOrbitBlocked()`) actually correct?**
  _`setInputBlocked()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `words`, `name`, `version` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HUD Controls & Input Blocking` be split into smaller, more focused modules?**
  _Cohesion score 0.06892655367231638 - nodes in this community are weakly interconnected._
- **Should `Anime/About Overlay Viewers` be split into smaller, more focused modules?**
  _Cohesion score 0.08858858858858859 - nodes in this community are weakly interconnected._
- **Should `Resume & Social Presence` be split into smaller, more focused modules?**
  _Cohesion score 0.08522727272727272 - nodes in this community are weakly interconnected._