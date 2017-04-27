import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../shared/authentification.service";

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private auth: AuthenticationService) {
    this.route.params.subscribe(params => {
      console.log("Token: " + params["token"]);
      auth.activate(params["token"]);
    });
  }

  ngOnInit() {
  }

}
