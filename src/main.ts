import { getModule, registerHandlebarsHelpers } from "@helpers";
import { LoboWerewolfHub } from "app/core/services/LoboWerewolfHub";

Hooks.on("init", () => {
  registerHandlebarsHelpers();
  const hub = new LoboWerewolfHub();

  const module = getModule() as Module;
  if (module) {
    module.api = { hub };
  }

  Hooks.once("ready", () => {
    hub.injectSidebarTabs();
  });

  console.log("lobowerewolf-hub initialized");
});
