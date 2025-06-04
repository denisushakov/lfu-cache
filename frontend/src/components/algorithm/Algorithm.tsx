import React, { FC, Fragment, useEffect, useRef } from 'react';
import { useLFUStore } from '../../store/lfu-store';
import { Card, CardHeader } from '../common';
import { getAlgo, putAlgo } from './algorithm-steps';
import { TAlgoStep } from './algorithm.type';

// Helper function to generate step IDs
const getStepId = (activeStep: number) => `step-${activeStep}`.replace(/\./g, "-");

export const Algorithm: React.FC = () => {
  // Get current operation and selected operation from LFU store
  const { currentOperation, selectedOperation, lastKey, operationHistory } = useLFUStore(state => ({
    currentOperation: state.currentOperation,
    selectedOperation: state.selectedOperation,
    lastKey: state.lastKey,
    operationHistory: state.operationHistory
  }));
  
  // Local state for algorithm visualization
  const [activeStep, setActiveStep] = React.useState(0);
  const [executedSteps, setExecutedSteps] = React.useState<number[]>([]);
  const [activeBranches, setActiveBranches] = React.useState<{[key: number]: 'yes' | 'no'}>({});
  const olRef = useRef<HTMLOListElement>(null);
  
  // Determine which algorithm to show based on selected operation (not current operation)
  const activeAlgo = selectedOperation === 'get' ? 'get' : 'put';
  const algoSteps = activeAlgo === 'get' ? getAlgo : putAlgo;
  
  // Reset algorithm state when operation changes or history updates
  useEffect(() => {
    setActiveStep(0);
    setExecutedSteps([]);
    setActiveBranches({});
    
    if (currentOperation === 'none' || operationHistory.length === 0) return;
    
    // Get the latest operation from history
    const latestOp = operationHistory[operationHistory.length - 1];
    
    // Define the steps to execute and branches to take
    let stepsToExecute: number[] = [];
    let branchChoices: {[key: number]: 'yes' | 'no'} = {};
    
    if (currentOperation === 'get') {
      stepsToExecute.push(1); // Is key present?
      
      // For GET, we can check the result to determine if key existed
      const keyExists = latestOp.result !== -1;
      
      if (keyExists) {
        // Yes path
        branchChoices[1] = 'yes';
        stepsToExecute.push(1.11, 1.12, 1.13, 1.14);
      } else {
        // No path
        branchChoices[1] = 'no';
        stepsToExecute.push(2, 2.21);
      }
    } else if (currentOperation === 'put') {
      stepsToExecute.push(1); // Is key already present?
      
      // Use the pre-operation state stored in the operation history
      const keyExisted = latestOp.keyExisted;
      const wasAtCapacity = latestOp.wasAtCapacity;
      
      if (keyExisted) {
        // Yes path - key existed before operation
        branchChoices[1] = 'yes';
        stepsToExecute.push(1.1, 1.11, 1.12, 1.13, 1.14);
      } else {
        // No path - key did not exist before operation
        branchChoices[1] = 'no';
        stepsToExecute.push(2);
        
        if (wasAtCapacity) {
          // Yes path for capacity check
          branchChoices[2.1] = 'yes';
          stepsToExecute.push(2.1, 2.11, 2.12, 2.13);
        } 

        // Common steps for new entries
        stepsToExecute.push(2.2, 2.3, 2.4);
      }
    }
    
    // Set active branches
    setActiveBranches(branchChoices);
    
    // Execute steps with animation
    let stepIndex = 0;
    const executeStep = () => {
      if (stepIndex < stepsToExecute.length) {
        const step = stepsToExecute[stepIndex];
        setActiveStep(step);
        setExecutedSteps(prev => [...prev, step]);
        stepIndex++;
        setTimeout(executeStep, 1000);
      } else {
        // Reset active step when done
        setTimeout(() => setActiveStep(0), 1000);
      }
    };
    
    // Start execution immediately for better responsiveness
    executeStep();
  }, [currentOperation, lastKey, operationHistory]);
  
  // Scroll to active step
  useEffect(() => {
    if (olRef.current && activeStep > 0) {
      const targetLi = olRef.current.querySelector(`#${getStepId(activeStep)}`);
      if (targetLi) {
        const top = targetLi.getBoundingClientRect().top;
        olRef.current.scrollTo(0, top);
      }
    }
  }, [activeStep]);
  
  return (
    <Card>
      <CardHeader>Algorithm</CardHeader>
      <ol
        ref={olRef}
        className="pb-2 max-h-[calc(100vh-12px-41px-8px-1px-8px-100px-12px-8px-16px-8px-33px)] overflow-auto scroll-smooth"
      >
        <AlgoList
          activeStep={activeStep}
          executedSteps={executedSteps}
          activeBranches={activeBranches}
          algoSteps={algoSteps}
          level={1}
        />
      </ol>
    </Card>
  );
};

type TAlgoListProps = {
  activeStep: number;
  executedSteps: number[];
  activeBranches: {[key: number]: 'yes' | 'no'};
  algoSteps: TAlgoStep[];
  level?: number;
};

const AlgoList: FC<TAlgoListProps> = ({
  algoSteps,
  activeStep,
  executedSteps,
  activeBranches,
  level = 1,
}) => {
  return (
    <>
      {algoSteps.map((step) => {
        // Determine if this step or its branch should be highlighted
        const isActive = activeStep === step.id;
        const isExecuted = executedSteps.includes(step.id);
        
        // For branch steps, check if this is the active branch
        const parentId = Math.floor(step.id);
        const isBranchActive = step.branch && 
          step.branch === activeBranches[parentId];
        
        // Determine if this step should be highlighted
        const shouldHighlight = isActive || 
          (isExecuted) || 
          (isBranchActive && executedSteps.includes(parentId));
        
        return (
          <Fragment key={step.id}>
            <li
              id={getStepId(step.id)}
              className={`list-inside text-sm transition-colors duration-500 ${level === 1
                  ? "font-medium py-2 list-[square]"
                  : "py-1 list-[circle]"
                } ${activeStep === step.id ? "bg-slate-100" : ""}`}
              style={{
                paddingLeft: `${level}rem`,
                marginLeft: `${level}rem`,
              }}
            >
              {level > 1 && (
                <span className="inline-block mr-2 text-gray-400">•</span>
              )}
              <span>{step.text}</span>
              {step.isStepDecisionMaker && isActive && (
                <span className="ml-3 opacity-0 animate-fade-in">
                  {activeBranches[step.id] === 'yes' ? "✅" : "❌"}
                </span>
              )}
              {step.branch && executedSteps.includes(parentId) && (
                <span className="ml-2">
                  {isBranchActive ? "✓" : ""}
                </span>
              )}
            </li>
            {step.subSteps?.length ? (
              <AlgoList
                activeStep={activeStep}
                executedSteps={executedSteps}
                activeBranches={activeBranches}
                algoSteps={step.subSteps}
                level={level + 1}
              />
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
};