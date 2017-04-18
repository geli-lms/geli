/**
 * Created by Lukas on 14.02.2017.
 */
export class Course {
    constructor(name: string, description: string, teacher: string) {
        this.name = name;
        this.description = description;
        this.teacher = teacher;
    }
    name: string;
    description: string;
    teacher: string;
}
