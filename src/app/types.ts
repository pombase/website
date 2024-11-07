export interface MenuItem {
  id: string;
  displayName: string;
  subItems?: Array<MenuItem>;
}
