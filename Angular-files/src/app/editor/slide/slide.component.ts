import { Component,Input,Output,EventEmitter ,ViewEncapsulation,Inject} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, RouterOutlet , ActivatedRoute} from '@angular/router';
import { ThemeService } from '../../services/theme.service';
//import { OpenComponent } from '../open/open.component';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddGroupDialog} from '../../home/collab-panel/collab-panel.component';
import { FilesService } from '../../services/files.service';
import { Group } from '../../models/group_model';
import { UsersService } from '../../services/users.service';
import { FileStorageService } from '../../services/file-storage.service';
import { File } from '../../models/file_model';

export interface AccountDialogData {
  message_a: string;
}


@Component({
  selector: 'app-slide',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    MatButtonModule,
    MatButton,
    MatButtonToggleModule,
    MatIcon,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.css',
})

export class SlideComponent {
  thememode: string = 'lightmode';

  @Output() downloadFile = new EventEmitter();
  @Output() openFile = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() uploadFile = new EventEmitter();

  constructor(
    private themeService: ThemeService,
    public dialog: MatDialog,
    private fileservice: FilesService,
    private fileStorage: FileStorageService
  ) {}

  group_list: Group[] = this.fileservice.sampleGroups;

  downloadBtn() {
    this.downloadFile.emit();
  }
  uploadBtn() {
    this.uploadFile.emit();
  }
  openBtn() {
    this.openFile.emit();
  }
  saveBtn() {
    this.save.emit();
  }
  shareBtn() {
    this.dialog.open(ShareDialog, {
      width: 'fit-content',
    });
  }
  helpBtn() {
    this.dialog.open(InfoDialog);
  }

  changeTheme() {
    this.themeService.toggleTheme();
  }

  manageAccount(){
    this.dialog.open(AccountDialog,{
      data:{message_a: "Manage Acoount"}
    });
  }

  resetActiveFile() {
    this.fileStorage.activeFile = new File('', '', '');
  }

}

//--------- dialogs components

@Component({
  selector: 'info-dialog',
  templateUrl: './dialogs/info-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class InfoDialog {}

@Component({
  selector: 'share-dialog',
  templateUrl: './dialogs/share-dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ShareDialog {
  currentUrl: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.currentUrl = window.location.href; // Capture the current URL
  }
  copyLink(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
  }
}
@Component({
  selector: 'account-dialog',
  templateUrl: './dialogs/account-dialog.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class AccountDialog {
  constructor(
    public dialogRef: MatDialogRef<AccountDialog>,
    public userservice: UsersService,
    @Inject(MAT_DIALOG_DATA) public data:AccountDialogData,
    private router: Router
  ) {}

  logout(): void {
    this.userservice.logout();
    this.dialogRef.close();
    this.router.navigate(['/home']);
  }
  signout(): void {
    this.userservice.logout();
    this.dialogRef.close();
    this.router.navigate(['/login']);
  } 
  login(): void {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
  signup(): void {
    this.dialogRef.close();
    this.router.navigate(['/signup']);
  }
}