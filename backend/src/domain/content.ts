export abstract class ContentItem {
  constructor(protected title: string, protected body: string) {}

  abstract getSummary(): string;
}

export class PostItem extends ContentItem {
  getSummary(): string {
    return `Post: ${this.title}`;
  }
}

export class ProductItem extends ContentItem {
  getSummary(): string {
    return `Product: ${this.title}`;
  }
}
