import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { File } from '../../models/file_model';
import { RouterModule } from '@angular/router';
import { MaxLenPipe } from '../home-panel/home-pipes/max-len.pipe';
import {
  FileStorageService,
  FileLocation,
} from '../../services/file-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { IsVisiblePipe } from '../home-panel/home-pipes/is-visible.pipe';
import { FilterTextPipe } from '../home-panel/home-pipes/filtertext.pipe';

@Component({
  selector: 'app-home-files',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MaxLenPipe,
    MatIconModule,
    IsVisiblePipe,
    FilterTextPipe,
  ],
  templateUrl: './home-files.component.html',
  styleUrls: ['./home-files.component.css'],
})
export class HomeFilesComponent implements OnInit, OnChanges {
  @Input() fileId!: string;
  @Input() fileLocation!: FileLocation;
  @Input() searchVal!: string;

  file: File = new File('', '', '', 0, '');
  link: string | null = '';
  hidden: boolean = false;

  name!: string;

  @Output() nameEvent = new EventEmitter<string>();

  constructor(private fileStorage: FileStorageService) {}

  ngOnInit(): void {
    if (this.fileLocation == FileLocation.Local) {
      this.file = this.fileStorage.getFileByLocalId(this.fileId);
      this.link = this.file.localFileId;
      console.log(this.file.fileName);
      this.updateVisibility();
    } else {
      if (this.fileId && this.fileLocation) {
        this.file = this.fileStorage.getFileFromStateStorage(this.fileId);
        if (this.file.fileName) {
          this.updateVisibility();
          this.name = this.file.fileName;
          this.link = this.file.serverFileId;
          this.nameEvent.emit(this.name);
          return;
        }
  
        this.fileStorage
          .getFileFromServer(this.fileId, this.fileLocation)
          .subscribe((file) => {
            this.file = file;
            this.link = this.file.serverFileId;
            this.updateVisibility();
          });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchVal'] || changes['file']) {
      this.updateVisibility();
    }
  }

  private updateVisibility(): void {
    this.hidden = !this.isFileNameVisible();
  }

  private isFileNameVisible(): boolean {
    return (
      this.filterText(this.file.fileName, this.searchVal) &&
      this.isVisible(this.file.fileName)
    );
  }

  private filterText(value: string, searchText: string): boolean {
    if (!value || !searchText) {
      return true;
    }
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseSearchText = searchText.toLowerCase();
    return lowerCaseValue.includes(lowerCaseSearchText);
  }

  private isVisible(value: string): boolean {
    return value !== '';
  }

  getDisplayStyle(): string {
    return this.hidden ? 'none' : 'block';
  }
}
