import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'; 
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket$!: WebSocketSubject<any>; 
  public urlConfig: string;
  constructor() { 
    this.urlConfig = window.location.origin.replace('http', 'ws');
    console.log(this.urlConfig);
  } 

  connect() { 
    //this.socket$ = webSocket('ws://localhost:8080/myWebsocket'); // Replace with your WebSocket server URL
    this.socket$ = webSocket(this.urlConfig + '/myWebsocket'); // Replace with your WebSocket server URL 
  }

  disconnect() { 
    this.socket$.complete(); 
  } 
  isConnected(): boolean { 
    return (this.socket$ === null ? false : !this.socket$.closed); 
  } 

  onMessage(): Observable<any> { 
    return this.socket$!.asObservable().pipe(); 
  } 

  send(message: any) {
    console.log('message: ',message);
    this.socket$.next(message); 
  } 
}
