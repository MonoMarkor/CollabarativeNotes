import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import { HomeFilesComponent } from '../home-files/home-files.component';
import { UsersService } from '../../services/users.service';
import { FileLocation, FileStorageService } from '../../services/file-storage.service';
import { SortByDatePipe } from '../home-panel/home-pipes/sort-by-date.pipe';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { IsVisiblePipe } from '../home-panel/home-pipes/is-visible.pipe';
import { FilterTextPipe } from '../home-panel/home-pipes/filtertext.pipe';

@Component({
  selector: 'app-personal-block',
  standalone: true,
  imports: [
    CommonModule,
    HomeFilesComponent,
    SortByDatePipe,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    IsVisiblePipe,
    FilterTextPipe,
  ],
  templateUrl: './personal-block.component.html',
  styleUrl: './personal-block.component.css',
})
export class PersonalBlockComponent {
  @Input() fileLocation?: FileLocation;

  personalFileLocation: FileLocation = FileLocation.Personal;
  localFileLocation: FileLocation = FileLocation.Local;
  tosearch: string = '';

  constructor(public userService: UsersService) {}

  filename!: string;

  setname(newItem: string) {
    this.filename = newItem;
  }
}
