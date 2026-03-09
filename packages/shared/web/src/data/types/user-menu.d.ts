export interface MenuNavigation {
  name: string;
  href: string;
  canView: boolean;
  onClick?(): void;
  icon?: React.ElementType;
}

export interface UserMenuProps {
  navigationItens: MenuNavigation[];
  user: any;
}
