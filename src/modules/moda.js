import React, { Component } from 'react';
import { dealWithFile, readFileAsArrayBuffer } from '../utils/file';
import { InfiniteScroller } from 'react-iscroller';
import { hot } from 'react-hot-loader';

const STEP = 256;
const LINE_LENGTH = 16.0;
function transInt(i) {
  let r = i.toString(16);
  if (r.length < 2) {
    r = '0' + r;
  }
  return r.toUpperCase();
}
function transChar(i) {
  return String.fromCharCode(i);
}

const OneLine = ({line, offset}) => <div style={{wordWrap: 'break-word'}}>
  <span style={{ display: 'inline-block', marginRight: '2em', minWidth: '4em', textAlign: 'center' }}>{offset}</span>
  {
    line.map((i, pos) => <span
      key={`i-${pos}`}
      className="int-ele"
      style={{
        minWidth: '2em',
        display: 'inline-block',
        textAlign: 'center'
      }}
    >{transInt(i)}</span>)
  }
  <span style={{ margin: '0 1em'}} />
  {
    line.map((i, pos) => <span
      key={`a-${pos}`}
      className="int-ele"
      style={{
        minWidth: '0.8em',
        display: 'inline-block',
        textAlign: 'center'
      }}
    >{transChar(i)}</span>)
  }
</div>;
class ModA extends Component {

  constructor() {
    super();
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.state = {
      cur: 0,
      buf: [],
      file: {},
      blocks: [],
    };
  }

  async handleFileSelect(e) {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files.length) return;
    const file = files[0];
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const buf = new Uint8Array(arrayBuffer);
    // const block1 = this.getBlock(buf, 0);
    this.setState({
      blocks: [{startPos: '0', block: this.getBlock(buf, 0)}, {startPos: '512', block: this.getBlock(buf, 512)}],
      buf,
      file,
      cur: 1024,
    });
  }

  getBlock(arr, start, step=512) {
    const partArr = arr.slice(start, step + start);
    return partArr;
  }

  renderBlock({ startPos, block }) {
    const length = block.length;
    const lineNums = Math.ceil(length / LINE_LENGTH);
    const lines = new Array(lineNums).fill([]).map((l, i) => {
      return block.slice(i * LINE_LENGTH, i * LINE_LENGTH + LINE_LENGTH);
    }).filter(l => l.length);
    return <div>
      {
        lines.map((line, lineNum) => <OneLine key={`${lineNum}`} line={Array.from(line)} offset={+startPos + lineNum * LINE_LENGTH} />)
      }
    </div>;
  }

  onEnd() {
    const { cur, buf } = this.state;
    const newBlock = this.getBlock(buf, cur);

    if (newBlock.length) {
      this.setState({
        blocks: this.state.blocks.concat({startPos: `${cur}`, block: newBlock}),
        cur: cur + 512,
      });
    }
  }

  render() {
    const {
      buf,
      file: { name: filename, size: filesize, type: filetype },
      blocks,
    } = this.state;
    return <div>
      <input type="file" onChange={this.handleFileSelect}/>
      {
        filename &&
        <div style={{ margin: '2em 0' }}>
          <div>
            name: {filename}
          </div>
          <div>
            type: {filetype}
          </div>
          <div>
            size: {filesize} Bytes
          </div>
        </div>
      }
      <InfiniteScroller
        itemAverageHeight={24 * 16}
        containerHeight={'90vh'}
        items={blocks}
        itemKey="startPos"
        onRenderCell={this.renderBlock}
        onEnd={this.onEnd}
      />
    </div>
  }
}

// export default Mod
export default hot(module)(ModA)
