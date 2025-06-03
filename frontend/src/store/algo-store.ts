import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TAlgoStoreState, TAlgoStoreApi } from "./algo-store.type";
import { getNodeAddress } from "./helper";
import { SVG_CONSTANTS as C, CACHE_SIZE } from "../helpers/constants";
import {
  DIAGRAM_OPERATIONS,
  TSvgNodeItem,
} from "../components/svg-diagram/svg-diagram.type";

export const useAlgoStore = create(
  devtools<TAlgoStoreState & TAlgoStoreApi>(
    (set) => ({
      operationFormState: {
        activeAlgo: "put",
      },
      algoState: {
        activeStep: 0,
        allowStepMove: false,
        status: "not-running",
      },
      mapState: {
        map: new Map(),
      },
      diagramState: {
        diagramOperation: null,
        key: null,
        value: null,
        address: null,
        lastNodeKey: null,
        showArrows: true,
        nodeList: [
          {
            id: crypto.randomUUID(),
            isHeadNode: true,
            key: 0,
            value: "H",
            address: "H",
            x: 70,
          },
          {
            id: crypto.randomUUID(),
            isTailNode: true,
            key: 0,
            value: "E",
            address: "E",
            x: 190,
          },
        ],
      },
      algoActions: {
        changeStep(step) {
          set((state) => {
            return {
              ...state,
              algoState: {
                ...state.algoState,
                activeStep: step,
                status: step === 0 ? "completed" : state.algoState.status,
              },
            };
          });
        },
        changeAlgoState(mode) {
          set((state) => {
            return {
              ...state,
              algoState: {
                ...state.algoState,
                status: mode,
              },
            };
          });
        },
      },
      operationFormActions: {
        onAlgoChange(algo) {
          set((state) => {
            return {
              ...state,
              operationFormState: {
                ...state.operationFormState,
                activeAlgo: algo,
              },
            };
          });
        },
        onFormSubmit(key, value) {
          set((state) => {
            const existingNode = state.mapState.map.get(key);
            if (state.operationFormState.activeAlgo === "put") {
              return {
                ...state,
                algoState: {
                  ...state.algoState,
                  activeStep: 1,
                  status: "running",
                },
                diagramState: {
                  ...state.diagramState,
                  key,
                  value,
                  address: getNodeAddress(),
                },
              };
            } else {
              return {
                ...state,
                algoState: {
                  ...state.algoState,
                  activeStep: 1,
                  status: "running",
                },
                diagramState: {
                  ...state.diagramState,
                  key,
                  value: existingNode?.value ? +existingNode.value : null,
                  moveNodeMeta: {
                    targetIndex: state.diagramState.nodeList.findIndex(
                      (node) => node.key === key
                    ),
                  },
                  address: getNodeAddress(),
                },
              };
            }
          });
        },
      },
      mapActions: {
        updateMap() {
          set((state) => {
            // prettier-ignore
            const { key, value, address, lastNodeKey, diagramOperation } = state.diagramState;
            const mapClone = structuredClone(state.mapState.map);
            const existingItem = mapClone.get(key!);
            switch (diagramOperation) {
              case DIAGRAM_OPERATIONS.REMOVE: {
                if (mapClone.size >= CACHE_SIZE) {
                  mapClone.delete(lastNodeKey!);
                  return {
                    ...state,
                    mapState: {
                      ...state.mapState,
                      map: mapClone,
                    },
                  };
                }
                break;
              }
              case DIAGRAM_OPERATIONS.UPDATE_VALUE: {
                if (existingItem) {
                  // Find the node to get its current frequency
                  const nodeIndex = state.diagramState.nodeList.findIndex(
                    (node) => node.key === key
                  );
                  const frequency = nodeIndex > -1 ? 
                    (state.diagramState.nodeList[nodeIndex].frequency || 0) + 1 : 1;
                  
                  mapClone.set(key!, {
                    value: +value!,
                    address: address!,
                    frequency: frequency, // Include frequency in the map
                  });
                  return {
                    ...state,
                    mapState: {
                      ...state.mapState,
                      map: mapClone,
                    },
                  };
                }
                break;
              }
              default: {
                mapClone.set(key!, {
                  value: +value!,
                  address: address!,
                  frequency: 1, // Initialize frequency to 1 for new entries
                });
                return {
                  ...state,
                  diagramState: {
                    ...state.diagramState,
                    value,
                  },
                  mapState: {
                    ...state.mapState,
                    map: mapClone,
                  },
                };
              }
            }
            return state;
          });
        },
      },
      diagramActions: {
        setDiagramOperation(operation) {
          set((state) => {
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                diagramOperation: operation,
              },
            };
          });
        },
        updateNodesX() {
          set((state) => {
            for (
              let index = 1;
              index < state.diagramState.nodeList.length;
              index++
            ) {
              state.diagramState.nodeList[index].x =
                state.diagramState.nodeList[index - 1].x +
                C.RECTANGLE_SIZE +
                C.ARROW_WIDTH;
            }
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                nodeList: [...state.diagramState.nodeList],
              },
            };
          });
        },
        addNewNode() {
          set((state) => {
            const { key, value, address } = state.diagramState;
            const node: TSvgNodeItem = {
              id: crypto.randomUUID(),
              x: 0,
              key: key!,
              value: value!,
              address: address!,
              frequency: 1, // Initialize frequency to 1 for new nodes
            };
            state.diagramState.nodeList = [
              state.diagramState.nodeList[0],
              node,
              ...state.diagramState.nodeList.slice(1),
            ];
            state.diagramActions.updateNodesX();
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                nodeList: [...state.diagramState.nodeList],
              },
            };
          });
        },
        removeNodeBeforeEnd() {
          set((state) => {
            // Find the node with the lowest frequency (LFU)
            let minFreq = Infinity;
            let lfuNodeIndex = -1;
            
            // Skip head and tail nodes (index 0 and last)
            for (let i = 1; i < state.diagramState.nodeList.length - 1; i++) {
              const node = state.diagramState.nodeList[i];
              const freq = node.frequency || 0;
              
              if (freq < minFreq) {
                minFreq = freq;
                lfuNodeIndex = i;
              }
            }
            
            // If no valid node found, use the second-to-last node (original behavior)
            if (lfuNodeIndex === -1) {
              lfuNodeIndex = state.diagramState.nodeList.length - 2;
            }
            
            const lastNodeKey = state.diagramState.nodeList[lfuNodeIndex].key;
            state.diagramState.nodeList.splice(lfuNodeIndex, 1);
            state.diagramActions.updateNodesX();
            
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                lastNodeKey,
                nodeList: [...state.diagramState.nodeList],
              },
            };
          });
        },
        removeTargetNode() {
          set((state) => {
            const { key, address } = state.diagramState;
            const targetNodeIndex = state.diagramState.nodeList.findIndex(
              (node) => +node.key === key
            );
            const nodeToSwap = state.diagramState.nodeList[targetNodeIndex];
            state.diagramState.nodeList.splice(targetNodeIndex, 1);
            state.diagramActions.updateNodesX();
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                address: address!,
                key: nodeToSwap.key,
                value: nodeToSwap.value,
                nodeList: [...state.diagramState.nodeList],
              },
            };
          });
        },
        updateValue() {
          set((state) => {
            const { key, value } = state.diagramState;
            const nodeIndex = state.diagramState.nodeList.findIndex(
              (node) => node.key === key
            );
            if (nodeIndex > -1) {
              state.diagramState.nodeList[nodeIndex].value = +value!;
              // Increment frequency for LFU cache
              const currentFreq = state.diagramState.nodeList[nodeIndex].frequency || 0;
              state.diagramState.nodeList[nodeIndex].frequency = currentFreq + 1;
            }
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                moveNodeMeta: {
                  targetIndex: nodeIndex,
                },
                nodeList: [...state.diagramState.nodeList],
              },
            };
          });
        },
        incrementFrequency(key) {
          set((state) => {
            const nodeIndex = state.diagramState.nodeList.findIndex(
              (node) => node.key === key
            );
            if (nodeIndex > -1) {
              const currentFreq = state.diagramState.nodeList[nodeIndex].frequency || 0;
              state.diagramState.nodeList[nodeIndex].frequency = currentFreq + 1;
            }
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                nodeList: [...state.diagramState.nodeList],
              },
            };
          });
        },
        setArrowState(flag) {
          set((state) => {
            return {
              ...state,
              diagramState: {
                ...state.diagramState,
                showArrows: flag,
              },
            };
          });
        },
      },
    }),
    { enabled: import.meta.env.DEV ? true : false }
  )
);
