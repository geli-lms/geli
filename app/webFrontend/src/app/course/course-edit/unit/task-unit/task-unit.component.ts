import {Component, Input, OnInit} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {UserService} from '../../../../shared/services/user.service';
import {ITaskUnit} from '../../../../../../../../shared/models/units/ITaskUnit';
import {TaskAttestationService} from '../../../../shared/services/data.service';

@Component({
  selector: 'app-task-unit',
  templateUrl: './task-unit.component.html',
  styleUrls: ['./task-unit.component.scss']
})

// Task attestation frame for TaskUnit
export class TaskUnitComponent implements OnInit {

  @Input() taskUnit: ITaskUnit;

  constructor(private taskAttestationService: TaskAttestationService) {
  }

  ngOnInit() {
  }

}
