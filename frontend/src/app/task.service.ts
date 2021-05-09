import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
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

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
  
}
