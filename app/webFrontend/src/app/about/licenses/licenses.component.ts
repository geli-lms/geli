import {Component, OnInit} from '@angular/core';
import {Dependency} from './dependency.model';

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
    this.allFrontendDependencies = [
      new Dependency('@types/bcrypt', '1.0.0', '/vagrant/api/node_modules/@types/bcrypt',
        'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT', 'MIT', '', '')
      , new Dependency('@types/bluebird', '3.5.4', '/vagrant/api/node_modules/@types/bluebird',
        'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT', 'MIT', 'MIT', '')
      , new Dependency('@types/body-parser', '0.0.33', '/vagrant/api/node_modules/@types/body-parser',
        'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT', 'MIT', '', '')
    ].sort(Dependency.compare);
  }

  getAllApiDependencies() {
    this.allApiDependencies = [
      // TODO
    ].sort(Dependency.compare);
  }

}
