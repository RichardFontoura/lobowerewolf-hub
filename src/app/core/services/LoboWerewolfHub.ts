import { i18nLocalize as l, i18nLocalizeFormat as lf } from "@helpers";
import { AboutForm } from "app/features/about/AboutForm";

import type { Tool, SceneControlsUI } from "../types/controls.types";

type UnsafeHooks = { on(hook: "getSceneControlButtons", fn: (controls: Record<string, SceneControlsUI>) => void, options?: any): number; };

export class LoboWerewolfHub {
  private registeredTools = new Map<string, Tool>();

  constructor() {
    this.registerDefaultTools();

    (Hooks as unknown as UnsafeHooks).on("getSceneControlButtons", (controls) =>
      this.registerControls(controls)
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
        onChange: (_event?: Event, _active?: boolean) => {},
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
    const toolMap: Record<string, Tool & { active?: boolean }> = {};
    for (const [key, tool] of this.registeredTools.entries()) {
      toolMap[key] = {
        name: key,
        title: tool.title,
        icon: tool.icon,
        button: tool.button,
        toggle: tool.toggle,
        visible: tool.visible,
        order: tool.order,
        onChange: (event?: Event, active?: boolean) => {
          if (typeof tool.onChange === "function")
            return tool.onChange(event as any, active as any);
          if (typeof tool.onClick === "function" && active)
            return tool.onClick();
        },
      };
    }

    if (!toolMap.foreground) {
      toolMap.foreground = {
        name: "werewolf-foreground",
        title: "Foreground",
        icon: "fa-solid fa-house",
        toggle: true,
        button: false,
        // visible: true  ← keep visible (default). DO NOT use false.
        order: 9999,
        active: false,
        onChange: (_ev?: Event, _active?: boolean) => {
          // no-op - exists only so the core has .foreground.active
        },
      };
    } else {
      toolMap.foreground.toggle = true;
      toolMap.foreground.active ??= false;
    }

    let activeToolName: string | undefined;
    if ("defaultTool" in toolMap) activeToolName = "defaultTool";

    const newControl: SceneControlsUI & { layer?: string } = {
      name: "lobowerewolfhub",
      title: l("hub-title"),
      icon: "fas fa-paw",
      order: this.getControlsCount(controls) + 1,
      visible: true,
      layer: "tokens",
      activeTool: activeToolName,
      tools: toolMap as unknown as Record<string, Tool>,
      onChange: (_event?: Event, _active?: boolean) => {},
    };

    controls["lobowerewolfhub"] = newControl;
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
  }

  getTools() {
    return this.registeredTools;
  }
}
