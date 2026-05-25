# Graph Report - chrispooof.github.io  (2026-05-25)

## Corpus Check
- 47 files · ~19,706 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 520 nodes · 1185 edges · 33 communities (25 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e8eafc9b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Start Screen|Start Screen]]
- [[_COMMUNITY_Camera Blocker Tests|Camera Blocker Tests]]
- [[_COMMUNITY_User Controls Tests|User Controls Tests]]
- [[_COMMUNITY_cspell Config|cspell Config]]
- [[_COMMUNITY_Vitest Pre-push Hook|Vitest Pre-push Hook]]
- [[_COMMUNITY_GitHub Pages Deploy|GitHub Pages Deploy]]
- [[_COMMUNITY_Tailwind Dependency|Tailwind Dependency]]
- [[_COMMUNITY_TypeScript Strict Settings|TypeScript Strict Settings]]
- [[_COMMUNITY_Vite Default Export|Vite Default Export]]

## God Nodes (most connected - your core abstractions)
1. `setInputBlocked()` - 35 edges
2. `isTouchDevice` - 26 edges
3. `hideControls()` - 22 edges
4. `showControls()` - 22 edges
5. `registerCollider()` - 16 edges
6. `compilerOptions` - 15 edges
7. `Prompt` - 14 edges
8. `Menu` - 13 edges
9. `rand()` - 13 edges
10. `Player` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Book` --semantically_similar_to--> `MAL types`  [INFERRED] [semantically similar]
  types/hardcover.ts → src/types/mal.ts
- `Torch` --semantically_similar_to--> `Bonfire`  [INFERRED] [semantically similar]
  world/features/torch.ts → src/world/features/bonfire.ts
- `three.js dependency` --references--> `Game`  [INFERRED]
  package.json → game.ts
- `PHOTO_ALBUMS` --implements--> `CloudFront Photo Assets`  [INFERRED]
  config/photoAlbums.ts → src/config/photoAlbums.ts
- `Terrain` --conceptually_related_to--> `Corridor`  [INFERRED]
  world/terrain.ts → src/world/corridor.ts

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

## Communities (33 total, 8 thin omitted)

### Community 0 - "HUD Controls & Input Blocking"
Cohesion: 0.08
Nodes (30): Input blocking on overlay open, setOrbitBlocked(), keys, setInputBlocked(), setTouchMovement(), Controls, hideControls(), showControls() (+22 more)

### Community 1 - "Anime/About Overlay Viewers"
Cohesion: 0.09
Nodes (26): AWS Lambda API Proxy, Lambda Proxy External API, AnimeViewer, STATUS_LABELS, STATUS_ORDER, viewer, SHELF_LABELS, SHELF_ORDER (+18 more)

### Community 2 - "Resume & Social Presence"
Cohesion: 0.09
Nodes (33): Social Links (concept), Facebook Icon (SVG), GitHub Icon (SVG), Instagram Icon (PNG), LinkedIn Icon (SVG), Certification: AWS Certified Solutions Architect - Associate, Christian Bjerre-Fernandes Resume, Education: University of Chicago, BS CS (2021) (+25 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.06
Nodes (31): dependencies, gh-pages, tailwindcss, @tailwindcss/vite, three, devDependencies, husky, jsdom (+23 more)

### Community 4 - "User Input & Touch Prompts"
Cohesion: 0.08
Nodes (33): Player.animateCharacter, user.test, onDrag(), getInteractPressed(), getMovement(), isInputBlocked(), triggerTouchInteract(), PILLAR_Z_POSITIONS (+25 more)

### Community 5 - "Bookshelf Build & Materials"
Cohesion: 0.16
Nodes (15): BOOK_COLORS, bookMats, Bookshelf, shelfMat, woodMat, makePRNG(), rand(), randInt() (+7 more)

### Community 7 - "Proximity Interaction System"
Cohesion: 0.19
Nodes (14): Proximity-based interactable system (radius hit-test), interactables.test.ts (vitest suite), Interactables registry class, getNearby(), Interactable, Interactables, registerInteractable(), updateNearby() (+6 more)

### Community 8 - "Player Character Rig"
Cohesion: 0.18
Nodes (7): Player.applySitPose, armGeo, legGeo, Player.lerpTowardStand, Player, PlayerInstance, sw

### Community 9 - "TypeScript Compiler Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - "Camera Blocker System"
Cohesion: 0.10
Nodes (21): Animated Flame Feature, Collision System, Dungeon World, Bonfire, FLAME_CONFIGS, Torch, TorchFlameConfig, cameraBlockers test suite (+13 more)

### Community 11 - "Pillar & Raycaster Utils"
Cohesion: 0.19
Nodes (6): CloudFront Photo Assets, PHOTO_ALBUMS, url(), getAlbumUrls(), PhotoViewer, viewer

### Community 12 - "Collider Registry"
Cohesion: 0.10
Nodes (11): Bonfire, BonfireInstance, FLAME_CONFIGS, FlameConfig, Painting, Pillar, colliders test suite, BaseFeature (+3 more)

### Community 13 - "CD Table Feature"
Cohesion: 0.27
Nodes (6): CASE_COLORS, caseMats, cdSilverMat, CDTable, metalMat, woodMat

### Community 14 - "Camera & Terrain Constants"
Cohesion: 0.14
Nodes (8): calls, created, makeOverlay(), o, onClose, OrderingOverlay, TestOverlay, track()

### Community 15 - "Animated Flame Features"
Cohesion: 0.20
Nodes (9): code:sh (npm install), code:sh (npm run dev), code:sh (npm run build), Compile and Hot-Reload for Development, Compile and Minify for Production, Customize configuration, Project Setup, Recommended IDE Setup (+1 more)

### Community 17 - "Game Bootstrap"
Cohesion: 0.43
Nodes (8): Full-screen overlay viewer pattern (open/close blocks input), AboutViewer class, AnimeViewer class, BookViewer class, MangaViewer class, PhotoViewer class, ResumeViewer class, vite-env.d.ts PDF url declaration

### Community 19 - "Start Screen"
Cohesion: 0.36
Nodes (3): Touch Device Branching, showStartScreen(), StartScreen

### Community 21 - "Camera Blocker Tests"
Cohesion: 0.53
Nodes (4): a, b, c, mesh

### Community 22 - "User Controls Tests"
Cohesion: 0.60
Nodes (3): ALL_KEYS, press(), release()

## Knowledge Gaps
- **78 isolated node(s):** `created`, `o`, `onClose`, `calls`, `Recommended IDE Setup` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `setInputBlocked()` connect `HUD Controls & Input Blocking` to `Anime/About Overlay Viewers`, `User Input & Touch Prompts`, `Overlay Viewer Pattern`, `Pillar & Raycaster Utils`, `Camera & Terrain Constants`, `Book Viewer Overlay`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `hideControls()` connect `HUD Controls & Input Blocking` to `Anime/About Overlay Viewers`, `User Input & Touch Prompts`, `Overlay Viewer Pattern`, `Pillar & Raycaster Utils`, `Camera & Terrain Constants`, `Book Viewer Overlay`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `setInputBlocked()` (e.g. with `setOrbitBlocked()` and `Input blocking on overlay open`) actually correct?**
  _`setInputBlocked()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `created`, `o`, `onClose` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HUD Controls & Input Blocking` be split into smaller, more focused modules?**
  _Cohesion score 0.07614035087719298 - nodes in this community are weakly interconnected._
- **Should `Anime/About Overlay Viewers` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Resume & Social Presence` be split into smaller, more focused modules?**
  _Cohesion score 0.08522727272727272 - nodes in this community are weakly interconnected._