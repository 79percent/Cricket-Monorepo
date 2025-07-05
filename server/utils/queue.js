/**
 * 队列
 */
class Queue {
  constructor() {
    this.queue = [];
  }

  get value() {
    return this.queue;
  }

  /** 添加 */
  push = (item) => {
    this.queue.push(JSON.stringify(item));
    return this;
  };

  /** 移除所有 */
  removeAll = () => {
    this.queue = [];
    return this;
  };

  /** 移除指定元素 */
  remove = (item) => {
    const index = this.queue.findIndex((a) => a === JSON.stringify(item));
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
    return this;
  };

  /** 是否已存在 */
  find = (item) => {
    const index = this.queue.findIndex((a) => a === JSON.stringify(item));
    if (index !== -1) {
      return JSON.parse(this.queue[index]);
    }
    return null;
  };

  /** 根据name属性判断是否已存在 */
  findByName = (item, names = []) => {
    const index = this.queue.findIndex((a) => {
      const element = JSON.parse(a);
      return names.every(key => item[key] === element[key]);
    });
    if (index !== -1) {
      return JSON.parse(this.queue[index]);
    }
    return null;
  };
}

module.exports = Queue;
