import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PleavesComponent, } from '../pleaves/pleaves.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Group } from '../../../models/group_model';
import { GleavesComponent } from '../gleaves/gleaves.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddGroupDialog } from '../../../home/collab-panel/collab-panel.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';
import { AccountDialog } from '../../slide/slide.component';
import { FileStorageService, FileLocation } from '../../../services/file-storage.service';




@Component({
  selector: 'app-personalBranch',
  standalone: true,
  imports: [
    CommonModule,
    PleavesComponent,
    MatIconModule,
    MatListModule,
    GleavesComponent,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    AddGroupDialog,
  ],
  templateUrl: './personalBranch.component.html',
  styleUrl: './personalBranch.component.css',
})
export class PersonalBranchComponent {
  //@Input() personal_server_file_ids?: string[];
  //@Input() user_group_ids?: Group[];
  showGleaves: boolean = false;

  constructor(public dialog: MatDialog, public userservice: UsersService, public fileStorage: FileStorageService) {}

  new_group_name!: string;
  personalFileLocation: FileLocation = FileLocation.Personal;

  printNewGroup(): void {
    console.log(this.new_group_name);
  }

  openGroupDialog(): void {
    if (this.userservice.isLoggedIn) {
      let dialogRef = this.dialog.open(AddGroupDialog, {
        data: { name: this.new_group_name },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Add Group Dialog was closed`);
        this.new_group_name = result;
        if (this.new_group_name) {
          this.printNewGroup();
        }
      });
    } else {
      this.dialog.open(AccountDialog, {
        data: { message_a: 'Login to Collab!' },
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showGleaves = true;
    })
  }

}
