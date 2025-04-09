import * as THREE from "three";
import { AXIS, MOVING_RANGE } from "../const.js";
import BlockModel from "./block/block.js";
import FallingBlockModel from "./block/falling.js";
import PlacedBlockModel from "./block/placed.js";

export default class LayerModel {
  #scene;
  #axis;
  #movingBlock;
  #fallingBlock;
  #placedBlock;
  #initMovingBlockPosition = -MOVING_RANGE;
  #overlap = 0;
  #isCuttingBehind = false;

  constructor({ scene, axis = AXIS.X, width, depth, x = 0, y = 0, z = 0 }) {
    this.#scene = scene;
    this.#axis = axis;

    this.#movingBlock = new BlockModel({
      width,
      depth,
      initPosition: new THREE.Vector3(
        this.isAxisX ? this.#initMovingBlockPosition : x,
        y,
        this.isAxisZ ? this.#initMovingBlockPosition : z,
      ),
    });

    this.#scene.add(this.#movingBlock.mesh);
  }

  cut(previousPlacedBlock) {
    this.#overlap = this.isAxisX
      ? this.movingBlock.width -
        Math.abs(this.movingBlock.mesh.position.x - previousPlacedBlock.mesh.position.x)
      : this.movingBlock.depth -
        Math.abs(this.movingBlock.mesh.position.z - previousPlacedBlock.mesh.position.z);

    if (this.#overlap <= 0) {
      this.#createFallingBlock(true);
      this.#removeMovingBlock();

      return false;
    }

    this.#isCuttingBehind =
      this.movingBlock.mesh.position[this.axis] - previousPlacedBlock.mesh.position[this.axis] < 0;
    this.#createPlacedBlock();
    this.#createFallingBlock();
    this.#removeMovingBlock();

    return true;
  }

  clear() {
    this.#removeMovingBlock();
    this.#scene.remove(this.placedBlock?.mesh, this.fallingBlock?.mesh);
    this.#placedBlock = null;
    this.#fallingBlock = null;
  }

  #removeMovingBlock() {
    this.#scene.remove(this.movingBlock?.mesh);
    this.#movingBlock = null;
  }

  #createPlacedBlock() {
    this.#placedBlock = new PlacedBlockModel(this);
    this.#scene.add(this.placedBlock.mesh);
  }

  #createFallingBlock(isLastFallingBlock) {
    this.#fallingBlock = new FallingBlockModel({ layer: this, isLastFallingBlock });
    this.#scene.add(this.fallingBlock.mesh);
  }

  get movingBlock() {
    return this.#movingBlock;
  }

  get placedBlock() {
    return this.#placedBlock;
  }

  get fallingBlock() {
    return this.#fallingBlock;
  }

  get overlap() {
    return this.#overlap;
  }

  get axis() {
    return this.#axis;
  }

  get isAxisX() {
    return this.#axis === AXIS.X;
  }

  get isAxisZ() {
    return this.#axis === AXIS.Z;
  }

  get isCuttingBehind() {
    return this.#isCuttingBehind;
  }
}
