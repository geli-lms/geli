import {Pipe, PipeTransform} from '@angular/core';

/*
 * Attaches a JWT from localStorage as 'jwt' URL query parameter.
 * This is primarily intended to attach the mediaToken e.g. to a <video> src attribute.
 * The argument specifies which type of token is to be sent:
 * - media: A token that is restricted to media access. This is the default.
 * - regular: The regular JWT stored as 'token' and should preferably never be sent as URL parameter for security reasons!
 *
 * Usage:
 *   url | jwt:type
 *
 * Example:
 *   {{ '/api/uploads/somethingsomething.png' | jwt }}
 *   formats to: /api/uploads/somethingsomething.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[...rest of the JWT...]
*/
@Pipe({
  name: 'jwt'
})
export class JwtPipe implements PipeTransform {

  private availableTypes = {
    media: 'mediaToken',
    regular: 'token'
  };

  transform(url: string, type: string = 'media'): string {
    const key = this.availableTypes[type];
    const token = localStorage[key].split(' ')[1];
    const delimiter = url.indexOf('?') === -1 ? '?' : '&';
    return url + delimiter + 'jwt=' + token;
  }

}
