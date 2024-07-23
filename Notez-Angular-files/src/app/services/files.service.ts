import { Injectable } from '@angular/core';
//import { Files } from './files';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { File } from '../models/file_model';
import { Group } from '../models/group_model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private http: HttpClient, public userservice: UsersService) {
    // Load files from localStorage if already saved
    /*const storedFiles = localStorage.getItem(this.localStorageKey);
    if (storedFiles) {
      this.localFiles = JSON.parse(storedFiles);
    }*/
  }

  generateId(): number {
    return 1;
  }
  checkIdIfPresent(id: string): boolean {
    return false;
  }
  deleteFileById(id: string): void {}

  //localfiles implementation---------------------------------------------------------------

  private localStorageKey = 'files';
  private localFiles: File[] = [];
  UserLocalFiles: File[] = [];

  // Function to save files array to localStorage
  saveFilesToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.localFiles));
  }

  getFilesfromLocalStorage(): void {
    const files = localStorage.getItem(this.localStorageKey);
    if (files) {
      this.localFiles = JSON.parse(files);
    }
  }

  pushUserLocalFile(file: File): void {
    this.UserLocalFiles.push(file);
  }

  getuserlocalfiles(local_ids: string[]): void {
    for (let i = 0; i < local_ids.length; i++) {
      //console.log(local_ids[i]);
      if (this.localFiles.some((file) => file.localFileId === local_ids[i])) {
        this.UserLocalFiles.push(this.getslocalFileById(local_ids[i])!);
      }
    }
  }

  addUserFilestoLocalfiles(): void {
    for (const userFile of this.UserLocalFiles) {
      const index = this.localFiles.findIndex(
        (file) => file.localFileId === userFile.localFileId
      );
      if (index !== -1) {
        // Update existing file
        this.localFiles[index] = userFile;
      } else {
        // Append new file
        this.localFiles.push(userFile);
      }
    }
    this.saveFilesToLocalStorage();
  }

  getslocalFileById(id: string): File | undefined {
    return this.UserLocalFiles.find((file) => file.localFileId === id);
  }

  // Server Implementation -----------------------------------------------------------------------------
  //private api: string = 'http://localhost:8080';
  private api: string = window.location.origin;

  getFileFromServer(server_file_id: string | null): Observable<File> {
    return this.http
      .get<File>(`${this.api}/files/${server_file_id}`)
      .pipe(catchError(this.errorHandler));
  }

  createFile(file: File): Observable<File> {
    const body = {
      localFileId: file.localFileId,
      serverFileId: file.serverFileId,
      fileName: file.fileName,
      version: file.version,
      content: file.content,
      tree: file.tree
    };
    return this.http
      .put<File>(`${this.api}/files`, body)
      .pipe(catchError(this.errorHandler));
  }

  updateFileInDB(file: File): Observable<any> {
    const body = {
      localFileId: file.localFileId,
      serverFileId: file.serverFileId,
      fileName: file.fileName,
      version: file.version,
      content: file.content,
      tree: file.tree
    };
    return this.http
      .post<any>(`${this.api}/files`, body)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse): Observable<any> {
    console.log('FileService: Http Fehler aufgetreten!');
    return throwError(() => error);
  }

  //------  Mono's File Implementation
  sampleGroups: Group[] = [
    new Group(
      '1234',
      'Group1',
      ['123'],
      [
        '0987',
        '0',
        '098598765',
        '0981',
        '0987',
        '0986',
        '0985',
        '0981',
        '0987',
        '0986',
        '0985',
        '0981',
      ]
    ),
    new Group('1235', 'Group2', ['123'], ['9876', '9875']),
    new Group('1236', 'Group3', ['123'], ['8765']),
  ];
}
