import { FileView, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab } from "settings";

const template = `
.tree-item-self[data-path^="#{$path}"] {
  color: #{$color};
  --nav-item-color-hover: color-mix(
    in srgb,
    #{$color} var(--fg-contrast-amount),
    var(--contrast-color)
  );
  --nav-item-background-hover: color-mix(
    in srgb,
    #{$color} var(--bg-contrast-amount),
    transparent
  );
  --background-modifier-border-focus: #{$color};
  --nav-collapse-icon-color: color-mix(in srgb, #{$color} 60%, transparent);
  &:hover {
    --nav-collapse-icon-color: color-mix(in srgb, #{$color} 60%, var(--contrast-color));
  }
  .nav-file-tag {
    color: color-mix(in srgb, #{$color} 70%, transparent);
  }
}
.view-content[data-path^="#{$path}"] {
  --h1-color: #{$color};
  --h2-color: #{$color};
  --h3-color: #{$color};
  --h4-color: #{$color};
  --h5-color: #{$color};
  --h6-color: #{$color};
  --inline-title-color: #{$color};
}
`;

export default class AlexShermanPlugin extends Plugin {
  settings: MyPluginSettings;
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SampleSettingTab(this.app, this));
    this.applyStyles();
  }

  applyStyles() {
    const style = document.createElement("style");
    document.getElementById("custom-color")?.remove();
    style.id = "custom-color";

    for (const [path, color] of Object.entries(this.settings.paths)) {
      style.innerHTML += template
        .replace(/\#\{\$color\}/g, color)
        .replace(/\#{\$path\}/g, path);
    }
    document.body.appendChild(style);
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf?.view instanceof FileView) {
          leaf.view.contentEl.dataset.path = leaf.view.file?.path;
        }
      }),
    );
  }

  async loadSettings() {
    let partial = (await this.loadData()) as Partial<MyPluginSettings>;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, partial);
    // this.settings = DEFAULT_SETTINGS;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
