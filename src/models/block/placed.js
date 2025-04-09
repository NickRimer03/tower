import * as THREE from "three";
import { COLOR } from "../../const.js";
import BlockModel from "./block.js";

function calcPlacedBlockShift(sideSize, layer) {
  const shift = (sideSize - layer.overlap) / 2;
  const sign = layer.isCuttingBehind ? 1 : -1;

  return sign * shift;
}

function calcPlacedBlockProps(layer) {
  const width = layer.isAxisX ? layer.overlap : layer.movingBlock.width;
  const depth = layer.isAxisZ ? layer.overlap : layer.movingBlock.depth;

  const x = layer.isAxisX
    ? layer.movingBlock.mesh.position.x + calcPlacedBlockShift(layer.movingBlock.width, layer)
    : layer.movingBlock.mesh.position.x;
  const z = layer.isAxisZ
    ? layer.movingBlock.mesh.position.z + calcPlacedBlockShift(layer.movingBlock.depth, layer)
    : layer.movingBlock.mesh.position.z;

  return {
    width,
    depth,
    initPosition: new THREE.Vector3(x, layer.movingBlock.mesh.position.y, z),
    color: COLOR.placedBlock,
  };
}

export default class PlacedBlockModel extends BlockModel {
  constructor(layer) {
    const props = calcPlacedBlockProps(layer);

    super(props);
  }
}
