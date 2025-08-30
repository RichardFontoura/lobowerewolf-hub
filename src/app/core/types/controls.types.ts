type BaseControl = {
  name: string;
  title: string;
  icon: string;
  visible?: boolean;
  order?: number;
};

export type Tool = BaseControl & {
  button: boolean;
  toggle?: boolean;
  foreground?: any;
  onClick?: () => void;
  onChange?: (event: any, active: any) => void;
};

export type SceneControlsUI = BaseControl & {
  layer?: string;
  activeTool?: string;
  tools: Record<string, Tool>;
  onChange: () => void;
};
