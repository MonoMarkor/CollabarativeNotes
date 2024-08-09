import { Tree } from './tree_model';

export class File {
  public localFileId: string;
  public serverFileId: string | null;
  public fileName: string;
  public version: number;
  public content: string;
  public tree: Tree;

  constructor(
    localFileId: string,
    serverFileId: string | null,
    fileName: string,
    version: number = 0,
    content: string = '',
    tree: Tree = new Tree()
  ) {
    this.localFileId = localFileId;
    this.serverFileId = serverFileId;
    this.fileName = fileName;
    this.version = version;
    this.content = content;
    this.tree = tree;
    if (!this.content) {
        this.content += this.tree.getText();
    }
  }

  Content(): string {
    return this.content;
  }

  updateContent() {
      this.content = this.tree.getText();
  }
}
