import * as THREE from "three";
import { COLOR, FALL_SPEED_FACTOR } from "../../const.js";
import BlockModel from "./block.js";

function getLastBlockProps(layer) {
  return {
    width: layer.movingBlock.width,
    depth: layer.movingBlock.depth,
    initPosition: layer.movingBlock.mesh.position,
  };
}

function calcFallingPosition(layer, axisPosition) {
  const shift = axisPosition + layer.overlap / 2;

  return layer.isCuttingBehind ? shift - layer.overlap : shift;
}

function getFallingBlockProps(layer) {
  const x = layer.isAxisX
    ? calcFallingPosition(layer, layer.movingBlock.mesh.position.x)
    : layer.movingBlock.mesh.position.x;
  const z = layer.isAxisZ
    ? calcFallingPosition(layer, layer.movingBlock.mesh.position.z)
    : layer.movingBlock.mesh.position.z;

  return {
    width: layer.isAxisX ? layer.movingBlock.width - layer.overlap : layer.movingBlock.width,
    depth: layer.isAxisZ ? layer.movingBlock.depth - layer.overlap : layer.movingBlock.depth,
    initPosition: new THREE.Vector3(x, layer.movingBlock.mesh.position.y, z),
    color: COLOR.fallingBlock,
  };
}

export default class FallingBlockModel extends BlockModel {
  constructor({ layer, isLastFallingBlock }) {
    const props = isLastFallingBlock ? getLastBlockProps(layer) : getFallingBlockProps(layer);

    super(props);
  }

  tick(delta) {
    this.mesh.position.y -= FALL_SPEED_FACTOR * delta;
  }
}
