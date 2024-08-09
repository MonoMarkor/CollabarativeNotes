import { Component , Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { FilesService } from '../../services/files.service';
import { Group } from '../../models/group_model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AccountDialog } from '../../editor/slide/slide.component';
import { FileStorageService } from '../../services/file-storage.service';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap } from 'rxjs';

export interface AddGroupDialogData {
  new_group_name: string;
}
export interface AddMemberDialogData {
  new_member_name: string;
}
export interface AddFileToGroupDialogData{
  new_file_name:string;
}

@Component({
  selector: 'add-group-dialog',
  templateUrl: 'add-group-dialog.html',
  standalone: true,
  styleUrl: './collab-panel.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class AddGroupDialog {
  constructor(
    public dialogRef: MatDialogRef<AddGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddGroupDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'add-member-dialog',
  templateUrl: 'add-member-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatButtonModule
  ],
  styleUrl: './collab-panel.component.css',
})
export class AddMemberDialog implements OnInit {
  keyUp$ = new Subject<string>();
  userId: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddMemberDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddMemberDialogData,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.keyUp$.pipe(
      filter(keys => keys.length >= 3), //die subscribe function nur dann abrufen, wenn input.content.lenght > 3 ist
      debounceTime(500),  //der letzte Wert erst dann ausgegeben wird, wenn der Nutzer für eine bestimmte Zeit keine Taste gedrückt hat
      distinctUntilChanged(),  //s keine zwei gleichen Elemente im Datenstrom direkt hintereinander ausgegeben werden
      switchMap(searchTerm => this.userService.getMatchingUsernames(searchTerm)),
    ).subscribe(users => {
      if(users.length >= 1){
        this.userId = users[0].userId;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-file-dialog',
  templateUrl: 'add-file-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  styleUrl: './collab-panel.component.css',
})
export class AddFileToGroupDialog {
  constructor(
    public dialogRef: MatDialogRef<AddFileToGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddFileToGroupDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
