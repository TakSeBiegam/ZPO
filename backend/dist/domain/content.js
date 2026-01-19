"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductItem = exports.PostItem = exports.ContentItem = void 0;
class ContentItem {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }
}
exports.ContentItem = ContentItem;
class PostItem extends ContentItem {
    getSummary() {
        return `Post: ${this.title}`;
    }
}
exports.PostItem = PostItem;
class ProductItem extends ContentItem {
    getSummary() {
        return `Product: ${this.title}`;
    }
}
exports.ProductItem = ProductItem;
