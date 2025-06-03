import { create } from 'zustand';
import { LFUCache } from './lfu-cache';

type LFUOperation = 'put' | 'get' | 'none';

interface LFUState {
  cache: LFUCache;
  capacity: number;
  currentOperation: LFUOperation;
  selectedOperation: LFUOperation; // New field to track selected operation
  lastKey: number | null;
  lastValue: number | null;
  lastResult: number | null;
  operationHistory: {
    operation: LFUOperation;
    key: number;
    value?: number;
    result?: number;
    keyExisted?: boolean;    // Whether key existed before operation
    wasAtCapacity?: boolean; // Whether cache was at capacity before operation
  }[];
  
  // Actions
  setCapacity: (capacity: number) => void;
  put: (key: number, value: number) => void;
  get: (key: number) => void;
  reset: () => void;
  setSelectedOperation: (operation: 'put' | 'get') => void; // New action
}

export const useLFUStore = create<LFUState>((set, get) => ({
  cache: new LFUCache(3), // Default capacity
  capacity: 3,
  currentOperation: 'none',
  selectedOperation: 'put', // Default selected operation
  lastKey: null,
  lastValue: null,
  lastResult: null,
  operationHistory: [],
  
  setCapacity: (capacity) => {
    set((state) => {
      // Create a new cache with the new capacity
      const newCache = new LFUCache(capacity);
      return {
        ...state,
        cache: newCache,
        capacity,
        operationHistory: [],
        currentOperation: 'none',
        lastKey: null,
        lastValue: null,
        lastResult: null
      };
    });
  },
  
  put: (key, value) => {
    set((state) => {
      // Check if key exists BEFORE performing the operation
      const keyExistsBeforeOperation = state.cache.cache.has(key);
      const atCapacityBeforeOperation = state.cache.size >= state.capacity && !keyExistsBeforeOperation;
      
      // Perform the operation
      state.cache.put(key, value);
      
      return {
        ...state,
        currentOperation: 'put',
        lastKey: key,
        lastValue: value,
        lastResult: null,
        // Store the pre-operation state for correct algorithm visualization
        operationHistory: [
          ...state.operationHistory,
          { 
            operation: 'put', 
            key, 
            value,
            keyExisted: keyExistsBeforeOperation,
            wasAtCapacity: atCapacityBeforeOperation
          }
        ]
      };
    });
  },
  
  get: (key) => {
    set((state) => {
      const result = state.cache.get(key);
      return {
        ...state,
        currentOperation: 'get',
        lastKey: key,
        lastValue: null,
        lastResult: result,
        operationHistory: [
          ...state.operationHistory,
          { operation: 'get', key, result }
        ]
      };
    });
  },
  
  reset: () => {
    set((state) => {
      return {
        ...state,
        cache: new LFUCache(state.capacity),
        currentOperation: 'none',
        lastKey: null,
        lastValue: null,
        lastResult: null,
        operationHistory: []
      };
    });
  },
  
  // New action to update selected operation
  setSelectedOperation: (operation) => {
    set({ selectedOperation: operation });
  }
}));