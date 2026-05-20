export type SidebarTab = {
  name: string;
  title: string;
  icon: string;
  onRender: (container: HTMLElement) => void | Promise<void>;
};
