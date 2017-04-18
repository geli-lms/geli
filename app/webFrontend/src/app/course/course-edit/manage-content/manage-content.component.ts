import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-manage-content',
  templateUrl: './manage-content.component.html',
  styleUrls: ['./manage-content.component.scss']
})
export class ManageContentComponent implements OnInit {

  constructor() { }
  @Input() course;



  ngOnInit() {
      console.log('init manage...');
      console.log(this.course);
  }

}
