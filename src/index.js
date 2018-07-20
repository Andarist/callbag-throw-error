export default function throwError(error) {
  return (start, sink) => {
    if (start !== 0) return

    let disposed = false

    sink(0, end => {
      if (end !== 2) return
      disposed = true
    })

    if (disposed) return

    sink(2, error || new Error())
  }
}
