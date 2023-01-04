class QueueService {
  constructor() {
    this.queue = [];
  }

  /**
   * Add item to the back of the queue
   * @param {*} item
   */
  enqueue(item) {
    this.queue.push(item);
  }

  /**
   * Removes and returns the first item in queue
   * @returns First item in queue
   */
  dequeue() {
    if (this.queue.length <= 0) return;
    return this.queue.shift();
  }

  /**
   * Returns first item without removing it
   * @returns
   */
  peek() {
    if (this.queue.length <= 0) return;
    return this.queue[0];
  }

  empty() {
    return !!this.queue.length;
  }

  toString() {
    return JSON.stringify({ queue: this.queue });
  }
}

module.exports = QueueService;
