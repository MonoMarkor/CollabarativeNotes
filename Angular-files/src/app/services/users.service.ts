import { Injectable } from '@angular/core';
import { User } from '../models/user_model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Group } from '../models/group_model';
import { File } from '../models/file_model';
import { Tree } from '../models/tree_model';
import { Node } from '../models/node_model';
import { FileLocation } from './file-storage.service';
import { ActivatedRoute } from '@angular/router';

export enum fileStorageKeys {
  username = 'username',
  user = 'user',
  localFiles = 'localFiles',
  personalFiles = 'personalFiles'
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public event$: any;

  constructor(private http: HttpClient) {
  }

  public defaultUser: User = new User('', 'LocalUser@12345#+*%', '',[],[],[]);
  isLoggedIn: boolean = false;

  currentUser: User = new User('', '', '');

  getUsername():string{
    return this.currentUser.username
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = this.defaultUser;
    localStorage.setItem(fileStorageKeys.username, this.defaultUser.username);
    localStorage.setItem(fileStorageKeys.user,JSON.stringify(this.defaultUser));
    localStorage.setItem(fileStorageKeys.personalFiles, JSON.stringify([]));
  }

  userLogin(user: User): void {
    if (user.username == this.defaultUser.username) {
      this.currentUser.username= this.defaultUser.username ;
      localStorage.setItem(fileStorageKeys.username, user.username);
      this.isLoggedIn = false;
    } else {
      this.currentUser = user;
      console.log('userid: ', user.userId);
      this.isLoggedIn = true;
      this.updateUserInLocalStorage();
    }

    console.log(
      this.currentUser.username +
        ' has logged in with groups: ' +
        this.currentUser.groupIds +
        '  ,user logged in: ' +
        this.isLoggedIn
    );
  }

  updateUserInLocalStorage() {
    localStorage.setItem(fileStorageKeys.username, this.currentUser.username);
    localStorage.setItem(fileStorageKeys.user, JSON.stringify(this.currentUser));
  }

  updateFilesInLocalStorage(files: File[] = [], fileLocation: FileLocation) {
    if (fileLocation == FileLocation.Local) {
      localStorage.setItem(fileStorageKeys.localFiles, JSON.stringify(files));
    } else if(fileLocation == FileLocation.Personal) {
      localStorage.setItem(fileStorageKeys.personalFiles, JSON.stringify(files));
    }
  }

  getFilesFromLocalStrorage(fileLocation: FileLocation): File[] {
    let fileString: string | null = '';
    if (fileLocation == FileLocation.Local) {
      fileString = localStorage.getItem(fileStorageKeys.localFiles);
    } else if(fileLocation == FileLocation.Personal) {
      fileString = localStorage.getItem(fileStorageKeys.personalFiles);
    }
    
    let files: File[] = JSON.parse(fileString!);
    let newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      let nodes: Node[] = [];
      for (let j = 0; j < files[i].tree.nodes.length; j++) {
        nodes.push(new Node(files[i].tree.nodes[j].char, files[i].tree.nodes[j].siteId, files[i].tree.nodes[j].logicalCount, files[i].tree.nodes[j].position));
      }
      let newFile: File = new File('', '', '');
      newFile.fileName = files[i].fileName;
      newFile.content = files[i].content;
      newFile.serverFileId = files[i].serverFileId;
      newFile.localFileId = files[i].localFileId;
      newFile.tree = new Tree(files[i].tree.logicalCount, nodes, files[i].tree.maxMembers);
      newFile.version = files[i].version;
      newFile.fileName = files[i].fileName;
      newFiles.push(newFile);
    }
    return newFiles;
  }

  //private api: string = 'http://localhost:8080';
  private api: string = window.location.origin;

  verifyUser(username: string, password: string): Observable<User> {
    const body = {
      username: username,
      password: password,
    };
    return this.http
      .post<User>(`${this.api}/users`, body)
      .pipe(catchError(this.errorHandler));
  }

  checkUsernameAvailibillty(username: string): Observable<any> {
    return this.http
      .get<User>(`${this.api}/users/available/${username}`)
      .pipe(catchError(this.errorHandler));
  }

  createAccount(username: string, password: string): Observable<User> {
    const body = {
      username: username,
      password: password,
    };
    return this.http
      .put<User>(`${this.api}/users`, body)
      .pipe(catchError(this.errorHandler));
  }

  getMatchingUsernames(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.api}/users/search/${searchTerm}`).pipe(
      retry(3),
      catchError(this.errorHandler)
    );
  }

  addToPersonalFileList(
    server_file_id: string,
    user_id: string
  ): Observable<any> {
    const body = {
      user_id: user_id,
      server_file_id: server_file_id,
    };
    return this.http
      .put<any>(`${this.api}/users/serverFiles`, body)
      .pipe(catchError(this.errorHandler));
  }

  getGroupFromDB(groupId: string): Observable<Group> {
    return this.http
      .get<Group>(`${this.api}/groups/${groupId}`)
      .pipe(catchError(this.errorHandler));
  }

  createGroup(group: Group): Observable<Group> {
    const body = {
      groupId: group.groupId,
      groupName: group.groupName,
      members: group.members,
      serverFileIds: group.serverFileIds
    };
    return this.http
      .put<Group>(`${this.api}/groups`, body)
      .pipe(catchError(this.errorHandler));
  }

  addGroupToUser(userId: string, groupId: string): Observable<any> {
    const body = {
      groupId: groupId
    };
    return this.http
      .put<any>(`${this.api}/users/${userId}`, body)
      .pipe(catchError(this.errorHandler));
  }

  addMemberToGroup(userId: string, groupId: string): Observable<any> {
    const body = {
      userId: userId
    };
    return this.http
      .put<any>(`${this.api}/groups/${groupId}`, body)
      .pipe(catchError(this.errorHandler));
  }

  addFileToGroup(fileId: string, groupId: string): Observable<any> {
    const body = {
      fileId: fileId
    };
    return this.http
      .put<any>(`${this.api}/groups/${groupId}`, body)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse): Observable<any> {
    console.log('UserService: Http Fehler aufgetreten!');
    return throwError(() => error);
  }
}
