import React from 'react';
import { useLFUStore } from '../store/lfu-store';
import { Card, CardHeader } from './common';

export const OperationHistory = () => {
  const { operationHistory } = useLFUStore();
  
  return (
    <Card>
      <CardHeader>Operation History</CardHeader>
      <div className="p-3 max-h-60 overflow-auto">
        {operationHistory.length === 0 ? (
          <p className="text-sm text-gray-500">No operations yet</p>
        ) : (
          <div className="space-y-1">
            {operationHistory.map((op, index) => (
              <div key={index} className="text-sm border-b pb-1">
                {op.operation === 'put' ? (
                  <span>
                    <span className="font-medium text-blue-600">PUT</span> ({op.key}, {op.value})
                  </span>
                ) : (
                  <span>
                    <span className="font-medium text-green-600">GET</span> ({op.key}) → {op.result === -1 ? 'Not Found (-1)' : op.result}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};