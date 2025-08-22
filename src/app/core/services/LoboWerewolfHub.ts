import { i18nLocalize as l, i18nLocalizeFormat as lf } from "@helpers";
import { AboutForm } from "app/features/about/AboutForm";
import { Tool } from "../types/controls.types";

import type { SceneControlsUI } from "../types/controls.types";

// Using "unsafe" typing only for this .on since getSceneControlButtons is not yet accessible via fvtt-types
type UnsafeHooks = {
  on(hook: string, fn: (...args: any[]) => any, options?: any): number;
};

export class LoboWerewolfHub {
  private registeredTools = new Map<string, Tool>();

  constructor() {
    this.registerDefaultTools();

    (Hooks as unknown as UnsafeHooks).on(
      "getSceneControlButtons",
      (controls: Record<string, SceneControlsUI>) => {
        this.registerControls(controls);
      }
    );
  }

  private registerDefaultTools() {
    const defaultTools: Tool[] = [
      {
        name: "defaultTool",
        title: "Welcome to the LoboWerewolf Hub!",
        icon: "fas fa-home",
        button: false,
        visible: true,
        order: 0,
        onChange: () => {},
      },
      {
        name: "aboutButton",
        title: "About",
        icon: "fa-solid fa-info",
        button: true,
        visible: true,
        order: 1,
        onChange: () => {
          new AboutForm().render(true);
        },
      },
    ];

    for (const tool of defaultTools) {
      this.setTool(tool);
    }
  }

  private registerControls(controls: Record<string, SceneControlsUI>) {
    const toolMap: Record<string, Tool> = {};
    for (const [key, tool] of this.registeredTools.entries()) {
      toolMap[key] = {
        name: key,
        title: tool.title,
        icon: tool.icon,
        button: tool.button,
        toggle: tool.toggle,
        visible: tool.visible,
        order: tool.order,
        onChange: tool.onChange ?? tool.onClick ?? (() => {}),
      };
    }
    let activeToolName: string | undefined;

    if ("defaultTool" in toolMap) {
      activeToolName = "defaultTool";
    }

    const newControl: SceneControlsUI = {
      name: "lobowerewolfhub",
      title: l("hub-title"),
      icon: "fas fa-paw",
      order: this.getControlsCount(controls) + 1,
      visible: true,
      activeTool: activeToolName,
      tools: toolMap,
      onChange: () => {},
    };

    if (Array.isArray(controls)) {
      controls.push(newControl);
    } else if (controls instanceof Map) {
      controls.set("lobowerewolfhub", newControl);
    } else if (controls && typeof controls === "object") {
      (controls as Record<string, SceneControlsUI>)["lobowerewolfhub"] =
        newControl;
    }
  }

  private getControlsCount(
    controls:
      | SceneControlsUI[]
      | Record<string, SceneControlsUI>
      | Map<string, SceneControlsUI>
  ): number {
    if (Array.isArray(controls)) return controls.length;
    if (controls instanceof Map) return controls.size;
    if (controls && typeof controls === "object")
      return Object.keys(controls).length;
    return 0;
  }

  setTool(tool: Tool) {
    if (
      !tool.name ||
      !tool.title ||
      !tool.icon ||
      (typeof tool.onChange !== "function" &&
        typeof tool.onClick !== "function")
    ) {
      console.error(l("tool-register-error"), {
        name: tool.name,
        title: tool.title,
        icon: tool.icon,
      });
      return;
    }

    let finalOrder: number = tool.order ?? 0;
    if (!tool.order) {
      const toolCount = this.registeredTools.size;
      finalOrder = toolCount + 1;
    }
    tool.order = finalOrder;

    this.registeredTools.set(tool.name, tool);

    console.log(lf("tool-registered", { name: tool.name }));

    const controlsUI = ui?.controls as unknown as Record<string, SceneControlsUI>;
    if (controlsUI) this.registerControls(controlsUI);
  }

  getTools() {
    return this.registeredTools;
  }
}
