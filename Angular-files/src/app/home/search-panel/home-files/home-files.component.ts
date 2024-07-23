import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { File } from '../../../models/file_model';
import { RouterModule } from '@angular/router';
import { MaxLenPipe } from '../../home-panel/home-pipes/max-len.pipe';
import { DateFormat1Pipe } from '../../home-panel/home-pipes/date-format1.pipe';
import { FilesService } from '../../../services/files.service';
import { FileStorageService, FileLocation } from '../../../services/file-storage.service';
import { FilterTextPipe } from '../../home-panel/home-pipes/filtertext.pipe';
import { IsVisiblePipe } from '../../home-panel/home-pipes/is-visible.pipe';

@Component({
  selector: 'app-home-files',
  standalone: true,
  imports: [RouterModule, CommonModule, MaxLenPipe,DateFormat1Pipe, FilterTextPipe, IsVisiblePipe],
  templateUrl: './home-files.component.html',
  styleUrl: './home-files.component.css',
})
export class HomeFilesComponent implements OnInit{
  @Input() server_file_id!: string;
  @Input() fileLocation!: FileLocation;
  @Input() searchVal!: string;

  file: File = new File('', '', '', 0, '');

  constructor(private fileService: FilesService, private fileStorage: FileStorageService) {}

  ngOnInit(): void {
    if (this.server_file_id && this.fileLocation) {
      this.file = this.fileStorage.getFileFromStateStorage(this.server_file_id);
      if (this.file.fileName) {
        return;
      }
      
      this.fileStorage.getFileFromServer(this.server_file_id, this.fileLocation).subscribe(
        file => this.file = file
      );
    }
  }
}
