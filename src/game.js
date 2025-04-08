import * as THREE from "three";
import BlockModel from "./block.js";
import { BASE_BLOCK_SIZE, COLOR, MOVING_RANGE, SPEED_FACTOR } from "./const.js";
import Stage from "./stage.js";

export default class Game {
  #canvas = document.getElementById("game");
  #clock = new THREE.Clock();
  #previousTimer = 0;
  #blockDirection = 1;
  #stage;
  #baseBlock;
  #movingBlock;

  constructor() {
    this.#stage = new Stage(this.#canvas);

    this.#baseBlock = new BlockModel({ ...BASE_BLOCK_SIZE, color: COLOR.baseBlock });
    this.#movingBlock = new BlockModel({
      ...BASE_BLOCK_SIZE,
      initPosition: new THREE.Vector3(-10, 3, 0),
      color: COLOR.movingBlock,
    });

    this.#init();
  }

  #init() {
    this.#stage.scene.add(this.#baseBlock.mesh);
    this.#stage.scene.add(this.#movingBlock.mesh);

    this.#tick();
  }

  #reverseDirection() {
    this.#blockDirection *= -1;
  }

  #tick() {
    const elapsedTime = this.#clock.getElapsedTime();
    const delta = elapsedTime - this.#previousTimer;
    this.#previousTimer = elapsedTime;

    if (this.#movingBlock.mesh.position.x > MOVING_RANGE) {
      this.#movingBlock.mesh.position.x = MOVING_RANGE;
      this.#reverseDirection();
    }
    if (this.#movingBlock.mesh.position.x < -MOVING_RANGE) {
      this.#movingBlock.mesh.position.x = -MOVING_RANGE;
      this.#reverseDirection();
    }

    this.#movingBlock.mesh.position.x += delta * SPEED_FACTOR * this.#blockDirection;

    this.#stage.renderFrame();

    requestAnimationFrame(() => this.#tick());
  }
}
