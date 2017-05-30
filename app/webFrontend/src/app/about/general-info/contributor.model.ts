export class Contributor {
  public static PRESENT = 'present';

  firstName: string;
  name: string;
  from: string;
  to: string;
  githubId: string;
  position: string;

  // To be able to sort eg an array
  public static compare(a: Contributor, b: Contributor): number {
    let compare;

    // Check for TO
    compare = a.to.localeCompare(b.to);
    if (compare !== 0) {
      // Check if a or b is tagged with "present", if yes these belong to the top
      if (a.to === Contributor.PRESENT) {
        return -1;
      } else if (b.to === Contributor.PRESENT) {
        return 1;
      } else {
        return (compare * -1);
      }
    }

    // Check for FROM
    compare = a.from.localeCompare(b.from);
    if (compare !== 0) {
      return compare;
    }

    // Check for NAME
    compare = a.name.localeCompare(b.name);
    if (compare !== 0) {
      return compare;
    }

    // Check for FIRST_NAME
    compare = a.firstName.localeCompare(b.firstName);

    return compare;
  }

  constructor(firstName: string, name: string, from: string, position: string,
              githubId: string = '', to: string = Contributor.PRESENT) {
    this.firstName = firstName;
    this.name = name;
    this.from = from;
    this.position = position;
    this.githubId = githubId;
    this.to = to;
  }
}
