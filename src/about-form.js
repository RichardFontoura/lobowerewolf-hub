export class AboutForm extends FormApplication {
  constructor(object = {}, options = {}) {
    super(object, options);
    this.modules = [];

    const cssPath = "modules/lobowerewolf-hub/styles/about-form.css";
    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = cssPath;
      document.head.appendChild(link);
    }
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "about-form",
      title: "About LoboWerewolf",
      template: "modules/lobowerewolf-hub/templates/about-form.html",
      width: 700,
      height: 695,
      closeOnSubmit: true,
      resizable: false,
      classes: ["lobowerewolf-about"],
    });
  }

  async getData(options) {
    const data = super.getData(options);
    try {
      const response = await fetch(
        "https://lobowerewolf.squareweb.app/api/modules"
      );
      if (response.ok) {
        const text = await response.text();
        data.modules = JSON.parse(text);
      } else {
        console.error("Failed to load modules list:", response.status);
        data.modules = [];
      }
    } catch (error) {
      console.error("Error loading modules list:", error);
      data.modules = [];
    }
    return data;
  }

  async _renderInner(...args) {
    const html = await super._renderInner(...args);
    if (this.moduleCount !== undefined) {
      let height;

      if (this.moduleCount <= 3) {
        height = 600;
      } else if (this.moduleCount <= 6) {
        height = 700;
      } else {
        height = 800;
      }
      this.options.height = height;

      if (this.element && this.element.length) {
        this.setPosition({ height });
      }
    }

    return html;
  }

  async _updateObject(event, formData) {
    //
  }
}
