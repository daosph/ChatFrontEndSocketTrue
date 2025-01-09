import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chatMessage';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import {MatIconModule} from  '@angular/material/icon' ;
import {MatButtonModule} from  '@angular/material/button' ;
import {MatBadgeModule} from  '@angular/material/badge' ;

@Component({
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule,MatIconModule,MatButtonModule,MatBadgeModule],
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  userId: string = '';
  roomID: string = '';
  newMessage: string = '';
  messages: ChatMessage[] = [];
  private messageSubscription: Subscription | undefined;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }

    this.route.paramMap.subscribe(params => {
      const userIdParam = params.get('userId');
      const roomIDParam = params.get('roomID');
      if (userIdParam && roomIDParam) {
        this.userId = userIdParam;
        this.roomID = roomIDParam;

        
        this.chatService.joinRoom(this.roomID);

        this.messageSubscription = this.chatService.receiveMessage().subscribe((message: ChatMessage) => {
          this.messages.push(message);
        });
      } else {
        console.error('User ID parameter or roomID parameter is null or undefined.');
      }
    });
  }

  ngOnDestroy(): void {
 
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      const chatMessage: ChatMessage = {
        message: this.newMessage.trim(),
        user: this.userId,
        timestamp: new Date()
      };
      this.chatService.sendMessage(this.roomID, chatMessage); 
      this.newMessage = ''; 
    }
  }

  isMessageSent(message: ChatMessage): boolean {
    return message.user === this.userId;
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
    const currentMode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentMode);
    console.log('Dark mode toggled:', currentMode);
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }

}