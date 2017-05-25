import {Dependency} from './dependency.model';

// Contains all Dependecys
export class DependenciesList {
  public static getDependencys(): Dependency[] {
    return [
      new Dependency('@types/bcrypt', '1.0.0', '/vagrant/api/node_modules/@types/bcrypt',
        'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT', 'MIT', '', '')
      , new Dependency('@types/bluebird', '3.5.4', '/vagrant/api/node_modules/@types/bluebird',
        'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT', 'MIT', 'MIT', '')
      , new Dependency('@types/body-parser', '0.0.33', '/vagrant/api/node_modules/@types/body-parser',
        'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT', 'MIT', '', '', true)
    ];
  }
}
