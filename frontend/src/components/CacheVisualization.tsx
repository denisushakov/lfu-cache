import React from 'react';
import { useLFUStore } from '../store/lfu-store';
import { getFrequencyColor } from '../helpers/constants';

export const CacheVisualization = () => {
  const { cache, lastKey, operationHistory } = useLFUStore();
  
  // Get frequency buckets from cache
  const frequencyBuckets = React.useMemo(() => {
    return cache.getFrequencyBuckets();
  }, [cache, operationHistory]);
  
  // Get sorted frequencies
  const frequencies = Object.keys(frequencyBuckets)
    .map(Number)
    .sort((a, b) => a - b);
  
  // Get cache stats for visualization
  const cacheStats = React.useMemo(() => {
    return cache.getCacheStats();
  }, [cache, operationHistory]);
  
  if (frequencies.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">Frequency Buckets</p>
        <p className="text-sm text-gray-400">No cache entries yet</p>
        <p className="text-xs text-gray-400 mt-4">
          * Items in each bucket are ordered from most recently used (left) to least recently used (right)
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col">
      <div className="flex-1 p-4">
        <div className="w-full">
          {/* Frequency buckets visualization */}
          <div className="flex flex-col space-y-6">
            {frequencies.map(freq => (
              <div key={freq} className="relative">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l"
                  style={{ backgroundColor: getFrequencyColor(freq) }}
                ></div>
                
                <div className="ml-3">
                  <div className="text-sm font-medium mb-2 flex items-center">
                    <span className="mr-2">Frequency: {freq}</span>
                    {freq === cacheStats.minFrequency && (
                      <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                        Min Frequency
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {frequencyBuckets[freq].map((node, index) => (
                      <div 
                        key={`${node.key}-${index}`}
                        className={`
                          flex-shrink-0 w-16 h-16 rounded-md border-2 flex flex-col items-center justify-center
                          ${lastKey === node.key ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}
                        `}
                      >
                        <div className="text-lg font-medium">{node.value}</div>
                        <div className="text-xs text-gray-500">key: {node.key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-2 bg-gray-100 text-xs text-center sticky bottom-0">
        Items in each frequency bucket are ordered from most recently used (left) to least recently used (right)
      </div>
    </div>
  );
};