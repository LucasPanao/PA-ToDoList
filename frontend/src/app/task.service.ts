import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(public webReqService: WebRequestService) { }

  createList(title: string){
    // request to create a list
      return this.webReqService.post('lists', { title });
  }

  createTasks(title: string, listId: string){
    // request to create a task
      return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  getLists() {
    return this.webReqService.get('lists')
  }

  getTasks(listId: string){
    return this.webReqService.get(`lists/${listId}/tasks`)
  }
}
