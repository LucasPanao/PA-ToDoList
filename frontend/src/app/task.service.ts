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
}
