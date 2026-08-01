// Next 16 no longer ships an ambient declaration for stylesheet imports, so a
// side-effect import like `import "./globals.css"` has nothing to resolve to.
// TypeScript 5.9 (this project's compiler) ignores that, but TS 6+ — which some
// editors bundle and run independently of the project version — reports TS2882.
declare module "*.css";
