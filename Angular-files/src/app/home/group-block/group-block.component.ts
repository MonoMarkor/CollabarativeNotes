import { Component } from '@angular/core';
import { HomeFilesComponent } from '../home-files/home-files.component';
import { FileLocation } from '../../services/file-storage.service';
import { UsersService } from '../../services/users.service';
import { Group } from '../../models/group_model';
import { GroupLabelComponent } from './group-label/group-label.component';
import { SortByDatePipe } from '../home-panel/home-pipes/sort-by-date.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AddGroupDialog } from '../collab-panel/collab-panel.component';
import { FilesService } from '../../services/files.service';
import { FileStorageService } from '../../services/file-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountDialog } from '../../editor/slide/slide.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-group-block',
  standalone: true,
  imports: [
    HomeFilesComponent,
    GroupLabelComponent,
    SortByDatePipe,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './group-block.component.html',
  styleUrl: './group-block.component.css',
})
export class GroupBlockComponent {
  groupFileLocation: FileLocation = FileLocation.Collabed;

  displayedGroup: Group = new Group('', '');

  searchVal: string = '';

  constructor(
    public userService: UsersService,
    fileservice: FilesService,
    public fileStorageService: FileStorageService,
    public dialog: MatDialog
  ) {}

  displayGroupFiles(group: Group) {
    this.displayedGroup = group;
  }

  new_group_name!: string;

  printNewGroup(): void {
    console.log(this.new_group_name);
  }

  openGroupDialog(): void {
    if (this.userService.isLoggedIn) {
      let dialogRef = this.dialog.open(AddGroupDialog, {
        data: { name: this.new_group_name },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Add Group Dialog was closed`);
        this.new_group_name = result;
        if (this.new_group_name) {
          this.printNewGroup();
          this.userService
            .createGroup(
              new Group('', this.new_group_name, [
                this.userService.currentUser.userId,
              ])
            )
            .subscribe({
              next: (group) => {
                if (group.groupId) {
                  this.fileStorageService.addGroup(group);
                  this.userService
                    .addGroupToUser(
                      this.userService.currentUser.userId,
                      group.groupId
                    )
                    .subscribe({
                      next: (message) => {
                        if (message.success) {
                          this.userService.currentUser.groupIds.push(
                            group.groupId
                          );
                          this.userService.updateUserInLocalStorage();
                        } else {
                          alert('Failed to add Group to User');
                        }
                      },
                    });
                } else {
                  alert('Group could not be created');
                }
              },
            });
        }
      });
    } else {
      this.dialog.open(AccountDialog, {
        data: { message_a: 'Login to Collab!' },
      });
    }
  }
}
