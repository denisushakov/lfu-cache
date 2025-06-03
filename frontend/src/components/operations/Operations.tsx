import { FormEvent, useState } from "react";
import { useAlgoStore } from "../../store/algo-store";
import { TAlgo } from "../../store/algo-store.type";
import { Card, CardHeader } from "../common";

export const Operations = () => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [cacheSize, setCacheSize] = useState("3");
  const [error, setError] = useState("");

  const { activeAlgo, onAlgoChange, onFormSubmit, algoStatus } = useAlgoStore(
    (state) => {
      return {
        activeAlgo: state.operationFormState.activeAlgo,
        onAlgoChange: state.operationFormActions.onAlgoChange,
        onFormSubmit: state.operationFormActions.onFormSubmit,
        algoStatus: state.algoState.status,
      };
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (algoStatus === "running") {
      setError("Please wait for the current operation to complete.");
      return;
    }
    
    if (!key) {
      setError("Key is required");
      return;
    }
    
    if (activeAlgo === "put" && !value) {
      setError("Value is required for PUT operation");
      return;
    }
    
    setError("");
    onFormSubmit(+key, +value);
    setKey("");
    setValue("");
  };

  const handleAlgoChange = (algo: TAlgo) => {
    if (algoStatus === "running") {
      setError("Please wait for the current operation to complete.");
      return;
    }
    onAlgoChange(algo);
  };

  return (
    <Card>
      <CardHeader>Operations</CardHeader>
      <div className="p-2">
        <div className="flex gap-2 mb-3">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeAlgo === "put"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleAlgoChange("put")}
          >
            PUT
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeAlgo === "get"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleAlgoChange("get")}
          >
            GET
          </button>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cache Size
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={cacheSize}
            onChange={(e) => setCacheSize(e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
            disabled={algoStatus === "running"}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              type="number"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              disabled={algoStatus === "running"}
            />
          </div>
          {activeAlgo === "put" && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                disabled={algoStatus === "running"}
              />
            </div>
          )}
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-1.5 rounded-md text-sm font-medium disabled:bg-blue-300"
            disabled={algoStatus === "running"}
          >
            {activeAlgo === "put" ? "Put" : "Get"}
          </button>
        </form>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Test Sequence</h3>
          <div className="flex gap-2 flex-wrap">
            <button 
              className="px-2 py-1 bg-gray-200 text-xs rounded"
              onClick={() => {
                if (algoStatus === "running") {
                  setError("Please wait for the current operation to complete.");
                  return;
                }
                // Example sequence: put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4)
                const runSequence = async () => {
                  onAlgoChange("put");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(1, 1);
                  await new Promise(r => setTimeout(r, 3000));
                  onFormSubmit(2, 2);
                  await new Promise(r => setTimeout(r, 3000));
                  onAlgoChange("get");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(1, 0);
                  await new Promise(r => setTimeout(r, 3000));
                  onAlgoChange("put");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(3, 3);
                  await new Promise(r => setTimeout(r, 3000));
                  onAlgoChange("get");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(2, 0);
                  await new Promise(r => setTimeout(r, 3000));
                  onAlgoChange("put");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(4, 4);
                };
                runSequence();
              }}
            >
              Basic LFU Test
            </button>
            <button 
              className="px-2 py-1 bg-gray-200 text-xs rounded"
              onClick={() => {
                if (algoStatus === "running") {
                  setError("Please wait for the current operation to complete.");
                  return;
                }
                // Example sequence for frequency tie-breaking
                const runSequence = async () => {
                  onAlgoChange("put");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(1, 1);
                  await new Promise(r => setTimeout(r, 3000));
                  onFormSubmit(2, 2);
                  await new Promise(r => setTimeout(r, 3000));
                  onFormSubmit(3, 3);
                  await new Promise(r => setTimeout(r, 3000));
                  onAlgoChange("get");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(1, 0);
                  await new Promise(r => setTimeout(r, 3000));
                  onFormSubmit(2, 0);
                  await new Promise(r => setTimeout(r, 3000));
                  onAlgoChange("put");
                  await new Promise(r => setTimeout(r, 100));
                  onFormSubmit(4, 4); // Should evict 3 (LFU)
                };
                runSequence();
              }}
            >
              Frequency Tie-Break Test
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};