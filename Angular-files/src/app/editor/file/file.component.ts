import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FileStorageService } from '../../services/file-storage.service';
import { FormsModule } from '@angular/forms';
import { File } from '../../models/file_model';
import { Node } from '../../models/node_model';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'file',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css',
})
export class FileComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string = '';
  @Input() isIdLocal: boolean = false;

  userIndex: number = Math.random() * 100;

  activity: boolean = false;
  route: ActivatedRoute = inject(ActivatedRoute);
  contentElement!: HTMLTextAreaElement;
  constructor(
    public fileStorage: FileStorageService,
    private websocketService: WebsocketService,
    private usersService: UsersService
  ) {}
  ngAfterViewInit(): void {
    this.contentElement = document.getElementById(
      'textArea1'
    ) as HTMLTextAreaElement;
    console.log('content: ', this.contentElement.value);
  }

  ngOnDestroy(): void {
    this.fileStorage.activeFile = new File('', '', '');
  }

  ngOnInit(): void {
    console.log(this.fileStorage.activeFile);
    this.websocketService.socket$.subscribe((message) => {
      console.log('recieved messeages: ', message);
      let msg = JSON.parse(message);
      if (msg.fileId == this.fileStorage.activeFile.serverFileId) {
        //change == to !=
        if (msg.action == 'insert') {
          console.log('action: ', msg.action);
          let nodeToInsert: Node = new Node('', [], 0, []);
          nodeToInsert.char = msg.node.char;
          nodeToInsert.siteId = msg.node.siteId;
          nodeToInsert.logicalCount = msg.node.logicalCount;
          nodeToInsert.position = msg.node.position;
          console.log('remote insert', nodeToInsert);
          this.remoteInsert(nodeToInsert);
        } else if (msg.action == 'delete') {
          console.log('action: ', msg.action);
          let nodeToDelete: Node = new Node('', [], 0, []);
          nodeToDelete.char = msg.node.char;
          nodeToDelete.siteId = msg.node.siteId;
          nodeToDelete.logicalCount = msg.node.logicalCount;
          nodeToDelete.position = msg.node.position;
          console.log('remote delete', nodeToDelete);
          this.remoteDelete(nodeToDelete);
        }
      }
    });
  }

  cursorPosition: number = 0;

  onKeyDown(startIndex: number, endIndex: number, event: any) {
    console.log('input: ' + event.data);
    console.log(event);
    if (event.inputType == 'deleteContentBackward') {
      this.deleteChar(startIndex + 2);
    } else if (event.inputType == 'insertFromPaste') {
      return;
    } else if (event.inputType == 'insertLineBreak') {
      console.log(`Added Line After line ${startIndex}`);
      //this.addLine.emit(index);
      this.insertChar('\n', startIndex, this.userIndex);
    } else if (event.data.length == 1) {
      this.insertChar(event.data, startIndex, this.userIndex);
    } else {
      this.insertChar(
        event.data[event.data.length - 1],
        startIndex,
        this.userIndex
      );
    }
  }

  onPaste(event: any, index: number) {
    let data: string = event.clipboardData.getData('text/plain');
    console.log(`pasted(${index}):` + data);
    for (let i = 0; i < data.length; i++) {
      this.insertChar(data[i], index + i, this.userIndex);
    }
  }

  insertChar(char: string, index: number, userIndex: number) {
    console.log(`Inserted Char '${char}' at Pos: ${index}`);
    this.cursorPosition = index + 1;

    if (index <= this.fileStorage.activeFile.tree.nodes.length) {
      let insertedNode: Node = this.fileStorage.activeFile.tree.localInsert(
        char,
        index,
        userIndex
      );
      this.fileStorage.activeFile.updateContent();
      this.websocketService.send(
        JSON.stringify({
          userId: this.usersService.currentUser.userId,
          fileId: this.fileStorage.activeFile.serverFileId,
          action: 'insert',
          node: insertedNode,
        })
      );
      return;
    }

    console.log(`Failed to insert Char: ${char}`);
  }

  deleteChar(index: number) {
    if (index == 0) {
      return;
    }

    console.log(`Deleted at position: ${index}`);
    this.cursorPosition = index - 1;

    if (index - 1 <= this.fileStorage.activeFile.tree.nodes.length) {
      let deletedNodes: Node[] = this.fileStorage.activeFile.tree.localDelete(
        index - 1
      );
      this.fileStorage.activeFile.updateContent();
      for (let i = 0; i < deletedNodes.length; i++) {
        this.websocketService.send(
          JSON.stringify({
            userId: this.usersService.currentUser.userId,
            fileId: this.fileStorage.activeFile.serverFileId,
            action: 'delete',
            node: deletedNodes[i],
          })
        );
      }
      return;
    }

    console.log(`Failed to local delete`);
  }

  remoteInsert(node: Node) {
    if (this.fileStorage.activeFile.tree.remoteInsert(node)) {
      this.cursorPosition = this.contentElement.selectionStart;
      console.log('cursor pos before: ', this.cursorPosition);
      this.fileStorage.activeFile.updateContent();
      this.contentElement.value = this.fileStorage.activeFile.content;
      this.contentElement.setSelectionRange(
        this.cursorPosition,
        this.cursorPosition
      );
      console.log('cursor pos after: ', this.contentElement.selectionStart);
    }
  }

  remoteDelete(node: Node) {
    if (this.fileStorage.activeFile.tree.remoteDelete(node)) {
      this.cursorPosition = this.contentElement.selectionStart;
      console.log('cursor pos before: ', this.cursorPosition);
      this.fileStorage.activeFile.updateContent();
      this.contentElement.value = this.fileStorage.activeFile.content;
      this.contentElement.setSelectionRange(
        this.cursorPosition,
        this.cursorPosition
      );
      console.log('cursor pos after: ', this.contentElement.selectionStart);
    }
  }

  print(obj: any) {
    console.log(obj);
  }

  activityTrue(): void {
    this.activity = true;
  }
}
