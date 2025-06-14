import { AboutFormV2 } from "./src/about-formV2.js";

class LoboWerewolfHub {
  static registeredTools = new Map();

  static init() {
    console.log(game.i18n.localize("Werewolf.Initializing"));

    Handlebars.registerHelper("lte", (a, b) => a <= b);

    this.registerTool({
      name: "defaultTool",
      title: "Welcome to the LoboWerewolf Hub!",
      icon: "fas fa-home",
      button: false,
      visible: false,
      order: 0,
      onClick: () => {},
    });

    const formOptions = {
      name: "aboutButton",
      title: "About",
      icon: "fa-solid fa-info",
      button: true,
      visible: true,
      order: 1,
    };

    this.registerTool({
      ...formOptions,
      onClick: () => {
        new AboutFormV2().render(true);
      },
    });

    Hooks.on("getSceneControlButtons", this._getSceneControlButtons.bind(this));
  }

  static registerTool({
    name,
    title,
    icon,
    button,
    toggle = false,
    visible,
    order,
    onClick,
  }) {
    if (!name || !title || !icon || typeof onClick !== "function") {
      console.error(game.i18n.localize("Werewolf.ToolRegisterError"), {
        name,
        title,
        icon,
      });
      return false;
    }

    let finalOrder = order;
    if (!order) {
      const toolCount = this.registeredTools.size;
      finalOrder = toolCount + 1;
    }

    this.registeredTools.set(name, {
      name,
      title,
      icon,
      button,
      toggle,
      visible,
      order: finalOrder,
      onClick,
    });

    console.log(game.i18n.format("Werewolf.ToolRegistered", { name }));

    if (ui.controls) {
      const controls = ui.controls.controls;
      this.setV13Controls(controls, Object.keys(controls).length + 1);
    }

    return true;
  }

  static setV13Controls(controls, order) {
    const toolMap = {};
    for (const [key, tool] of this.registeredTools.entries()) {
      toolMap[key] = {
        name: key,
        title: tool.title,
        icon: tool.icon,
        button: tool.button,
        toggle: tool.toggle,
        visible: tool.visible,
        order: tool.order,
        onClick: tool.onClick,
        onChange: () => {},
      };
    }

    const firstTool = Object.keys(toolMap)[0] || null;

    controls.lobowerewolfhub = {
      name: "lobowerewolfhub",
      title: game.i18n.localize("Werewolf.HubTitle"),
      icon: "fas fa-paw",
      layer: "lobowerewolfhub",
      order,
      visible: true,
      activeTool: firstTool,
      tools: toolMap,
      onChange: () => {},
      onClick: () => {},
    };
  }

  /**
   * @param {SceneControl[] | Record<string, SceneControl>} controls
   */
  static _getSceneControlButtons(controls) {
    const coreVersion = game.version;
    const isPre13 = foundry.utils.isNewerVersion("13", coreVersion);
    const order = isPre13
      ? controls.length + 1
      : Object.keys(controls).length + 1;

    if (isPre13) {
      controls.push({
        name: "lobowerewolfhub",
        title: game.i18n.localize("Werewolf.HubTitle"),
        icon: "fa-brands fa-wolf-pack-battalion",
        layer: "controls",
        tools: Array.from(this.registeredTools.values()),
      });
    } else {
      this.setV13Controls(controls, order);
    }
  }
}

Hooks.once("init", () => {
  game.lobowerewolfHub = LoboWerewolfHub;
  LoboWerewolfHub.init();
});
