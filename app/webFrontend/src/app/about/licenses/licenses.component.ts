import {Component, OnInit} from '@angular/core';
import {Dependency} from './dependency.model';
import {DependenciesList} from './dependencies';

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss']
})
export class LicensesComponent implements OnInit {

  allFrontendDependencies: Dependency[];
  allApiDependencies: Dependency[];

  constructor() {
  }

  ngOnInit() {
    this.getAllFrontendDependencies();
    this.getAllApiDependencies();
  }

  getAllFrontendDependencies() {
    this.allFrontendDependencies = DependenciesList.getDependencys()
      .sort(Dependency.compare);
  }

  getAllApiDependencies() {
    this.allApiDependencies = [
      // TODO
    ].sort(Dependency.compare);
  }

}
