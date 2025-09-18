export interface SectionStyling {
  textColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonRadius?: number;
  imageRadius?: number;
  fontSize?: "sm" | "md" | "lg";
  alignment?: "left" | "center" | "right";
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

export interface Section {
  id: string;
  type: "header" | "image" | "body" | "cta" | "signup" | "footer" | "social";
  content: any;
  order: number;
  styling: SectionStyling;
}

export interface Newsletter {
  id: string;
  subject: string;
  templateId: 1 | 2 | 3;
  sections: Section[];
  status: "draft" | "scheduled";
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterListItem {
  subject: string;
  status: "draft" | "scheduled";
  template: string;
  lastModified: Date;
  scheduledDate?: Date;
  actions: "preview" | "edit" | "duplicate" | "delete";
}

export interface AppState {
  newsletters: Newsletter[];
  currentNewsletter: Newsletter | null;
}

export interface HeaderContent {
  title: string;
  subtitle: string;
}

export interface ImageContent {
  url: string;
  alt: string;
}

export interface BodyContent {
  html?: string;
  markdown: string;
}

export interface CTAContent {
  text: string;
  url: string;
}

export interface SignupContent {
  heading: string;
  placeholder: string;
  buttonText: string;
}

export interface FooterContent {
  copyright: string;
  links: Array<{
    text: string;
    url: string;
  }>;
}

export interface SocialContent {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}
