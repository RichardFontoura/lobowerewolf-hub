import { i18nLocalize as l, i18nLocalizeFormat as lf } from "@helpers";
import { AboutForm } from "app/features/about/AboutForm";

import type { Tool, SceneControlsUI } from "../types/controls.types";
import type { SidebarTab } from "../types/sidebar.types";

type UnsafeHooks = { on(hook: "getSceneControlButtons", fn: (controls: Record<string, SceneControlsUI>) => void, options?: any): number; };

export class LoboWerewolfHub {
  private registeredTools = new Map<string, Tool>();
  private registeredSidebarTabs = new Map<string, SidebarTab>();
  private _readyFired = false;
  private uiHandles = new Map<string, { tabName: string; renderPopout(): void }>();

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

  // ── Sidebar API ─────────────────────────────────────────────────────────────

  setSidebarTab(tab: SidebarTab): void {
    if (!tab.name || !tab.title || !tab.icon || typeof tab.onRender !== "function") {
      console.error("[LoboWerewolfHub] Invalid sidebar tab registration:", {
        name: tab.name,
        title: tab.title,
        icon: tab.icon,
      });
      return;
    }

    this.registeredSidebarTabs.set(tab.name, tab);
    console.log(`[LoboWerewolfHub] Sidebar tab registered: ${tab.name}`);

    if (this._readyFired) {
      this._injectSidebarTab(tab);
    }
  }

  getSidebarTabs(): Map<string, SidebarTab> {
    return this.registeredSidebarTabs;
  }

  injectSidebarTabs(): void {
    this._readyFired = true;
    for (const tab of this.registeredSidebarTabs.values()) {
      this._injectSidebarTab(tab);
    }
  }

  private _ensureUiHandle(tab: SidebarTab): void {
    const uiRegistry = ui as unknown as Record<string, unknown>;
    const existing = uiRegistry[tab.name];

    if (existing && !this.uiHandles.has(tab.name)) {
      console.warn(
        `[LoboWerewolfHub] ui["${tab.name}"] is already registered by something else; ` +
          `sidebar tab "${tab.name}" may not switch correctly.`
      );
      return;
    }

    if (this.uiHandles.has(tab.name)) return;

    const handle = {
      tabName: tab.name,
      renderPopout: () => {},
    };

    this.uiHandles.set(tab.name, handle);
    uiRegistry[tab.name] = handle;
  }

  private _injectSidebarTab(tab: SidebarTab): void {
    this._ensureUiHandle(tab);

    const btnId = `lw-sidebar-${tab.name}`;
    const sectionId = `lw-sidebar-${tab.name}-content`;

    const renderContent = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      section.classList.remove("inert");
      section.removeAttribute("inert");
      void Promise.resolve(tab.onRender(section));
    };

    if (!document.getElementById(btnId)) {
      const settingsLi = document
        .querySelector("#sidebar nav menu li [data-tab='settings']")
        ?.closest("li");
      const li = document.createElement("li");
      li.id = btnId;
      li.innerHTML =
        `<button type="button" class="ui-control plain icon ${tab.icon}"` +
        ` data-action="tab" data-tab="${tab.name}" role="tab"` +
        ` aria-pressed="false" data-group="primary"` +
        ` aria-label="${tab.title}" data-tooltip="${tab.title}"></button>` +
        `<div class="notification-pip"></div>`;

      if (settingsLi) {
        settingsLi.before(li);
      } else {
        document.querySelector("#sidebar nav menu")?.appendChild(li);
      }
    }

    const tabLi = document.getElementById(btnId);
    const tabBtn = tabLi?.querySelector("button");
    if (tabBtn && tabBtn.dataset.lwTabBound !== "1") {
      tabBtn.dataset.lwTabBound = "1";
      tabBtn.addEventListener("click", () => {
        requestAnimationFrame(() => renderContent());
      });
    }

    if (!document.getElementById(sectionId)) {
      const section = document.createElement("section");
      section.id = sectionId;
      section.classList.add("tab", "sidebar-tab", "directory", "flexcol", "lw-sidebar-tab");
      section.setAttribute("data-tab", tab.name);
      section.setAttribute("data-group", "primary");
      document.querySelector("#sidebar-content")?.appendChild(section);
    }

    renderContent();
  }
}
