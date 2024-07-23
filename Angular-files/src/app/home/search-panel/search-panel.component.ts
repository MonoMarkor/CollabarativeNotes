import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFilesComponent } from './home-files/home-files.component';
import { SortByDatePipe } from '../home-panel/home-pipes/sort-by-date.pipe';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileLocation } from '../../services/file-storage.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-search-panel',
  standalone: true,
  imports: [
    HomeFilesComponent,
    CommonModule,
    SortByDatePipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.css',
})
export class SearchPanelComponent {
  personalFileLocation: FileLocation = FileLocation.Personal;

  tosearch: string="";

  constructor(public userService: UsersService) {}
}
