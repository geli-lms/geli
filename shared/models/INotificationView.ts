/**
 * Defines what the `{get} /api/notification/` aka `getNotifications` route returns as response (in form of an array).
 * It is the sanitized version of `INotification` interface: The property names are identical, but `changedCourse`,
 * `changedLecture` and `changedUnit` only represent the optional IDs (`_id`s) of the corresponding full interfaces of `INotification`.
 * The `user` is omitted, because the notifications currently can only be requested by the owner (i.e. `@CurrentUser`) anyway.
 * (Also, the `_id` is of type `string` instead of `any`, since the `any` in `INotification` is only there for compatibility
 * with `mongoose.Document` to form `INotificationModel`.)
 */
export interface INotificationView {
  _id: string;
  changedCourse?: string;
  changedLecture?: string;
  changedUnit?: string;
  text: string;
  isOld: boolean;
}
