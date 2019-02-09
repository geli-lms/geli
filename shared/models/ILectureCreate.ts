/**
 * Defines what the `{post} /api/lecture/` aka `addLecture` route receives as request body.
 */
export interface ILectureCreate {
  courseId: string;
  name: string;
  description: string;
}
