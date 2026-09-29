# Tripo

React + TypeScript application built with Vite.

## Development

```sh
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).
Edit `src/App.tsx` to start building the app.

## Commands

- `npm run dev` starts the development server with hot reload.
- `npm run build` checks TypeScript and creates a production build in `dist`.
- `npm run preview` serves the production build locally.
- `npm run lint` checks source code.
- `npm run typecheck` checks TypeScript.

## Repository

Git remote `origin`: https://github.com/Aymen-Ben-Salem/tripo.git

## Asset showcase

The hero loads the supplied speaker models with Three.js and React Three Fiber.
The renderer is loaded separately and draws only when the scene changes.

- `src/features/assets/assets.ts` maps speaker names, model URLs, and initial rotations.
- `AssetShowcase.tsx` owns the shared selection and generated thumbnail images.
- `AssetStage.tsx` loads and caches GLBs and provides the camera and lighting.
- `modelScene.ts` centers and scales each model, and renders thumbnails using
  the existing WebGL renderer instead of creating extra GPU contexts.
- `AssetSwitcher.tsx` provides the thumbnail and previous/next controls.

Web copies live in `public/models`. They contain about 190?202 thousand triangles
per speaker. The supplied JPEG textures are retained byte-for-byte; source files
in Downloads are untouched. The exports contain base-color textures, without
separate metallic or roughness maps. Original material settings are retained.

To rebuild the web copies from the three original filenames:

```sh
node scripts/prepare-models.mjs "path/to/source-directory"
```

Models are static for now. Floating motion and manipulation will be added in
our next interaction step.
