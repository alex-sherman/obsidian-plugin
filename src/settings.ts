import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "./main";

export interface MyPluginSettings {
  paths: { [key: string]: string };
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
  paths: {},
};

export class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    // Display each setting entry
    for (const key in this.plugin.settings.paths) {
      let value = this.plugin.settings.paths[key] as string;
      new Setting(containerEl)
        .setName(key)
        .setDesc("Edit the color for this path.")
        .addText((text) =>
          text
            .setPlaceholder("Enter value")
            .setValue(value)
            .onChange(async (newValue) => {
              this.plugin.settings.paths[key] = newValue;
              await this.plugin.saveSettings();
            }),
        )
        .addButton((b) =>
          b.setIcon("trash").onClick(async () => {
            delete this.plugin.settings.paths[key];
            await this.plugin.saveSettings();
            this.display();
          }),
        );
    }

    // Add new entry button
    let keyInput = "";
    new Setting(containerEl)
      .setName("Add New Path")
      .addText((text) =>
        text.setPlaceholder("Path name").onChange((value) => {
          keyInput = value;
        }),
      )
      .addButton((b) =>
        b.setIcon("plus").onClick(async () => {
          const newKey = keyInput.trim();
          if (newKey) {
            this.plugin.settings.paths[newKey] = "";
            await this.plugin.saveSettings();
            this.display();
          }
        }),
      );
    new Setting(containerEl).setName("Refresh").addButton((b) =>
      b.setIcon("reset").onClick(async () => {
        this.plugin.applyStyles();
      }),
    );
  }
}
