import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { Files } from '../../../../services/files';
import { RouterModule } from '@angular/router';
import { MaxLenPipe } from '../../../../home/home-panel/home-pipes/max-len.pipe';

@Component({
  selector: 'app-open-results',
  standalone: true,
  imports: [RouterModule, CommonModule, MaxLenPipe],
  templateUrl: './open-results.component.html',
  styleUrl: './open-results.component.css',
})
export class OpenResultsComponent {
  //@Input() filesLocation!: Files;

  constructor() {}

}
