import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginToChatComponent } from './components/Login/login-to-chat/login-to-chat.component';

export const routes: Routes = [
    {path: '', component: LoginToChatComponent },
    {path: 'chat/:userId/:roomID', component: ChatComponent}
];
