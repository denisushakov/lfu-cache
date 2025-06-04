import React from 'react';
import { useAlgoStore } from '../store/algo-store';
import { Card, CardHeader } from './common';
import { getFrequencyColor } from '../helpers/constants';

export const FrequencyBuckets = () => {
  const { nodeList } = useAlgoStore((state) => ({
    nodeList: state.diagramState.nodeList
  }));
  
  // Group nodes by frequency
  const frequencyBuckets = React.useMemo(() => {
    const buckets: Record<number, {key: number, value: string | number}[]> = {};
    
    // Skip head and tail nodes (index 0 and last)
    for (let i = 1; i < nodeList.length - 1; i++) {
      const node = nodeList[i];
      const freq = node.frequency || 1;
      
      if (!buckets[freq]) {
        buckets[freq] = [];
      }
      
      buckets[freq].push({
        key: node.key,
        value: node.value
      });
    }
    
    return buckets;
  }, [nodeList]);
  
  // Get sorted frequencies
  const frequencies = Object.keys(frequencyBuckets)
    .map(Number)
    .sort((a, b) => a - b);
  

  
  return (
    <Card>
      <CardHeader>Frequency Buckets</CardHeader>
      <div className="p-2 flex-grow flex flex-col">
        {frequencies.length === 0 ? (
          <p className="text-sm text-gray-500">No cache entries yet</p>
        ) : (
          <div className="overflow-y-auto pr-1 custom-scrollbar flex-grow">
            <div className="space-y-4">
              {frequencies.map(freq => (
                <div key={freq} className="border rounded-md overflow-hidden">
                  <div 
                    className="px-2 py-1 text-white text-sm font-medium sticky top-0 z-10"
                    style={{ backgroundColor: getFrequencyColor(freq) }}
                  >
                    Frequency: {freq}
                  </div>
                  <div className="p-2 flex flex-wrap gap-3">
                    {frequencyBuckets[freq].map(node => (
                      <div 
                        key={node.key} 
                        className="px-3 py-1.5 bg-gray-100 rounded text-sm border border-gray-300 shadow-sm"
                      >
                        {node.key}:{node.value}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">
          * Items in each bucket are ordered from most recently used (left) to least recently used (right)
        </p>
      </div>
    </Card>
  );
};