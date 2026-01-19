import {
  FileView,
  Plugin,
} from "obsidian";

export default class AlexShermanPlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf?.view instanceof FileView) {
          leaf.view.contentEl.dataset.path = leaf.view.file?.path;
        }
      }),
    );
  }
}
