import { Component ,ViewEncapsulation} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [MatButtonModule, CommonModule, RouterModule],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css',
  //encapsulation:ViewEncapsulation.None,
})
export class AuthButtonComponent {
  constructor(public cuService: UsersService) {}
}
