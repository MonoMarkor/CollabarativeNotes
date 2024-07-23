import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';
import { ThemeService } from './services/theme.service';
import { ReactiveFormsModule } from '@angular/forms';
import { fileStorageKeys, UsersService } from './services/users.service';
import { User } from './models/user_model';
import { FileLocation, FileStorageService } from './services/file-storage.service';
import { WebsocketService } from './services/websocket.service';
//import { BrowserModule } from '@angular/platform-browser';// error when using it with commonmudule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    EditorComponent,
    HomeComponent,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Collab note';

  constructor(
    public themeService: ThemeService,
    private userService: UsersService,
    private fileStorageService: FileStorageService,
    private websocket: WebsocketService,
  ) {
    console.log(
      window.matchMedia(
        'check if system is darkmode' + '(prefers-color-scheme: dark)'
      ).matches
    );
    console.log(
      window.matchMedia(
        'check if system is darkmode' + '(prefers-color-scheme: light)'
      ).matches
    );
  }

  /*currentMode = {
    lightmode: false,
    darkmode: true,
  };*/

  ngOnInit(): void {
    if (!localStorage.getItem('lightMode')) {
      // Initialize theme based on system preference
      this.themeService.setThemeBasedOnSystemPreference();
      console.log('component match');
    }
    if (localStorage.getItem(fileStorageKeys.user)) {
      const user = localStorage.getItem(fileStorageKeys.user);
      if (user) {
        this.userService.currentUser = JSON.parse(user);
        if (this.userService.currentUser.username === this.userService.defaultUser.username) {
          this.userService.currentUser= this.userService.defaultUser
          this.userService.isLoggedIn = false;
          }
        else{
          this.userService.isLoggedIn = true;
        }  
      }
    } else {
      this.userService.currentUser = this.userService.defaultUser;
      this.userService.isLoggedIn = false;
    }

    this.fileStorageService.bootUp();
    this.websocket.connect();
  }
}
