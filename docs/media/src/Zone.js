import { Shape } from './Shape.js'
import { Box } from './Box.js'

export class Zone {
  

  constructor (config) {
    this.priority = config.priority
    for (const [ key, type ] of [ ['box', Box], ['shape', Shape] ])
      if (Array.isArray(config[key]))
        this[key] = config[key].map(entry => new type(entry))
      else if (config[key])
        this[key] = [ new type(config[key]) ]
    for (const key of [ 'peace', 'fight', 'death' ])
      this[key] = config[key]
  }

  contains (x, y, z) {
    for (const shape of this.shape ?? [])
      if (shape.contains(x, y, z))
        return true
    for (const box of this.box ?? [])
      if (box.contains(x, y, z))
        return true
  }

  static Zones
  static Default

  static Get (xOrId, y, z, region) {
    if (typeof xOrId === 'string')
      return Zone.Zones?.byId[xOrId]
    for (const zone of Zone.Zones?.[region]?.byPriority)
      if (zone.contains(xOrId, y, z))
        return zone
  }

  static async Setup () {
    const response = await fetch('zones.json')
    const manifest = await response.json()
    Zone.Zones = { byId: {} }
    for (const region in manifest) {
      Zone.Zones[region] = { byId: {}, byPriority: [] }
      for (const [ id, config ] of Object.entries(manifest[region])) {
        const instance = new Zone(config)
        Zone.Zones[region].byId[id] = instance
        Zone.Zones[region].byPriority.push(instance)
        Zone.Zones.byId[id] = instance
      }
      Zone.Zones[region].byPriority.sort((a, b) => a.priority - b.priority)
    }
    Zone.Default = Zone.Get('default')
  }
}
