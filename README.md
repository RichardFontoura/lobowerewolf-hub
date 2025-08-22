# LoboWerewolf Hub

LoboWerewolf Hub is a foundational module that provides a new category in Foundry VTT's Scene Controls and a central point for other modules to register custom tools (buttons).

This repository has been migrated to TypeScript and undergone a reorganization of its structure, build process, and public API.

---

## 🚀 What's new in version 3

- Full migration to TypeScript
  - New tsconfig: `c:\lobowerewolf-hub\tsconfig.json` (paths, strict, Node and Foundry types)
  - Build scripts with `esbuild` (ESM bundle + sourcemaps)
  - `package.json` and `package-lock.json` updated

- New folder structure
  - Source code in `src/`
  - Resources (templates, styles, and languages) copied to `dist/` during build
  - Packaging script in `scripts/zip.js`

- Updated API and behavior
  - API exposed via `game.modules.get('lobowerewolf-hub').api.hub`
  - Tool registration with validation and automatic ordering
  - Control category: `lobowerewolfhub` with `fas fa-paw` icon and title localized via `lobowerewolf-hub.hub-title`
  - Inclusion of an "About" screen with a module list fetched dynamically

- Module configuration (module.json)
  - Compatibility for Foundry VTT v13
  - `esmodules: ["main.js"]` (loaded from the module root in the final package)
  - Languages and styles referenced in the generated package

- Internationalization
  - i18n keys now use the `lobowerewolf-hub.*` namespace
    - E.g., `lobowerewolf-hub.hub-title`, `lobowerewolf-hub.tool-registered`, etc.

- Git configuration files
  - `.gitignore`: ignores `node_modules/`, `dist/`, and `package-lock.json`
  - `.gitattributes`: text normalization

---

## 🔧 Technical requirements

- Node.js 20 LTS or higher (recommended)
  - Build tools and utilities (e.g., rimraf v6, esbuild, and dependencies) require recent Node versions
- NPM 9+ (recommended)
- Foundry VTT 13 (minimum and verified compatibility in `module.json`)

---

## 📦 Folder structure

- `src/`
  - `app/core/` (hub types and services)
    - `services/LoboWerewolfHub.ts`: main service that registers the control and manages tools
    - `types/`: types for forms, controls, and API
  - `app/features/about/`
    - `about-form.hbs`: "About" screen template
    - `about-form.css`: "About" screen styles
    - `AboutForm.ts`: "About" screen logic
  - `utils/helpers.ts`: helpers (i18n, module access, Handlebars, etc.)
  - `main.ts`: entry point; registers helpers, creates the hub, and exposes API via `module.api`

- `languages/`
  - `en.json` and `pt-BR.json` (keys in the `lobowerewolf-hub` namespace)

- `scripts/`
  - `zip.js`: packages the contents of `dist/` into `lobowerewolf-hub.zip`

- `dist/` (generated during build)
  - `main.js` and `main.js.map` (ESM bundle)
  - `module.json` (copied during build)
  - `languages/`, `templates/`, `styles/` (copied from `languages/` and `src/app/features/**`)

---

## ⚙️ How to set up and run

1) Install dependencies
```bash
npm install
```

2) Build the project (generates `dist/` with bundle and copied files)
```bash
npm run build
```

3) Use in Foundry VTT (local development)
- After building, copy the contents of `dist/` to the module folder in Foundry, for example:
  - Windows: `%AppData%\FoundryVTT\Data\modules\lobowerewolf-hub\`
- Alternatively, generate the `.zip` and install via "Install Module" with the manifest URL when publishing a release.

4) Generate `.zip` package for distribution
```bash
npm run build:zip
```
- The script creates `lobowerewolf-hub.zip` in the project root, containing the `dist/` files at the package root (expected structure by Foundry).

Available scripts:
- `npm run clean`: removes the `dist/` folder
- `npm run copy`: copies templates, styles, languages, and `module.json` to `dist/`
- `npm run build`: clean + copy + bundle via esbuild
- `npm run build:zip`: build + packaging (`scripts/zip.js`)
- `npm run zip`: only packages the current contents of `dist/`

---

## 🧩 Public API

The Hub's API is exposed via `module.api` in Foundry:

```javascript
// Access the hub from another module
const hub = game.modules.get("lobowerewolf-hub")?.api?.hub;

// Register a tool
hub?.setTool({
  name: "transform",
  title: game.i18n.localize("MyModule.TransformTitle"),
  icon: "fa-solid fa-paw",
  button: true,          // clickable button
  visible: true,         // visible in the panel
  // toggle: true,       // optional, if it's a toggle
  // order: 2,           // optional; if omitted, the hub calculates automatically
  onClick: () => {
    console.log("Transform button clicked!");
  }
  // onChange: () => {}, // alternative to onClick; one of the two is required
});
```

Rules and behaviors:
- Required fields: `name`, `title`, `icon`, and at least one handler (`onClick` or `onChange`).
- `order`: if not defined, the Hub calculates a value based on the number of tools already registered.
- The Hub creates a control category named `lobowerewolfhub`:
  - Localized title: `lobowerewolf-hub.hub-title`
  - Icon: `fas fa-paw`
  - Default tool: `defaultTool`
  - "About" button: `aboutButton` (opens the window with a module list)

---

## 🧰 Helpers and i18n

- Helpers:
  - Automatic registration of Handlebars helpers on init, including the `lte` (<=) helper.
- i18n:
  - Updated namespace: `lobowerewolf-hub.*`
    - E.g., `lobowerewolf-hub.initializing`, `lobowerewolf-hub.tool-registered`, `lobowerewolf-hub.about.*`

---

## 🧷 Module settings (module.json)

- Compatibility
  - `minimum`: `13`
  - `verified`: `13`
- Bundle loading:
  - `esmodules: ["main.js"]` (in the final package, `main.js` is at the root)
- Resources:
  - `styles: ["styles/about/about-form.css"]` (copied to `dist/styles/...`)
  - `languages`: `languages/en.json` and `languages/pt-BR.json`
- Distribution:
  - `manifest` and `download` fields point to the GitHub Releases publication for the current version.

---

## 🔄 Differences from previous version

- API
  - Before: suggested global access (e.g., `game.lobowerewolfHub.registerTool(...)`)
  - Now: `game.modules.get('lobowerewolf-hub').api.hub.setTool(...)`
  - Stricter tool data validation (name/title/icon + onClick/onChange)

- Scene Controls
  - Icon changed to `fas fa-paw`
  - Title now localized via `lobowerewolf-hub.hub-title`
  - Inclusion of the "About" button with Handlebars window

- Build and structure
  - TypeScript project, bundling with esbuild
  - Resources (.hbs/.css/.json) copied to `dist/` during build
  - Packaging via `scripts/zip.js` (generates `lobowerewolf-hub.zip`)

- i18n
  - Keys migrated to the `lobowerewolf-hub.*` namespace

---

## ❓ Troubleshooting

- "Command not found" or build errors
  - Verify that you are using Node.js 20+ and updated NPM
- Foundry does not load the module
  - Confirm that you installed the package with the correct structure: `module.json`, `main.js`, `languages/`, `templates/`, `styles/` at the module root
- i18n issues
  - Review if the keys use the `lobowerewolf-hub.*` namespace

---

## 📄 License

- Author: lobowarewolf (https://www.patreon.com/lobowarewolf)
- License: ISC
