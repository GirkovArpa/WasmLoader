'use strict';

export default class WasmLoader {

  async fetchWasm(filename) {
    const response = await fetch(filename);
    const file = await response.arrayBuffer();
    return file;
  }

  async loadWasm(filename) {
    const file = await this.fetchWasm(filename);
    const memory = new WebAssembly.Memory({ initial: 32_767, maximum: 65_536 });
    const wasm = await WebAssembly.instantiate(file, { env: { memory } });
    const { buffer } = wasm.instance.exports.memory;
    const { byteLength } = buffer;
    const myMemory = {
      buffer,
      i32: new Int32Array(buffer, 0, byteLength / 4),
      f64: new Float64Array(buffer, 0, byteLength / 8),
    };
    const { memory: memory, ...myFunctions } = wasm.instance.exports;
    return { myFunctions, myMemory };
  }
}