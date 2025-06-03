import React from 'react';
import { Card, CardHeader } from './common';
import { COLORS } from '../helpers/constants';

export const FrequencyLegend = () => {
  return (
    <Card>
      <CardHeader>LFU Cache Explanation</CardHeader>
      <div className="p-3 text-sm">
        <p className="mb-3">
          The <strong>Least Frequently Used (LFU)</strong> cache eviction policy tracks how many times each item is accessed.
          When the cache is full, it removes the item that has been used least frequently.
        </p>
        
        <div className="flex flex-col space-y-2 mb-3">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: COLORS.FREQUENCY_LOW }}></div>
            <span>Low frequency (1-2 accesses)</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: COLORS.FREQUENCY_MEDIUM }}></div>
            <span>Medium frequency (3-5 accesses)</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: COLORS.FREQUENCY_HIGH }}></div>
            <span>High frequency (6+ accesses)</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mt-2">
          <strong>Note:</strong> When multiple items have the same frequency, LFU uses LRU (Least Recently Used) as a tie-breaker.
        </p>
      </div>
    </Card>
  );
};