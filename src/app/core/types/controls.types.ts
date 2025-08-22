type BaseControl = {
  name: string;
  title: string;
  icon: string;
  visible: boolean;
  order?: number;
};

export type Tool = BaseControl & {
  button: boolean;
  toggle?: boolean;
  onClick?: () => void;
  onChange?: () => void;
};

export type SceneControlsUI = BaseControl & {
  activeTool?: string;
  tools: Record<string, Tool>;
  onChange: () => void;
};
