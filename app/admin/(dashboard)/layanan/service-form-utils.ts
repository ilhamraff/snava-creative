export function genId(prefix = 'item') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
}

export function moveItem<T>(list: T[], index: number, direction: 'up' | 'down'): T[] {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= list.length) return list
  const copy = [...list]
  const [removed] = copy.splice(index, 1)
  copy.splice(targetIndex, 0, removed)
  return copy
}

