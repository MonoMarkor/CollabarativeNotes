import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileLocation, FileStorageService } from '../../../services/file-storage.service';
import { Group } from '../../../models/group_model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FilterTextPipe } from '../../home-panel/home-pipes/filtertext.pipe';
import { IsVisiblePipe } from '../../home-panel/home-pipes/is-visible.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { AddFileToGroupDialog, AddMemberDialog } from '../../collab-panel/collab-panel.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';
import { FilesService } from '../../../services/files.service';
import { File } from '../../../models/file_model';

@Component({
  selector: 'app-group-label',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FilterTextPipe,
    IsVisiblePipe,
    MatMenuModule,
    AddMemberDialog,
    AddFileToGroupDialog
  ],
  templateUrl: './group-label.component.html',
  styleUrl: './group-label.component.css',
})
export class GroupLabelComponent {
  @Input() groupId!: string;
  @Input() searchVal!: string;
  @Output() gClicked = new EventEmitter<Group>();

  collabedFileLocation: FileLocation = FileLocation.Collabed;
  group!: Group;
  new_file_name!: string;
  constructor(
    private fileStorage: FileStorageService,
    private fileService: FilesService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    if (this.groupId) {
      console.log('get group from fileStorage');
      this.group = this.fileStorage.getGroupById(this.groupId);
      if (this.group.groupId) {
        return;
      }

      console.log('get group from db');
      this.fileStorage
        .getGroupFromServer(this.groupId)
        .subscribe((group) => (this.group = group));
    }
  }

  groupLabelClicked() {
    this.gClicked.emit(this.group);
  }

  new_member_id!: string;

  printNewMember(): void {
    console.log(this.new_member_id);
  }

  openMemberDialog(): void {
    let dialogRef = this.dialog.open(AddMemberDialog, {
      data: { name: this.new_member_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Add Member Dialog was closed`);
      this.new_member_id = result;

      if (this.new_member_id == this.userService.currentUser.userId) {
        console.log('add member failed! can#t add yourself');
        return;
      }

      if (this.new_member_id.length == 24) {
        this.printNewMember();
        this.userService
          .addMemberToGroup(this.new_member_id, this.groupId)
          .subscribe({
            next: (message) => {
              if (message.success) {
                this.fileStorage.addMemeberToGroup(
                  this.new_member_id,
                  this.groupId
                );
                this.userService
                  .addGroupToUser(this.new_member_id, this.groupId)
                  .subscribe({
                    next: (message2) => {
                      if (message2.success) {
                        //this.userService.currentUser.groupIds.push(this.groupId);
                        this.userService.updateUserInLocalStorage();
                      } else {
                        alert('message2.success == false');
                      }
                    },
                    error: (err) => {
                      alert('failed to add group to user');
                    },
                  });
              }
            },
            error: (err) => {
              alert('failed to add member to group');
            },
          });
      }
    });
  }

  openFileToGroupDialog(): void {
    let dialogRef = this.dialog.open(AddFileToGroupDialog, {
      data: { name: this.new_file_name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Add FileToGroup Dialog was closed');
      this.new_file_name = result;
      if (this.new_file_name) {
        console.log(this.new_file_name);
        let newFile = new File('', '', this.new_file_name);
        this.fileService.createFile(newFile).subscribe({
          next: (file) => {
            if (file.serverFileId) {
              console.log(this.userService.currentUser.userId);
              this.userService
                .addFileToGroup(file.serverFileId, this.groupId)
                .subscribe({
                  next: () => {
                    this.fileStorage.addFileToGroup(
                      file.serverFileId!,
                      this.groupId
                    );
                    this.router.navigate(['/editor', file.serverFileId]);
                  },
                  error: (err) => {
                    alert('addToPersonalFileList() failed');
                  },
                });
            }
          },
          error: (err) => {
            alert('createFile() failed');
          },
        });
      }
    });
  }
}
