import nock from 'nock';
import sinon from 'sinon';
import streamBuffers from 'stream-buffers';
import download from '../src/download';
import nockServer from './utils/nockServer';

describe('#download()', () => {
  beforeEach(nockServer);
  afterEach(() => nock.cleanAll());

  it('downloads a file', () => {
    const w = new streamBuffers.WritableStreamBuffer();
    return download('http://localhost/files/file.txt', w)
      .then(() => {
        w.getContentsAsString('utf8').should.be.exactly('Hello, World!\n');
      });
  });

  it('calls progress', () => {
    const w = new streamBuffers.WritableStreamBuffer();
    const progress = sinon.spy();
    return download('http://localhost/files/file.txt', w, progress)
      .then(() => {
        progress.called.should.be.exactly(true);
        progress.firstCall.args.should.deepEqual([0]);
        progress.lastCall.args.should.deepEqual([1]);
      });
  });
});