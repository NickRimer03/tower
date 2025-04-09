import gsap from "gsap";
import * as THREE from "three";

export default class CameraModel {
  #viewDistance = 20;
  #near = 0.1;
  #far = 100;
  #initialPosition = new THREE.Vector3(30, 30, 30);
  #stage;
  #instance;

  constructor(stage) {
    this.#stage = stage;
    this.#instance = new THREE.OrthographicCamera(
      -this.#viewDistance * this.#stage.aspectRatio,
      this.#viewDistance * this.#stage.aspectRatio,
      this.#viewDistance,
      -this.#viewDistance,
      this.#near,
      this.#far,
    );

    this.#init();
  }

  #init() {
    this.instance.position.set(...Object.values(this.#initialPosition));
    this.instance.lookAt(0, 0, 0);

    this.#stage.scene.add(this.instance);
  }

  update() {
    this.instance.left = -this.#viewDistance * this.#stage.aspectRatio;
    this.instance.right = this.#viewDistance * this.#stage.aspectRatio;

    this.instance.updateProjectionMatrix();
  }

  syncPosition({ x, y, z }) {
    gsap.to(this.instance.position, {
      ease: "expo.out",
      duration: 1,
      x: this.#initialPosition.x + x,
      y: this.#initialPosition.y + y,
      z: this.#initialPosition.z + z,
    });
  }

  resetPosition() {
    this.instance.position.set(...Object.values(this.#initialPosition));
  }

  get instance() {
    return this.#instance;
  }
}
