import { Component, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FilesService } from '../services/files.service';
import { CommonModule } from '@angular/common';
import { HomeFilesComponent } from './search-panel/home-files/home-files.component';
import { HomePanelComponent } from './home-panel/home-panel.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { HeaderComponent } from '../header/header.component';
import { CollabPanelComponent } from './collab-panel/collab-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    RouterModule,
    RouterOutlet,
    CommonModule,
    HomePanelComponent,
    SearchPanelComponent,
    HeaderComponent,
    CollabPanelComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  /*files1:Files[] = [];
  filesservice : FilesService = inject(FilesService);

  constructor(){
    this.files1=this.filesservice.getAllFiles();
  }*/
 constructor(){
  
 }
}
