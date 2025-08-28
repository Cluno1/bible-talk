export type MenuItemRouteType = {
  children?: MenuItemRouteType[];
  path: string;
  meta: {
    title?: string;
    rank?: number;
    hidden?: boolean;
    icon?: string;
  };
  name: string;
};
