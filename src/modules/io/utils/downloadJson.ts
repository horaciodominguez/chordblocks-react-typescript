/** Trigger a browser download of a JSON value. */
export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportFilename(prefix: string): string {
  const stamp = new Date().toISOString().slice(0, 10)
  return `${prefix}-${stamp}.json`
}
