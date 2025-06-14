const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class AboutFormV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.modules = [];
    this.moduleCount = 0;
  }

  static get APP_ID() {
    return this.name
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase();
  }
  get APP_ID() {
    return this.constructor.APP_ID;
  }

  static get DEFAULT_OPTIONS() {
    return foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
      id: "about-form",
      title: "About LoboWerewolf",
      classes: ["lobowerewolf-about"],
      width: 500,
      height: 695,    
      resizable: false,
      minimizable: false,
      form: {
        submitOnChange: false,
        closeOnSubmit: true,
      },
    });
  }

  static get PARTS() {
    return {
      content: {
        template: "modules/lobowerewolf-hub/templates/about-form.hbs",
        scrollable: [],
        classes: ["form-content"],
      },
    };
  }

  get title() {
    return "LoboWerewolf Hub";
  }

  async _loadModules() {
    try {
      const res = await fetch("https://lobowerewolf.squareweb.app/api/modules");
      if (res.ok) {
        this.modules = await res.json();
      } else {
        this.modules = [];
      }
    } catch (err) {
      console.error("Failed to load modules list:", err);
      this.modules = [];
    }
    this.moduleCount = this.modules.length;
  }

  async render(force = false, options = {}) {
    await this._loadModules();
    const height =
      this.moduleCount <= 3 ? 600 :
      this.moduleCount <= 6 ? 700 : 800;
    return super.render(force, { ...options, height });
  }

  async _prepareContext() {
    return { modules: this.modules };
  }

  async _updateObject(event, formData) {}
}
