import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-panel',
  standalone: true,
  imports: [RouterModule,RouterOutlet,MatButtonModule,MatIconModule],
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.css'
})
export class HomePanelComponent {

}
