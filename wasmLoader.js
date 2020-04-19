/** emcc
* -Os
* -s STANDALONE_WASM
* -s INITIAL_MEMORY=1024mb
* -s TOTAL_MEMORY=1024mb
* -s TOTAL_STACK=512mb
* -s EXPORTED_FUNCTIONS="['_myFunction1,' '_myFunction2']"
* -Wl,--no-entry
* "filename.cpp"
* - o
* "filename.wasm"
*/
'use strict';

export default class WasmLoader {

  async fetchWasm(filename) {
    const response = await fetch(filename);
    const file = await response.arrayBuffer();
    return file;
  }

  async loadWasm(filename) {
    const file = await this.fetchWasm(filename);
    const wasm = await WebAssembly.instantiate(file);
    const { buffer } = wasm.instance.exports.memory;
    const { byteLength } = buffer;
    const myMemory = {
      buffer,
      i32: new Int32Array(buffer, 0, byteLength / Int32Array.BYTES_PER_ELEMENT),
      f64: new Float64Array(buffer, 0, byteLength / Float64Array.BYTES_PER_ELEMENT),
    };
    const { memory, ...functions } = wasm.instance.exports;
    return { functions, memory };
  }
}