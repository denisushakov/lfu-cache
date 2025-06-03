import React, { useState } from 'react';
import { useLFUStore } from '../store/lfu-store';
import { Card, CardHeader } from './common';
import { getFrequencyColor } from '../helpers/constants';

export const LFUVisualizer = () => {
  const {
    cache,
    put,
    get,
    setCapacity,
    reset,
    lastKey,
    lastResult,
    operationHistory,
    setSelectedOperation
  } = useLFUStore();

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [capacity, setCapacityInput] = useState('3');
  const [activeOperation, setActiveOperation] = useState<'put' | 'get'>('put');

  // Get frequency buckets from cache
  const frequencyBuckets = React.useMemo(() => {
    return cache.getFrequencyBuckets();
  }, [cache, operationHistory]);

  // Get all cache entries for the Map visualization
  const cacheEntries = React.useMemo(() => {
    const entries: Array<{ key: number, value: number, frequency: number }> = [];

    // Collect entries from all frequency buckets
    Object.entries(frequencyBuckets).forEach(([freq, nodes]) => {
      nodes.forEach(node => {
        entries.push({
          key: node.key,
          value: node.value,
          frequency: parseInt(freq)
        });
      });
    });

    return entries;
  }, [frequencyBuckets]);

  const handleOperationChange = (operation: 'put' | 'get') => {
    setActiveOperation(operation);
    // Update the selected operation in the store to update the Algorithm panel
    setSelectedOperation(operation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyNum = parseInt(key);

    if (isNaN(keyNum)) {
      alert('Please enter a valid key');
      return;
    }

    if (activeOperation === 'put') {
      const valueNum = parseInt(value);
      if (isNaN(valueNum)) {
        alert('Please enter a valid value');
        return;
      }
      put(keyNum, valueNum);
    } else {
      get(keyNum);
    }

    setKey('');
    setValue('');
  };

  const handleCapacityChange = () => {
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum < 1) {
      alert('Please enter a valid capacity (minimum 1)');
      return;
    }
    setCapacity(capacityNum);
  };

  const runTestSequence = () => {
    // Clear previous state
    reset();

    // Run a test sequence with a delay between operations
    const sequence = [
      () => { setSelectedOperation('put'); put(1, 1); },
      () => { setSelectedOperation('put'); put(2, 2); },
      () => { setSelectedOperation('get'); get(1); },
      () => { setSelectedOperation('put'); put(3, 3); },
      () => { setSelectedOperation('get'); get(2); },
      () => { setSelectedOperation('put'); put(4, 4); }, // Should evict key 3 (LFU)
      () => { setSelectedOperation('get'); get(1); },
      () => { setSelectedOperation('get'); get(4); },
      () => { setSelectedOperation('put'); put(5, 5); }, // Should evict key 2 (LFU)
    ];

    sequence.forEach((operation, index) => {
      setTimeout(() => {
        operation();
      }, index * 1000);
    });
  };

  return (
    <>
      <Card>
        <CardHeader>Operations</CardHeader>
        <div className="p-1.5 [&_label]:inline-block [&_label]:text-xs [&_label]:text-gray-600 [&_input]:px-1.5 [&_input]:outline-gray-300 [&_input]:outline-offset-3 [&_input]:border [&_input]:w-full [&_input]:rounded [&_select]:outline-gray-300 [&_select]:outline-offset-3">
          <label htmlFor="operation">Select Operation</label>
          <div className="mb-3">
            <select
              value={activeOperation}
              onChange={(e) => handleOperationChange(e.target.value as 'put' | 'get')}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              <option value="put">Put</option>
              <option value="get">Get</option>
            </select>
          </div>

          <label htmlFor="operation">Cache Capacity</label>
          <div className="mb-3">
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacityInput(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={handleCapacityChange}
                className="px-3 py-1 bg-gray-200 rounded-md text-sm"
              >
                Set
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-4">
              {/* Key field */}
              <div className="flex-1">
                <label htmlFor="operation">Key</label>
                <input
                  type="number"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
              {/* Value field (only for 'put') */}
              {activeOperation === 'put' && (
                <div className="flex-1">
                  <label htmlFor="operation">Value</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-1.5 rounded-md text-sm font-medium"
            >
              {activeOperation === 'put' ? 'Put' : 'Get'}
            </button>
          </form>

          <div className="mt-1.5">
            <button
              onClick={runTestSequence}
              className="w-full bg-green-600 text-white py-1.5 rounded-md text-sm font-medium"
            >
              Run Test Sequence
            </button>
          </div>

          {lastResult !== null && (
            <div className="mt-3 p-2 bg-gray-100 rounded-md">
              <p className="text-sm">
                <strong>Get Result:</strong> {lastResult === -1 ? 'Not Found (-1)' : lastResult}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>Cache Map</CardHeader>
        <div className="p-1.5">
          <table className="w-full [&_th]:font-semibold [&_th]:text-sm [&_td]:text-xs [&_th]:border [&_td]:border [&_th]:p-1.5 [&_td]:p-1 [&_td]:text-center">
            <thead>
              <tr>
                <th>&lt;Key, Value&gt;</th>
                <th>Frequency</th>
                <th>Indicator</th>
              </tr>
            </thead>
            <tbody>
              {cacheEntries.length ? (
                cacheEntries.map((item) => (
                  <tr key={item.key} className={lastKey === item.key ? "bg-yellow-50" : ""}>
                    <td>
                      &lt;{item.key}, {item.value}&gt;
                    </td>
                    <td>{item.frequency}</td>
                    <td>
                      <div className="flex items-center justify-center">
                        <span
                          className="inline-block w-4 h-4 rounded-full"
                          style={{ backgroundColor: getFrequencyColor(item.frequency) }}
                          title={`Frequency: ${item.frequency}`}
                        ></span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Cache is empty.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};