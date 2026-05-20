import { HandlebarsApplication, i18nLocalize as l } from "@helpers";
import axios from "axios";

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
    const API_URL = "https://lobowerewolf.squareweb.app/api/modules";
    
    const sources = [
      { type: "direct", url: API_URL, respText: false },
      { type: "isomorphic", url: `https://cors.isomorphic-git.org/${API_URL}`, respText: true },
      { type: "allorigins", url: `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL)}`, respText: true },
    ];

    for (const src of sources) {
      try {
        const response = await axios.get(src.url, {
          timeout: 10000,
          responseType: src.respText ? "text" : "json",
        });

        const data = src.respText ? JSON.parse(response.data as unknown as string) : (response.data as ApiModules[]);
        if (Array.isArray(data)) {
          this.modules = data;
          this.moduleCount = data.length;
          return;
        }
      } catch (err) {
        console.warn(`[AboutForm] fonte '${src.type}' falhou`, err);
      }
    }

    this.modules = [];
    this.moduleCount = 0;
  }
}
