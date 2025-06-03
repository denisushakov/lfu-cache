export type TAlgoStep = {
  id: number;
  text: string;
  isStepDecisionMaker: boolean;
  branch?: "yes" | "no";
  subSteps?: TAlgoStep[];
};

export type TAlgoComponent = {
  activeAlgo: "get" | "put";
  activeStep: number;
}