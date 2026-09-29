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

The hero's temporary 3D scene uses Three.js and React Three Fiber. Its renderer
loads separately from the page and only draws when the scene changes.

- `src/features/assets/assets.ts` defines the three mock finishes.
- `AssetShowcase.tsx` owns the selection shared by the preview and switcher.
- `AssetStage.tsx` owns the camera, lighting, and temporary geometry. This is
  where the supplied models and their interactions will be integrated.
- `AssetSwitcher.tsx` contains the thumbnail and previous/next controls.
- `AssetThumbnail.tsx` provides lightweight mock previews and the WebGL fallback.

Mock geometry is intentionally static. Floating motion, manipulation, and real
model loading will be added when the production assets are available.
