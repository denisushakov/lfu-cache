import { LFUVisualizer } from './components/LFUVisualizer';
import { Algorithm } from './components/algorithm/Algorithm';
import { CacheVisualization } from './components/CacheVisualization';
import { OperationHistory } from './components/OperationHistory';
import { Card, CardHeader } from './components/common';
import { useLFUStore } from './store/lfu-store';

function App() {
  const { cache, operationHistory } = useLFUStore();
  const frequencyBuckets = cache.getFrequencyBuckets();
  const hasCacheEntries = Object.keys(frequencyBuckets).length > 0;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex justify-between items-center py-4 mb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">LFU Cache Visualizer</h1>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/denisushakov/lfu-cache-visual"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
            title="GitHub Repository"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <div className="mb-4">
            <Card>
              <CardHeader>Cache Visualization</CardHeader>
              <div className={`${hasCacheEntries ? 'min-h-[200px] max-h-[400px] overflow-y-auto custom-scrollbar' : 'h-[200px]'}`}>
                <CacheVisualization />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LFUVisualizer />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="h-full">
            <Algorithm />
          </Card>
          <div className="md:col-span-1 flex flex-col gap-4">
            <OperationHistory />
          </div>
        </div>

      </main>

      <footer className="mt-2">
        <p className="text-center text-xs">
          Crafted by{" "}
          <a
            href="https://www.linkedin.com/in/denisushakovlive/"
            target="_blank"
            className="relative after:absolute after:border-[2px] after:border-b-0 after:left-0 after:right-0 after:-bottom-1 after:border-blue-800 after:border-dashed"
            rel="noreferrer"
          >
            Denis Ushakov
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;