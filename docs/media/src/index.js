import './extensions.js'
import { Track } from './Track.js'
import { Zone } from './Zone.js'

await fetch('zones.json')
  .then(response => response.json())
  .then(manifest => Zone.Setup(manifest))
  .then(() => fetch('tracks.json'))
  .then(response => response.json())
  .then(manifest => Track.Setup(manifest, Zone))
  .catch(console.error)

let playing
const fading = {}

let volume = Math.clamp(Number.parseFloat(localStorage.getItem('volume') ?? 0.5), 0, 1)
document.querySelector('[volume]').addEventListener('click', event => {
  const { target, clientX } = event
  const { x, width } = target.getBoundingClientRect()
  volume = Math.clamp((clientX - x) / width, 0, 1)
  localStorage.setItem('volume', volume)
  target.value = volume * 100
  console.log('update volume', volume)
})

let loop = localStorage.getItem('loop') === 'true'
document.querySelector('[loop]').addEventListener('click', event => {
  localStorage.setItem('loop', loop = !loop)
  playing?.loop = loop
  console.log('toggle loop', loop)
})

let pause = localStorage.getItem('pause') === 'true'
document.querySelector('[pause]').addEventListener('click', event => {
  localStorage.setItem('pause', pause = !pause)
  if (pause) {
    playing?.pause()
    for (const id in fading) {
      fading[id].pause()
      delete fading[id]
    }
  }
  playing?.play()
  console.log('toggle pause', pause)
})

let credits = localStorage.getItem('credits') === 'true'
document.querySelector('[credits]').addEventListener('click', event => {
  localStorage.setItem('credits', credits = !credits)
  console.log('toggle credits', credits)
})

document.querySelector('[track]').addEventListener('click', event => {
  const { target, clientX } = event
  const { x, width } = target.getBoundingClientRect()
  playing?.setTime(Math.clamp((clientX - x) / width, 0, 1))
  console.log('update time', playing?.currentTime)
})

document.querySelector('[reload]').addEventListener('click', () => location.reload())

window.addEventListener('hashchange', () => {
  console.log('hash changed')
    try {
      const hash = decodeURIComponent(location.hash.slice(1))
      if (hash[0] !== '{')
        return
      console.log(hash)
      const { x, y, z, state, region } = JSON.parse(hash)
      Media.Zone = Zone.Get(x, y, z, region)
      if (!Media.Zone)
        Media.Zone = Zone.Default
      let track = Media.Zone[state] ?? Zone.Default[state]
      if (!track)
        return
      if (Array.isArray(track))
        track = track[0] // TODO: re-add cycling for multiple tracks
      track = Track.Tracks[track]
      if (Media.Playing === track)
        return
      if (Media.Playing)
        Media.Fading[Media.Playing] = true
      Media.Playing = track
    }
    catch (error) {
      console.error(error)
    }
})

updateCredits () {
  const info = document.querySelector('[info]')
  if (!playing)
    info.textContent = '- - -'
  else if (credits)
    info.textContent = `${playing.credits} - ${playing.license}`
  else
    info.textContent = `${zone.name} - ${state}`
  console.log('update credits', credits)
}

setInterval(() => {
  if (pause)
    return
  if (playing) {
    if (!playing.playing)
      playing.play()
    playing.volume = Math.clamp(playing.volume + 0.05, 0, Media.Volume)
  }
  for (const track in fading) {
    const volume = Math.clamp(track.volume - 0.05, 0, 1)
    if (volume === 0) {
      delete fading[track]
      track.pause()
    }
    else
      track.volume = volume
  }
}, 1e2)
