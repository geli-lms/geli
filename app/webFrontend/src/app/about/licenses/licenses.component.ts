import {Component, OnInit} from '@angular/core';

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
      new Dependency('@types/bcrypt','1.0.0','/vagrant/api/node_modules/@types/bcrypt','https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git','MIT','MIT','','')
      , new Dependency('@types/bluebird','3.5.4','/vagrant/api/node_modules/@types/bluebird','https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git','MIT','MIT','MIT','')
      , new Dependency('@types/body-parser','0.0.33','/vagrant/api/node_modules/@types/body-parser','https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git','MIT','MIT','','')
    ]
  }

  getAllApiDependencies() {
    // TODO
    this.allApiDependencies = [];
  }

}

export class Dependency {
  name: string;
  version: string;
  directory: string;
  repository: string;
  summary: string;
  fromPackageJson: string;
  fromLicense: string;
  fromReadme: string;

  constructor(name: string, version: string, directory: string, repository: string, summary: string, fromPackageJson: string, fromLicense: string, fromReadme: string) {
    this.name = name;
    this.version = version;
    this.directory = directory;
    this.repository = repository;
    this.summary = summary;
    this.fromPackageJson = fromPackageJson;
    this.fromLicense = fromLicense;
    this.fromReadme = fromReadme;
  }
}
