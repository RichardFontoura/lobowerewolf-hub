export class HandlebarsApplication extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2
) {}

export const MODULE_ID = "lobowerewolf-hub"; 

export function i18nLocalize(key: string, fallback: string = ""): string {
  return (game as Game).i18n?.localize(`${MODULE_ID}.${key}`) ?? fallback;
}

export function i18nLocalizeFormat(
  key: string,
  format: Record<string, string>,
  fallback: string = ""
): string {
  return (game as Game).i18n?.format(`${MODULE_ID}.${key}`, format) ?? fallback;
}

export function getModule(_module: string = MODULE_ID) {
  const module = (game as Game).modules?.get(_module);
  if (!module) {
    throw new Error(`Module ${_module} not found`);
  }
  return module;
}

export function getModuleApi() {
  const module = getModule() as Module;
  if (!module) {
    throw new Error("Module not found");
  }
  return module.api;
}

export function registerHandlebarsHelpers() {
  try {
    const hb = globalThis.Handlebars;
    if (!hb) {
      console.warn("[lobowerewolf-hub] Handlebars not found to register helpers.");
      return;
    }

    if (!hb.helpers?.lte) {
      hb.registerHelper("lte", (a, b) => a <= b);
    }
  } catch (err) {
    console.error("[lobowerewolf-hub] Failed to register Handlebars helpers:", err);
  }
}
