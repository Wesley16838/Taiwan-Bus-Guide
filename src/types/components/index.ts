/**
 * Type of component's props
 */
export type LayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
  description?: string;
  previewImage?: string;
  siteName?: string;
};

export type LinkProps = {
  imagePath?: any;
  imageAlt?: any;
  classname?: any;
  destination: string;
};

export type InputProps = {
  type: string;
  name: string;
  required: boolean;
  onChange?: any;
  classname?: string;
  placeholder?: string;
  props?: string[];
  defaultValue?: string;
  onPress?: any;
};

export type TabsProps = {
  children: any;
  onClick?: any;
};

export type TabProps = {
  activeTab: any;
  label: any;
  onClick?: any;
  index?: number;
};

export type ButtonProps = {
  onClick: any;
  text: string;
  disabled: boolean;
};

export type DropDownProps = {
  data?: DataType;
  arrayData?: any;
  onClick: any;
  type?: string;
  defaultValue?: string;
  defaultLabel?: string;
  label?: string;
};

export type MapProps = {
  data: any;
  userLocation: any;
  center: any;
  busLocation: any;
};

/**
 * Type for single param in the props
 */
export type DataType = {
  defaultValue: DataItemType;
  listing: DataItemType[];
};

export type DataItemType = {
  value: string;
  label: string;
};
