export class Track extends HTMLMediaElement {
  lastPaused = 0

  constructor (config) {
    super(config.src)
    this.name = config.name
    this.license = config.license
    this.licenseUrl = config.licenseUrl
    this.credits = config.credits
    this.creditsUrl = config.creditsUrl
    this.loop = Media.Loop
  }

  reset () {
    super.pause()
    this.currentTime = 0
    this.volume = 0
  }

  play () {
    if (this.lastPaused + 1e3 > Date.now())
      this.reset()
    super.play()
  }

  setTime (time) {
    this.currentTime = Math.clamp(time, 0, 1) * this.duration
  }

  setVolume (volume) {
    this.volume = Math.clamp(volume, 0, 1)
  }

  pause () {
    super.pause()
    this.lastPaused = Date.now()
  }

  static Tracks = {}

  static Setup (manifest, Zone) {
    if (Track.Tracks)
      for (const track of Object.values(Track.Tracks))
        track.reset()
    Media.Playing = null
    Media.Fading = {}
    Track.Tracks = {}
    for (const zone of Object.values(Zone.Zones.byId))
      for (const key of [ 'peace', 'fight', 'death' ])
        if (Array.isArray(zone[key]))
          for (const id of zone[key])
            Track.Tracks[id] = true
        else if (zone[key])
          Track.Tracks[zone[key]] = true
    for (const id in Track.Tracks)
      Track.Tracks[id] = new Track(manifest[id])
  }
}
