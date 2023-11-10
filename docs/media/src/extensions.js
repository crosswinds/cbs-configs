Math.clamp = (value, min, max) => {
  if (min > max)
    [min, max] = [max, min]
  Math.max(min, Math.min(max, value))
}
