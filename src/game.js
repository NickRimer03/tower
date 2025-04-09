import * as THREE from "three";
import Stage from "./stage.js";
import Tower from "./tower.js";

export default class Game {
  #canvas = document.getElementById("game");
  #board = document.getElementById("board");
  #restartButton = document.getElementById("restart-button");
  #clock = new THREE.Clock();
  #previousTimer = 0;
  #isGameOver = false;
  #stage;
  #tower;

  constructor() {
    this.#stage = new Stage(this.#canvas);

    this.#tower = new Tower({ stage: this.#stage, onFinish: () => this.#end() });

    this.#init();
  }

  #init() {
    this.#tick();

    this.#canvas.addEventListener("click", () => {
      if (this.#isGameOver) return;

      this.#tower.place();
    });

    this.#restartButton.addEventListener("click", () => this.#restart());
  }

  #tick() {
    const elapsedTime = this.#clock.getElapsedTime();
    const delta = elapsedTime - this.#previousTimer;
    this.#previousTimer = elapsedTime;

    this.#tower.tick(delta);

    this.#stage.renderFrame();

    requestAnimationFrame(() => this.#tick());
  }

  #end() {
    this.#isGameOver = true;
    this.#board.style.display = "flex";
  }

  #restart() {
    this.#stage.camera.resetPosition();
    this.#tower.reset();

    this.#isGameOver = false;
    this.#board.style.display = "none";
  }
}
