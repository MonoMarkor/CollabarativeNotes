import { Injectable } from '@angular/core';
import { File } from '../models/file_model';
import { Tree } from '../models/tree_model';
import { Group } from '../models/group_model';
import { Node } from '../models/node_model';
import { FilesService } from './files.service';
import { Subject } from 'rxjs';
import { UsersService } from './users.service';

export enum FileLocation {
  Personal = 1,
  Local = 2,
  Collabed = 3,
  PersonalOrCollabed = 4
}

class FileInfo {
  public file: File;
  public isConflicted: boolean;
  public fileLocation: FileLocation;

  constructor(file: File, isConflicted: boolean, fileLocation: FileLocation) {
    this.file = file;
    this.isConflicted = isConflicted;
    this.fileLocation = fileLocation;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {
  private fileInfo: FileInfo[] = [];
  public activeFile: File = new File(null, null, '', 0, '');

  private groups: Group[] = [];

  constructor(private fileService: FilesService, private userService: UsersService) { }

  bootUp() {
    let files: File[] = this.userService.getFilesFromLocalStrorage(FileLocation.Personal);
    for (let i = 0; i < files.length; i++) {
      this.addFile(files[i], FileLocation.Personal, false);
    }
    //console.log(this.fileInfo);
    for (let i = 0; i < this.userService.currentUser.serverFileIds.length; i++) {
      let file = new File('', '', '');
      this.getFileFromServer(this.userService.currentUser.serverFileIds[i], FileLocation.Personal);
    }
  }

  getFileByLocalId(id: string): File {
    for (let i = 0; i < this.fileInfo.length; i++) {
      if (this.fileInfo[i].file.localFileId == id) {
        return this.fileInfo[i].file;
      }
    }
    return new File(null, null, '', 0, '');
  }

  getFileFromStateStorage(id: string): File {
    for (let i = 0; i < this.fileInfo.length; i++) {
      if (this.fileInfo[i].file.serverFileId == id) {
        return this.fileInfo[i].file;
      }
    }
    return new File(null, null, '', 0, '');
  }

  getFileFromServer(id: string, fileLocation: FileLocation): Subject<File> {
    var subject = new Subject<File>();
    let newFile: File = new File('', '', '');
    this.fileService.getFileFromServer(id).subscribe({
      next: (file) => {
        let nodes: Node[] = [];
        for (let i = 0; i < file.tree.nodes.length; i++) {
          nodes.push(new Node(file.tree.nodes[i].char, file.tree.nodes[i].siteId, file.tree.nodes[i].logicalCount, file.tree.nodes[i].position));
        }
        newFile.fileName = file.fileName;
        newFile.content = file.content;
        newFile.serverFileId = file.serverFileId;
        newFile.localFileId = file.localFileId;
        newFile.tree = new Tree(file.tree.logicalCount, nodes, file.tree.maxMembers);
        newFile.version = file.version;
        newFile.fileName = file.fileName;
        this.addFile(newFile, fileLocation, true);
        subject.next(newFile);
      },
      error: (err) => {
        console.log(err);
        console.log(`failed to get file: ${id}`);
        return newFile;
      },
      complete: () => {
        return newFile;
      }
    });
    return subject;
  }

  getFiles(fileLocation: FileLocation): File[] {
    let files: File[] = [];
    for (let i = 0; i < this.fileInfo.length; i++) {
      if (this.fileInfo[i].fileLocation == fileLocation) {
        files.push(this.fileInfo[i].file);
      }
    }
    return files;
  }

  getGroupFromStateStorage(id: string): Group {
    for (let i = 0; i < this.fileInfo.length; i++) {
      if (this.groups[i]) {
        if (this.groups[i].groupId == id) {
          return this.groups[i];
        }
      }
    }
    return new Group('', '');
  }

  getGroupFromServer(id: string): Subject<Group> {
    var subject = new Subject<Group>();
    let newFile: File = new File('', '', '');
    this.userService.getGroupFromDB(id).subscribe({
      next: (group) => {
        let newGroup = new Group(group.groupId, group.groupName, group.members, group.serverFileIds);
        if(newGroup.groupId) {
          this.addGroup(newGroup);
          subject.next(newGroup);
        }
      },
      error: (err) => {
        console.log(err);
        console.log(`failed to get group: ${id}`);
      }
    });
    return subject;
  }

  updateLocalFie(file: File) {
    for (let i = 0; i < this.fileInfo.length; i++) {
      if (this.fileInfo[i].file.localFileId == file.localFileId) {
        this.fileInfo[i].file = file;
        return;
      }
    }
    this.userService.updateFilesInLocalStorage(this.getFiles(FileLocation.Local), FileLocation.Local);
  }

  updateServerFile(file: File) {
    for (let i = 0; i < this.fileInfo.length; i++) {
      if (this.fileInfo[i].file.serverFileId == file.serverFileId) {
        this.fileInfo[i].file = file;
        return;
      }
    }
    this.userService.updateFilesInLocalStorage(this.getFiles(FileLocation.Personal), FileLocation.Personal);
  }

  addFile(file: File, fileLocation: FileLocation, updateLocalDB: boolean) {
    for (let i = 0; i < this.fileInfo.length; i++) {
      if ((this.fileInfo[i].file.serverFileId == file.serverFileId ||
        this.fileInfo[i].file.localFileId == file.localFileId) &&
        this.fileInfo[i].file.version != file.version
      ) {
        this.fileInfo[i].isConflicted = true;
        if (this.fileInfo[i].file.version < file.version) {
          this.fileInfo[i].file = file;
        }
        return;
      }
    }
    this.fileInfo.push(new FileInfo(file, false, fileLocation));
    if(updateLocalDB) {
      this.userService.updateFilesInLocalStorage(this.getFiles(fileLocation), fileLocation);
    }
  }

  Groups(): Group[] {
    return this.groups;
  }

  addGroup(group: Group) {
    for (let i = 0; i < this.groups.length; i++) {
      if(this.groups[i].groupId == group.groupId) {
        this.groups[i] = group;
        return;
      }
    }
    this.groups.push(group);
  }

  addMemeberToGroup(userId: string, groupId: string) {
    for (let i = 0; i < this.groups.length; i++) {
      if(this.groups[i].groupId == groupId) {
        this.groups[i].members.push(userId);
      }
    }
  }

  addFileToGroup(serverFileId: string, groupId: string) {
    for (let i = 0; i < this.groups.length; i++) {
      if(this.groups[i].groupId == groupId) {
        this.groups[i].serverFileIds.push(serverFileId);
      }
    }
  }

  getGroupById(groupId: string): Group {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].groupId == groupId) {
        return this.groups[i];
      }
    }
    return new Group('', '');
  } 
}
