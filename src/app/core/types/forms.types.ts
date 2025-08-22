import type { ApiModules } from "./api-modules.types";

export type AppV2RenderContext =
  foundry.applications.api.ApplicationV2.RenderContext;

export type AppV2RenderOptions =
  foundry.applications.api.ApplicationV2.RenderOptions;

export type HandlebarsTemplatePart =
  foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart;

export type DefaultOptions =
  foundry.applications.api.ApplicationV2.DefaultOptions;

export type AboutContext = AppV2RenderContext & {
  modules: ApiModules[];
  moduleCount: number;
};
