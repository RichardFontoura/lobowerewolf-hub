import { LoboWerewolfHub } from "app/core/services/LoboWerewolfHub";

declare global {
  interface ModuleAPI {
    hub: LoboWerewolfHub;
  }

  interface Module {
    api?: ModuleAPI;
  }
}

export {};
