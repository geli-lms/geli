/**
 * This is currently used to define the responses for all 3 DuplicationController routes,
 * since the front-end only uses the returned IDs of duplicated courses, lectures and units.
 * Should these requirements change, this part can easily be replaced by more specific interfaces.
 */
export interface IDuplicationResponse {
  _id: string;
}
