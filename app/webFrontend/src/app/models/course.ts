export class Course {
  name: string;
  description: string;
  teacher: string;

  constructor(name: string, description: string, teacher: string) {
    this.name = name;
    this.description = description;
    this.teacher = teacher;
  }
}
