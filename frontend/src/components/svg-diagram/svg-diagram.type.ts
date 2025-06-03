export type TSvgNodeItem = {
  id: string;
  isHeadNode?: boolean;
  isTailNode?: boolean;
  key: number;
  value: string | number;
  address: string;
  frequency?: number; // Added for LFU
  x: number;
};

export type TXPosition = {
  xPostion: number;
};

export type TArrowAnimations = {
  showArrows: boolean;
  onArrowHidden: () => void;
};

export type TEndNode = TXPosition;

type TYPosition = {
  yPosition: number;
};

export type TRectangle = TXPosition &
  Partial<TYPosition> & {
    text: string | number;
    address?: string;
    frequency?: number; // Added for LFU cache visualization
  };

export type TConnector = TXPosition & TYPosition;

export enum DIAGRAM_OPERATIONS {
  ADD = "add",
  REMOVE_TARGET_NODE = "remove_target_node",
  REMOVE = "remove",
  UPDATE_VALUE = "update_value",
}
