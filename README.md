# LoboWerewolf Hub

LoboWerewolf Hub is a foundational module for Foundry VTT, providing a new category in Scene Controls and a central point for registering custom tools. This version has been migrated to TypeScript, with a reorganized project structure and updated API.

## 🚀 Key Changes in Version 3

- **TypeScript Migration:** Project rewritten in TypeScript, using `esbuild` for the build process.
- **Folder Structure:** Source code in `src/`, with resources (templates, styles, languages) copied to `dist/` during build. Packaging is done via `scripts/zip.js`.
- **Updated API:** The API is now accessed via `game.modules.get('lobowerewolf-hub').api.hub`, with improved validation for tool registration.
- **Module Configuration:** Compatibility with Foundry VTT v13, with `esmodules: ["main.js"]` and references to languages/styles in the final package.
- **Internationalization:** i18n keys now use the `lobowerewolf-hub.*` namespace.
- **Git:** `.gitignore` and `.gitattributes` configured to ignore build files and normalize text.

## 🔧 Requirements and Setup

- **Requirements:** Node.js 20+ and NPM 9+.
- **Installation:** `npm install` for dependencies.
- **Build:** `npm run build` to compile the project to the `dist/` folder.
- **Usage in Foundry VTT:** Copy the contents of `dist/` to the Foundry module folder or use `npm run build:zip` to generate a `.zip` for installation.

## 🧩 Public API

The API allows registering tools with `hub?.setTool({ name, title, icon, button, visible, onClick/onChange })`. Required fields include name, title, icon, and a click/change handler. The Hub creates a `lobowerewolfhub` control category with a `fas fa-paw` icon and an integrated "About" button. 

## 📄 License

- **Author:** lobowarewolf (https://www.patreon.com/LoboWerewolf)
- **License:** ISC
