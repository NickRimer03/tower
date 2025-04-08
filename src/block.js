import * as THREE from "three";
import { BASE_BLOCK_SIZE, COLOR } from "./const.js";

export default class BlockModel {
  #width;
  #height;
  #depth;
  #geometry;
  #material;
  #mesh;

  constructor({
    width,
    height = BASE_BLOCK_SIZE.height,
    depth,
    initPosition = new THREE.Vector3(0, 0, 0),
    color = COLOR.movingBlock,
  }) {
    this.#width = width;
    this.#height = height;
    this.#depth = depth;

    this.#geometry = new THREE.BoxGeometry(this.#width, this.#height, this.#depth);
    this.#material = new THREE.MeshLambertMaterial({ color });

    this.#mesh = new THREE.Mesh(this.#geometry, this.#material);
    this.#mesh.position.set(...initPosition);
  }

  get mesh() {
    return this.#mesh;
  }
}
