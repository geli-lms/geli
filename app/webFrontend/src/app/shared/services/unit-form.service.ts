import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable()
export class UnitFormService {

  public unitForm: FormGroup;
  public beforeSubmit;




  constructor() {
    this.unitForm = new FormGroup({});
  }



}
