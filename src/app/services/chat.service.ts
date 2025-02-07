import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../models/chatMessage';
import { HttpClient } from '@angular/common/http';
import { formulario } from '../models/formulario';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private messagesSubject: Subject<ChatMessage> = new Subject<ChatMessage>();

  constructor(private http: HttpClient) {
    this.initConnectionSocket();
  }

  private apiUrl = 'http://localhost:3000/api';  // URL de la API

 

  
  postFormulario(formulario: formulario) {
    return this.http.post<string>(this.apiUrl + '/register-user', formulario); // Ensure it's expecting a string response
  }
  


  getRoles(): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/get-roles');
  }

 
 

  private initConnectionSocket() {
    const url = 'http://localhost:3001/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  receiveMessage(): Observable<ChatMessage> {
    return this.messagesSubject.asObservable();
  }


  joinRoom(roomID: string) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${roomID}`, (message: any) => {
        const parsedMessage: ChatMessage = JSON.parse(message.body);
        this.messagesSubject.next(parsedMessage); // Emitir el mensaje recibido al observable
      });
    });
  }

  sendMessage(roomID: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomID}`, {}, JSON.stringify(chatMessage));
  }


 
}
