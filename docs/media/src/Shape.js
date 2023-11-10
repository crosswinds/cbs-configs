export class Shape {
  constructor (top, bottom, points) {
    this.top = top
    this.bottom = bottom
    this.points = points
  }

  contains (x, y, z) {
    const { top, bottom, points } = this
    if (z < bottom || z > top)
      return false
    let windingNumber = 0
    for (let i = 0, n = points.length; i < n; ++i) {
      const [ ax, ay ] = points[i]
      const [ bx, by ] = points[(i + 1) % n]
      const leftness = (bx - ax) * (y - ay) - (x - ax) * (by - ay)
      if (ay <= y) {
        if (by > y && leftness > 0)
          ++windingNumber
      }
      else if (by <= y && leftness < 0)
        --windingNumber
    }
    return windingNumber !== 0
  }
}
