import { Component,inject, } from '@angular/core';
import { OpenResultsComponent } from './open-results/open-results.component';
//import { Files } from '../../../services/files';
import { FilesService } from '../../../services/files.service';
import { CommonModule } from '@angular/common';
import { SortByDatePipe } from '../../../home/home-panel/home-pipes/sort-by-date.pipe';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-open',
  standalone: true,
  imports: [OpenResultsComponent, CommonModule, SortByDatePipe,RouterModule],
  templateUrl: './open.component.html',
  styleUrl: './open.component.css',
})
export class OpenComponent {

  /*files1: Files[] = [];
  filesservice: FilesService = inject(FilesService);
  filteredFilesList: Files[] = [];
*/


  constructor() {
    //this.files1 = this.filesservice.getAllFiles();
    //this.filteredFilesList = this.files1;
  }
  filterResults(text: string) {
    if (!text) {
     // this.filteredFilesList = this.files1;
    }

    //this.filteredFilesList = this.files1.filter((fileslocation) =>
    //  fileslocation?.fileTitle.toLowerCase().includes(text.toLowerCase())
    //);
  }
}
