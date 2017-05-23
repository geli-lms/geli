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
}
