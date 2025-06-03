// LFU Cache implementation with frequency buckets

// Node in the frequency list
export type LFUNode = {
  key: number;
  value: number;
  frequency: number;
  prev: LFUNode | null;
  next: LFUNode | null;
};

// Doubly linked list for a specific frequency
export class FrequencyList {
  head: LFUNode;
  tail: LFUNode;
  size: number;

  constructor() {
    // Create dummy head and tail nodes
    this.head = { key: -1, value: -1, frequency: -1, prev: null, next: null };
    this.tail = { key: -1, value: -1, frequency: -1, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }

  // Add node to front (most recently used position)
  addNode(node: LFUNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
    this.size++;
  }

  // Remove a node from the list
  removeNode(node: LFUNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    this.size--;
  }

  // Remove and return the least recently used node (from tail)
  removeTail(): LFUNode | null {
    if (this.size === 0) return null;
    
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }
}

// LFU Cache implementation
export class LFUCache {
  capacity: number;
  size: number;
  minFrequency: number;
  cache: Map<number, LFUNode>; // Key-Value Map: O(1) lookup time
  frequencies: Map<number, FrequencyList>; // Frequency Map: Groups by access count

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.minFrequency = 0;
    this.cache = new Map();
    this.frequencies = new Map();
  }

  // Get a frequency list or create if it doesn't exist
  private getFrequencyList(frequency: number): FrequencyList {
    if (!this.frequencies.has(frequency)) {
      this.frequencies.set(frequency, new FrequencyList());
    }
    return this.frequencies.get(frequency)!;
  }

  // Update node frequency when accessed
  private updateFrequency(node: LFUNode): void {
    // Remove from current frequency list
    const oldFreq = node.frequency;
    const currentList = this.frequencies.get(oldFreq)!;
    currentList.removeNode(node);
    
    // Update min frequency if needed
    if (oldFreq === this.minFrequency && currentList.size === 0) {
      this.minFrequency++;
    }
    
    // Add to new frequency list
    node.frequency++;
    const newList = this.getFrequencyList(node.frequency);
    newList.addNode(node);
  }

  // Get value for a key
  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    
    const node = this.cache.get(key)!;
    this.updateFrequency(node);
    return node.value;
  }

  // Put key-value pair in cache
  put(key: number, value: number): void {
    // Edge case: zero capacity
    if (this.capacity === 0) return;
    
    // If key exists, update value and frequency
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = value;
      this.updateFrequency(node);
      return;
    }
    
    // If at capacity, evict least frequently used
    if (this.size === this.capacity) {
      const minFreqList = this.frequencies.get(this.minFrequency)!;
      const nodeToRemove = minFreqList.removeTail()!;
      this.cache.delete(nodeToRemove.key);
      this.size--;
    }
    
    // Add new node with frequency 1
    this.minFrequency = 1;
    const newNode: LFUNode = {
      key,
      value,
      frequency: 1,
      prev: null,
      next: null
    };
    
    // Add to cache and frequency list
    this.cache.set(key, newNode);
    const freqList = this.getFrequencyList(1);
    freqList.addNode(newNode);
    this.size++;
  }

  // Get all nodes grouped by frequency
  getFrequencyBuckets(): Record<number, {key: number, value: number}[]> {
    const result: Record<number, {key: number, value: number}[]> = {};
    
    this.frequencies.forEach((list, frequency) => {
      if (list.size > 0) {
        result[frequency] = [];
        
        // Traverse the list from most to least recently used
        let current = list.head.next;
        while (current !== list.tail) {
          result[frequency].push({
            key: current!.key,
            value: current!.value
          });
          current = current!.next;
        }
      }
    });
    
    return result;
  }
  
  // Get cache statistics for UI display
  getCacheStats() {
    return {
      capacity: this.capacity,
      size: this.size,
      minFrequency: this.minFrequency,
      keyValueMapSize: this.cache.size,
      frequencyMapSize: this.frequencies.size,
      frequencyDistribution: Array.from(this.frequencies.entries())
        .map(([freq, list]) => ({ frequency: freq, count: list.size }))
    };
  }
}