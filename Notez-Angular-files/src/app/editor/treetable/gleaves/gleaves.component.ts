import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { Group } from '../../../models/group_model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { AddFileToGroupDialog, AddMemberDialog } from '../../../home/collab-panel/collab-panel.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileStorageService, FileLocation } from '../../../services/file-storage.service';
import { UsersService } from '../../../services/users.service';
import { PleavesComponent } from '../pleaves/pleaves.component';
import { MaxLenPipe } from '../../../home/home-panel/home-pipes/max-len.pipe';
import { FilesService } from '../../../services/files.service';
import { File } from '../../../models/file_model';

@Component({
  selector: 'app-gleaves',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    AddMemberDialog,
    MatDialogModule,
    PleavesComponent,
    MaxLenPipe,
    AddFileToGroupDialog
  ],
  templateUrl: './gleaves.component.html',
  styleUrl: './gleaves.component.css',
})
export class GleavesComponent {
  @Input() groupId: string = '';
  group: Group = new Group('', '');
  collabedFileLocation: FileLocation = FileLocation.Collabed;
  new_file_name!: string;

  constructor(
    public dialog: MatDialog, 
    private fileStorage: FileStorageService, 
    private userService: UsersService,
    private fileService : FilesService,
    private router : Router
  ) {}

  ngOnInit(): void {
    if (this.groupId) {
      this.group = this.fileStorage.getGroupFromStateStorage(this.groupId);
      if (this.group.groupName) {
        return;
      }

      this.fileStorage.getGroupFromServer(this.groupId).subscribe(
        group => this.group = group
      );
    }
  }
  hidden_files = false;

  group_click(): void {
    this.hidden_files = !this.hidden_files;
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
        this.userService.addMemberToGroup(this.new_member_id, this.groupId).subscribe({
          next: (message) => {
            if (message.success) {
              this.fileStorage.addMemeberToGroup(this.new_member_id, this.groupId);
              this.userService.addGroupToUser(this.new_member_id, this.groupId).subscribe({
                next: (message2) => {
                  if (message2.success) {
                    //this.userService.currentUser.groupIds.push(this.groupId);
                    this.userService.updateUserInLocalStorage();
                  } else {
                    alert('message2.success == false')
                  }
                },
                error: (err) => {
                  alert('failed to add group to user');
                }
              })
            } else {
              alert('message.success == false')
            }
          },
          error: (err) => {
            alert('failed to add member to group');
          }
        })
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
