export class Box {
  constructor (cX, cY, cZ, sX, sY, sZ) {
    this.cX = cX
    this.cY = cY
    this.cZ = cZ
    this.sX = sX * 0.5
    this.sY = sY * 0.5
    this.sZ = sZ * 0.5
  }

  contains (x, y, z) {
    const { cX, cY, cZ, sX, sY, sZ } = this
    return Math.abs(x - cX) <= sX &&
      Math.abs(y - cY) <= sY &&
      Math.abs(z - cZ) <= sZ
  }
}
