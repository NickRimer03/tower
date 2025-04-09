import { AXIS, BASE_BLOCK_SIZE, COLOR, MOVING_RANGE, SPEED_FACTOR } from "./const.js";
import BlockModel from "./models/block/block.js";
import LayerModel from "./models/layer.js";

export default class Tower {
  #layers = [];
  #direction = 1;
  #baseBlock = new BlockModel({ ...BASE_BLOCK_SIZE, color: COLOR.baseBlock });
  #stage;
  #finish;

  constructor({ stage, onFinish }) {
    this.#stage = stage;
    this.#finish = onFinish;

    this.#init();
  }

  tick(delta) {
    for (const layer of this.#layers) {
      layer.fallingBlock?.tick(delta);
    }

    if (!this.activeLayer.movingBlock) return;

    const activeAxisPosition = this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis];

    if (activeAxisPosition > MOVING_RANGE) {
      this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis] = MOVING_RANGE;
      this.#reverseDirection();
    }
    if (activeAxisPosition < -MOVING_RANGE) {
      this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis] = -MOVING_RANGE;
      this.#reverseDirection();
    }

    this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis] +=
      delta * SPEED_FACTOR * this.#direction;
  }

  place() {
    this.activeLayer.cut(this.lastPlacedBlock) ? this.#addLayer() : this.#finish();
  }

  reset() {
    this.#direction = 1;

    for (const layer of this.#layers) {
      layer.clear();
    }

    this.#layers = [];
    this.#addFirstLayer();
  }

  #init() {
    this.#stage.scene.add(this.#baseBlock.mesh);
    this.#addFirstLayer();
  }

  #addFirstLayer() {
    this.#layers.push(
      new LayerModel({
        scene: this.#stage.scene,
        width: BASE_BLOCK_SIZE.width,
        depth: BASE_BLOCK_SIZE.depth,
        y: BASE_BLOCK_SIZE.height,
      }),
    );
  }

  #addLayer() {
    this.#layers.push(
      new LayerModel({
        scene: this.#stage.scene,
        axis: this.activeLayer.isAxisX ? AXIS.Z : AXIS.X,
        width: this.activeLayer.placedBlock.width,
        depth: this.activeLayer.placedBlock.depth,
        x: this.activeLayer.placedBlock.mesh.position.x,
        y: (this.activeLayerIndex + 2) * BASE_BLOCK_SIZE.height,
        z: this.activeLayer.placedBlock.mesh.position.z,
      }),
    );

    this.#stage.camera.syncPosition(this.lastPlacedBlock.mesh.position);
  }

  #reverseDirection() {
    this.#direction *= -1;
  }

  get activeLayerIndex() {
    return this.#layers.length - 1;
  }

  get activeLayer() {
    return this.#layers[this.activeLayerIndex];
  }

  get previousLayer() {
    return this.#layers[this.activeLayerIndex - 1];
  }

  get lastPlacedBlock() {
    return this.previousLayer?.placedBlock ?? this.#baseBlock;
  }
}
