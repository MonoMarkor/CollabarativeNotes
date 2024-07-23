
// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly lightModeKey = 'lightMode';

  constructor() {
    this.loadTheme();
  }

  currentMode = {
    lightmode: false,
    darkmode: true,
  };

  private loadTheme(): void {
    const lightMode = localStorage.getItem(this.lightModeKey);
    if (lightMode !== null) {
      this.currentMode.lightmode = lightMode === 'true';
      this.currentMode.darkmode = lightMode !== 'true';
    }
  }

  toggleTheme(): void {
    this.currentMode.lightmode = !this.currentMode.lightmode;
    this.currentMode.darkmode = !this.currentMode.darkmode;
    localStorage.setItem(
      this.lightModeKey,
      this.currentMode.lightmode.toString()
    );
  }

  getCurrentModeClass(): string {
    return this.currentMode.lightmode ? 'lightmode' : 'darkmode';
  }

  setThemeBasedOnSystemPreference(): void {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.currentMode.lightmode = !prefersDark;
    this.currentMode.darkmode = prefersDark;
    console.log("service match")
    console.log('prefersDark: ' + prefersDark);
    localStorage.setItem(
      this.lightModeKey,
      this.currentMode.lightmode.toString()
    );
  }
}

