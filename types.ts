export interface Scholarship {
  name: string;
  provider: string;
  description: string;
  deadline: string;
  link: string;
}

export interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  publishedDate: string;
  link:string;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  }
}
