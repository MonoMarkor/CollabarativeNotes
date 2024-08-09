import {
  Component,
  inject,
  OnInit,
  Output,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { AccountDialog, SlideComponent } from './slide/slide.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule} from '@angular/common';
import { FilesService } from '../services/files.service';
import { switchMap,Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { PersonalBranchComponent } from './treetable/personalBranch/personalBranch.component';
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UsersService } from '../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { FileComponent } from './file/file.component';
import { File } from '../models/file_model';
import { FileLocation, FileStorageService } from '../services/file-storage.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    SlideComponent,
    CommonModule,
    FormsModule,
    PersonalBranchComponent,
    MatSlideToggleModule,
    MatButtonToggleModule,
    AccountDialog,
    FileComponent
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges {
  route: ActivatedRoute = inject(ActivatedRoute);
  theme = 'darkmode';

  isnewfile: boolean = true;
  id: string = '';

  headerElement!: HTMLInputElement;
  contentElement!: HTMLTextAreaElement;

  isChecked: boolean = false;// for connectiontoggle

  constructor(private router: Router, private cdr: ChangeDetectorRef,
    private userService: UsersService, private fileService: FilesService, public fileStorageService: FileStorageService,
    public dialog : MatDialog,
    private _bottomSheet: MatBottomSheet
  ) {
    console.log('editor created');
  }

  ngOnInit(): void {
    console.log('ngonit');
    this.isChecked = false; // for connectiontoggle
    this.router.events//to uncheck connection toggle on reroute
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChecked = false; 
        console.log("rerouted:)")
      });

    this.route.params.subscribe((params) => {
      if(params['id']) {
        this.id = params['id'];
        this.isnewfile = false;
      }
      console.log('params.id: ', this.id);
      if(this.id.length == 24) {
        this.fileStorageService.activeFile = this.fileStorageService.getFileFromStateStorage(this.id);
      }
      console.log(this.fileStorageService.activeFile);
      if (!this.fileStorageService.activeFile.fileName && this.id.length == 24) {
        console.log('params.id2: ', this.id);
        this.fileStorageService.getFileFromServer(this.id, FileLocation.PersonalOrCollabed).subscribe(
          file => this.fileStorageService.activeFile = file
        )
      } else if(this.id && this.id.length != 24) {
        console.log('local.id: ', this.id);
        this.fileStorageService.activeFile = this.fileStorageService.getFileByLocalId(this.id);
      }
    });
  }

  ngAfterViewInit(): void {
    this.headerElement = document.getElementById(
      'txtHeader'
    ) as HTMLInputElement;
    this.contentElement = document.getElementById(
      'txtContent'
    ) as HTMLTextAreaElement;
    console.log('ng afterviewint:');
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {

    console.log('closing file');
  }

  generateId(): string {
    return 'ok';
  }

  updateContent(): void {
    //make new implementation using ng model
    this.headerElement = document.getElementById(
      'txtHeader'
    ) as HTMLInputElement;
    this.contentElement = document.getElementById(
      'txtContent'
    ) as HTMLTextAreaElement;
    if (true) {
      this.headerElement.value = 'Hallo';
      this.contentElement.value = 'Welt';
    } else {
      this.resetValues();
    }
    console.log('content updated');
  }

  resetValues(): void {
    this.headerElement.value = '';
    this.contentElement.value = '';
  }

  navigateToEditor(id: string) {
    this.router.navigate(['/editor', id]);
  }

  saveBtn():void{
    if (this.fileStorageService.activeFile.fileName) {
      if (this.userService.isLoggedIn) {
        if (this.isnewfile) {
          this.addFileToServer(this.fileStorageService.activeFile.fileName);
        } else {
          this.updateFileToServer(this.fileStorageService.activeFile);
        }
      } else {
        if (this.isnewfile) {
          this.addFileToLocalStorage(this.fileStorageService.activeFile);
        } else {
          this.updateFileInLocalStorage(this.fileStorageService.activeFile);
        }
      }
    }
  }

  addFileToServer(fileName: string) {
    console.log('editor: addFileToServer()');
    this.fileStorageService.activeFile.fileName = fileName;
    this.fileStorageService.activeFile.localFileId = Date.now().toString();
    this.fileService.createFile(this.fileStorageService.activeFile).subscribe({
      next: (file) => {
        if (file.serverFileId) {
          console.log(this.userService.currentUser.userId);
          this.userService.addToPersonalFileList(
            file.serverFileId,
            this.userService.currentUser.userId
          ).subscribe({
            next: () => {
              this.userService.currentUser.serverFileIds.push(
                file.serverFileId!
              );
              this.userService.updateUserInLocalStorage();
              this.fileStorageService.activeFile.serverFileId = file.serverFileId;
              this.fileStorageService.addFile(this.fileStorageService.activeFile, FileLocation.Personal, true);
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

  updateFileToServer(file: File) {
    this.fileService.updateFileInDB(file).subscribe({
      next: (message) => {
        if(message.success) {
          alert('file Updated Succesfully');
        } else {
          alert('failed to Update File');
        }
      }
    })
  }

  addFileToLocalStorage(file: File) {
    file.localFileId = Date.now().toString();
    this.userService.localFileIds.push(file.localFileId);
    this.fileStorageService.addFile(file, FileLocation.Local, true);
  }
  updateFileInLocalStorage(file: File) {
    this.fileStorageService.updateLocalFie(file);
  }

  saveFile(): void {}

  toggleConnect(event: MatSlideToggleChange): void {
    console.log(event.checked);
  }

  //download and upload-------------------------------
  
  onDownload(): void {
    if (this.headerElement.value === '') {
      window.alert('Please enter File name');
    } else {
      const content = this.fileStorageService.activeFile.content;
      const link = document.createElement('a');
      link.download = this.headerElement.value + '.txt';

      const blob = new Blob([content], {
        type: 'text/plain',
      });

      link.href = window.URL.createObjectURL(blob);
      link.click();
    }
  }

  onFileSelected(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      this.fileStorageService.activeFile.content = e.target!.result as string;
      this.headerElement.value = file.name;
      this.activityTrue();
    };

    reader.readAsText(file);
  }

  uploadFile(): void {
    event!.preventDefault();
    //this.saveFile()
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  //popus-------------------------------------

  activity: boolean = false;
  activityTrue(): void {
    this.activity = true;
  }

  //For Open-Component
  openBottomSheet(): void {
    this._bottomSheet.open(MobilefilesSheet, {
      panelClass: 'custom-bottom-sheet-background',
    });  
  }


}

@Component({
  selector: 'mobile-files-sheet',
  templateUrl: 'mobile-files.html',
  standalone: true,
  imports: [MatListModule, PersonalBranchComponent],
})
export class MobilefilesSheet {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<MobilefilesSheet>
  ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
