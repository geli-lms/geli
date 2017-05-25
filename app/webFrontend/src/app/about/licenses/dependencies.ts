import {Dependency} from './dependency.model';

// Contains all Dependecys
export class DependenciesList {
  public static getDependencys(): Dependency[] {
    return [
      // BEGIN_REPLACE
      new Dependency('@types/bcrypt', '1.0.0', 'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT')
      , new Dependency('@types/bluebird', '3.5.4', 'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT')
      , new Dependency('@types/body-parser', '0.0.33', 'https://wwwhub.com/DefinitelyTyped/DefinitelyTyped.git', 'MIT'
        , true)
      // END_REPLACE
    ];
  }
}
