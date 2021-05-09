import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor( private TaskService: TaskService, private router: Router ) { }

  ngOnInit(): void {
  }

  createList(title: string){
    this.TaskService.createList(title).subscribe((list: any) => {
      console.log(list)
      // redirecionando para a página da lista /lists/list._id
      this.router.navigate(['/lists',list._id]);
    })
  }

}
