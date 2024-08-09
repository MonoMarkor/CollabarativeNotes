import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AddGroupDialog } from '../collab-panel/collab-panel.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { FilesService } from '../../services/files.service';
import { FileStorageService } from '../../services/file-storage.service';
import { AccountDialog } from '../../editor/slide/slide.component';
import { Group } from '../../models/group_model';

@Component({
  selector: 'app-home-panel',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    AddGroupDialog,
    AccountDialog
  ],
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePanelComponent {

  constructor(
    public userService: UsersService,
    fileservice: FilesService,
    public fileStorageService: FileStorageService,
    public dialog: MatDialog,
  ) {}

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
