import { Component,Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-files',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './group-files.component.html',
  styleUrl: './group-files.component.css',
})
export class GroupFilesComponent {
  @Input() gFile!: string;
}
