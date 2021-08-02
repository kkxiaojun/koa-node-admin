export default {
  storage: {},
  get(key: string) {
    return this.storage[key]
  },
  set(key: string, sess: string) {
    this.storage[key] = sess
  },
  destroy(key: string) {
    delete this.storage[key]
  },
}
