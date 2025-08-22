import { HandlebarsApplication, i18nLocalize as l } from "@helpers";

import type { DeepPartial } from "fvtt-types/utils";
import type { DefaultOptions, HandlebarsTemplatePart, AboutContext, AppV2RenderOptions, } from "app/core/types/forms.types";
import type { ApiModules } from "app/core/types/api-modules.types";

export class AboutForm extends HandlebarsApplication {
  modules: ApiModules[] = [];
  moduleCount: number = 0;

  static get DEFAULT_OPTIONS(): DefaultOptions {
    return {
      classes: ["lobowerewolf-about"],
      tag: "div",
      window: {
        frame: true,
        positioned: true,
        title: l("about-title"),
        icon: "fa-solid fa-info",
        controls: [],
        minimizable: true,
        resizable: false,
        contentTag: "section",
        contentClasses: [],
      },
      actions: {},
      form: {
        handler: undefined,
        submitOnChange: false,
        closeOnSubmit: false,
      },
      position: {
        width: "auto",
        height: "auto",
      },
    };
  }

  static get PARTS(): Record<string, HandlebarsTemplatePart> {
    return {
      content: {
        template: "modules/lobowerewolf-hub/templates/about/about-form.hbs",
        scrollable: [],
        classes: [],
      },
    };
  }

  async _prepareContext(
    options: DeepPartial<AppV2RenderOptions> & { isFirstRender: boolean }
  ): Promise<AboutContext> {
    const base = await super._prepareContext(options);
    await this.loadModulesList();

    return { ...base, modules: this.modules, moduleCount: this.moduleCount };
  }

  async _onRender(
    context: DeepPartial<AboutContext>,
    options: DeepPartial<AppV2RenderOptions>
  ): Promise<void> {
    super._onRender(context, options);
  }

  async loadModulesList() {
    try {
      const modulesListResponse = await fetch(
        "https://lobowerewolf.squareweb.app/api/modules"
      );
      if (!modulesListResponse.ok) return;

      this.modules = await modulesListResponse.json();
      this.moduleCount = this.modules.length;
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  }
}
