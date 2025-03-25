# LoboWerewolf Hub

**LoboWerewolfHub** is a foundational module designed to act as a centralized *Scene Control Button* hub for other related modules.

It creates a new Scene Controls category and allows other modules to register custom tools (buttons) to it.

---

## 🔧 Features

- Adds a new Scene Controls category (sidebar button).
- Provides a centralized registration method for other modules to add their tools.
- Automatically localizes tool titles and logs tool registration in the console.

---

## 🐺 Scene Control Button

Once initialized, the hub adds a new button to the Scene Controls panel:

- **Name:** `lobowerewolfhub`
- **Icon:** `fa-brands fa-wolf-pack-battalion`
- **Title:** Localized via `Werewolf.HubTitle`

---

## 📦 API

Other modules can use the global `game.lobowerewolfHub.registerTool(toolData)` method to register new tools.

### `registerTool(toolData)`

| Property | Type     | Description                      |
|----------|----------|----------------------------------|
| `name`   | `string` | Unique tool identifier           |
| `title`  | `string` | Display name (localized)         |
| `icon`   | `string` | Font Awesome icon class          |
| `onClick` | `Function` (optional) | Callback on click |

### Example:
```javascript
game.lobowerewolfHub.registerTool({
    name: "transform",
    title: game.i18n.localize("Werewolf.Transform"),
    icon: "fa-solid fa-paw",
    onClick: () => {
        console.log("Transform button clicked!");
    }
});
