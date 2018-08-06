import {JwtPipe} from './jwt.pipe';

describe('JwtPipe', () => {
  it('create an instance', () => {
    const pipe = new JwtPipe();
    expect(pipe).toBeTruthy();
  });
});
