import { FileView, Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab } from "settings";
import { SampleModal } from "modal";

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
    this.addSettingTab(new SampleSettingTab(this));
    this.applyStyles();

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        // Add a new item to the menu
        menu.addItem((item) => {
          item
            .setTitle("Set color") // Set the text of the menu item
            .setIcon("palette") // Set an icon (uses Lucide icons)
            .onClick(async () => {
              const modal = new SampleModal(this, file.path);
              modal.open();
            });
        });
      }),
    );
  }
  onunload() {
    document.getElementById("custom-color")?.remove();
  }

  applyStyles() {
    const style = document.createElement("style");
    document.getElementById("custom-color")?.remove();
    style.id = "custom-color";

    for (const [path, color] of Object.entries(this.settings.paths).sort(
      (a, b) => a[0].length - b[0].length,
    )) {
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
