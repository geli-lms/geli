export class Dependency {
  name: string;
  version: string;
  repository: string;
  license: string;
  devDependency: boolean;

  // To be able to sort eg an array
  public static compare(a: Dependency, b: Dependency): number {
    let compare;

    // Check for package name
    compare = a.name.localeCompare(b.name);
    if (compare !== 0) {
      return compare;
    }

    // Check for version
    compare = a.version.localeCompare(b.version);

    return compare;
  }

  constructor(name: string, version: string, repository: string, license: string, devDependency: boolean = false) {
    this.name = name;
    this.version = version;
    this.repository = repository;
    this.license = license;
    this.devDependency = devDependency;
  }
}
