import { MaxLenPipe } from './max-len.pipe';

describe('MaxLenPipe', () => {
  it('create an instance', () => {
    const pipe = new MaxLenPipe();
    expect(pipe).toBeTruthy();
  });
});
