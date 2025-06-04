import React from 'react';
import { Card, CardHeader } from './common';

export const FrequencyBucketExplanation = () => {
  return (
    <Card>
      <CardHeader>How LFU Cache Works</CardHeader>
      <div className="p-3 text-sm">
        <p className="mb-2">
          The <strong>Least Frequently Used (LFU)</strong> cache eviction policy tracks how many times each item is accessed.
          When the cache is full, it removes the item that has been used least frequently.
        </p>
        
        <h3 className="font-medium mt-3 mb-1">Key Components:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Frequency Buckets:</strong> Items with the same access count are grouped together</li>
          <li><strong>LFU Ordering:</strong> Within each frequency bucket, items are ordered by recency</li>
          <li><strong>Min Frequency Tracking:</strong> The cache keeps track of the minimum frequency for quick eviction</li>
        </ul>
        
        <h3 className="font-medium mt-3 mb-1">Operations:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Get(key):</strong> Retrieve item, increment its frequency, and move it to the next frequency bucket
          </li>
          <li>
            <strong>Put(key, value):</strong> If key exists, update value and increment frequency. If not, add new item with frequency=1
          </li>
          <li>
            <strong>Eviction:</strong> When cache is full, remove the least recently used item from the minimum frequency bucket
          </li>
        </ul>
        
        <div className="mt-3 p-2 bg-gray-100 rounded-md">
          <p className="text-xs">
            <strong>Note:</strong> LFU provides better hit rates for many workloads compared to LRU, especially for items with stable popularity,
            but requires more complex implementation and can suffer from "frequency pollution" where old, no-longer-used items with high frequency counts remain in cache.
          </p>
        </div>
      </div>
    </Card>
  );
};