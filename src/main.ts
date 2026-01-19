import {
  FileView,
  Plugin,
} from "obsidian";

export default class AlexShermanPlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (!leaf) return;
        if (leaf.view instanceof FileView) {
          leaf.view.containerEl.dataset.file = leaf.view.file?.path;
          console.log(leaf.view.containerEl);
          console.log(leaf.view.file);
        } else {
          leaf.view.containerEl.dataset.file = undefined;
        }
      }),
    );
  }
}
