import { TAlgoStep } from "./algorithm.type";

export const getAlgo: TAlgoStep[] = [
  {
    id: 1,
    text: "Is `key` present in the map?",
    isStepDecisionMaker: true,
    subSteps: [
      { id: 1.11, text: "Increment frequency counter", isStepDecisionMaker: false },
      { id: 1.12, text: "Move node to the next frequency bucket", isStepDecisionMaker: false },
      { id: 1.13, text: "If this frequency bucket was the minimum and is now empty, update min frequency", isStepDecisionMaker: false },
      { id: 1.14, text: "Return the node's value", isStepDecisionMaker: false },
    ],
  },
  {
    id: 2,
    text: "Else",
    isStepDecisionMaker: false,
    subSteps: [
      { id: 2.21, text: "Return -1 (cache miss)", isStepDecisionMaker: false }
    ],
  },
];

export const putAlgo: TAlgoStep[] = [
  {
    id: 1,
    text: "Is `key` present in the cache?",
    isStepDecisionMaker: true,
    subSteps: [
      { id: 1.11, text: "Update the node's value", isStepDecisionMaker: false },
      { id: 1.12, text: "Increment frequency counter", isStepDecisionMaker: false },
      { id: 1.13, text: "Move node to the next frequency bucket", isStepDecisionMaker: false },
      { id: 1.14, text: "If frequency bucket was the min and is now empty, update min frequency", isStepDecisionMaker: false },
    ],
  },
  {
    id: 2,
    text: "Else",
    isStepDecisionMaker: false,
    subSteps: [
      {
        id: 2.1,
        text: "Is map size >= capacity?",
        isStepDecisionMaker: true,
        subSteps: [
          {
            id: 2.11,
            text: "Evict the least frequently used node",
            isStepDecisionMaker: false
          },
          {
            id: 2.12,
            text: "If frequency bucket is empty, remove it",
            isStepDecisionMaker: false
          },
          {
            id: 2.13,
            text: "Remove the node from the map",
            isStepDecisionMaker: false
          }
        ]
      },
      {
        id: 2.2,
        text: "min frequency = 1",
        isStepDecisionMaker: false
      },
      {
        id: 2.3,
        text: "Create a new node",
        isStepDecisionMaker: false
      },
      {
        id: 2.4,
        text: "Add the node to the map and frequency bucket",
        isStepDecisionMaker: false
      }
    ]
  },
];