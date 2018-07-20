const noop = () => {}

export default function throwError(error) {
  return (start, sink) => {
    if (start !== 0) return
    sink(0, noop)
    sink(2, error || new Error())
  }
}
