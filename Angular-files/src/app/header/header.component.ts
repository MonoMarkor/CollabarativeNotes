import { Component, inject } from '@angular/core';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthButtonComponent } from '../Auth/auth-button/auth-button.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButton,
    MatButtonToggleModule,
    MatIcon,
    MatToolbarModule,
    AuthButtonComponent,
    MatSlideToggleModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  themeService: ThemeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarmode():boolean{
    if (this.themeService.currentMode.darkmode) {
      return true;
    }
    return false;
  }
  
}

