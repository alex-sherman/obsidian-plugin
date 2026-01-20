import AlexShermanPlugin from "main";
import { App, Modal } from "obsidian";

export class SampleModal extends Modal {
  path: string;
  plugin: AlexShermanPlugin;

  constructor(plugin: AlexShermanPlugin, path: string) {
    super(plugin.app);
    this.path = path;
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: `Set color for ${this.path}` });

    const form = contentEl.createEl("form");

    // Create input field
    const inputContainer = form.createEl("div");
    inputContainer.createEl("label", { text: "Enter text:" });
    const input = inputContainer.createEl("input", {
      type: "text",
      placeholder: "Color (e.g., #ff0000 or red, or var(--mint))",
    }) as HTMLInputElement;

    // Create button container
    const buttonContainer = form.createEl("div", {
      cls: "modal-button-container",
    });
    buttonContainer.style.marginTop = "20px";
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.justifyContent = "flex-end";

    // Submit button
    let submit = (e: any) => {
      e.preventDefault();
      if (input.value.trim() === "") {
        delete this.plugin.settings.paths[this.path];
      } else {
        this.plugin.settings.paths[this.path] = input.value;
      }
      this.plugin.saveSettings();
      this.plugin.applyStyles();
      this.close();
    };
    form.addEventListener("submit", submit);
    const submitBtn = buttonContainer.createEl("button", { text: "Submit" });
    submitBtn.type = "button";
    submitBtn.addEventListener("click", submit);

    // Cancel button
    const cancelBtn = buttonContainer.createEl("button", { text: "Cancel" });
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", () => {
      this.close();
    });

    // Focus input on open
    input.focus();
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
