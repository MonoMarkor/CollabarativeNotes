import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { File } from '../../../models/file_model';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { FileStorageService, FileLocation } from '../../../services/file-storage.service';
import { MaxLenPipe } from '../../../home/home-panel/home-pipes/max-len.pipe';

@Component({
  selector: 'app-pleaves',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, RouterLink,MatListModule, MaxLenPipe],
  templateUrl: './pleaves.component.html',
  styleUrl: './pleaves.component.css',
})
export class PleavesComponent {
  @Input() server_file_id?: string;
  @Input() fileLocation?: FileLocation;
  file: File = new File('', '', '', 0, '');

  constructor(private fileStorage: FileStorageService) {}

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
