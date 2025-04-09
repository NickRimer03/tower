import * as THREE from "three";
import { COLOR } from "./const.js";
import CameraModel from "./models/camera.js";

export default class Stage {
  #sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  #scene = new THREE.Scene();
  #camera = new CameraModel(this);
  #renderer;

  #ambientLight = new THREE.AmbientLight("white", 2);
  #directionalLight = new THREE.DirectionalLight();

  constructor(canvas) {
    this.#renderer = new THREE.WebGLRenderer({ canvas });

    this.#init();
  }

  #init() {
    this.scene.background = new THREE.Color(COLOR.background);
    this.#directionalLight.position.set(10, 18, 6);

    this.scene.add(this.#ambientLight, this.#directionalLight);
    this.scene.add(
      new THREE.AxesHelper(20),
      new THREE.DirectionalLightHelper(this.#directionalLight),
    );

    this.#updateRenderer();

    window.addEventListener("resize", this.#onResize.bind(this));
  }

  #updateRenderer() {
    this.#renderer.setSize(this.width, this.height);
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  #onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.update();

    this.#updateRenderer();
  }

  renderFrame() {
    this.#renderer.render(this.scene, this.camera.instance);
  }

  destroy() {
    window.removeEventListener("resize", () => {});
  }

  get width() {
    return this.#sizes.width;
  }

  get height() {
    return this.#sizes.height;
  }

  get scene() {
    return this.#scene;
  }

  get camera() {
    return this.#camera;
  }

  get aspectRatio() {
    return this.width / this.height;
  }

  set width(width) {
    this.#sizes.width = width;
  }

  set height(height) {
    this.#sizes.height = height;
  }
}
