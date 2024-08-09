import { Component,HostListener } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomePanelComponent } from './home-panel/home-panel.component';
import { HeaderComponent } from '../header/header.component';
import { MatDividerModule } from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { PersonalBlockComponent } from "./personal-block/personal-block.component";
import { GroupBlockComponent } from "./group-block/group-block.component";
import { FileLocation } from '../services/file-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    RouterModule,
    RouterOutlet,
    CommonModule,
    HomePanelComponent,
    HeaderComponent,
    MatDividerModule,
    MatTabsModule,
    MatIconModule,
    PersonalBlockComponent,
    GroupBlockComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('600ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('fadeInOut2', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('600ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HomeComponent {
  isVisible: boolean = false;
  personalFileLocation: FileLocation = FileLocation.Personal;
  localFileLocation: FileLocation = FileLocation.Local;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = document.querySelector('app-home-panel');
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      );
      if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        this.isVisible = true;
      }
    }
  }
}
