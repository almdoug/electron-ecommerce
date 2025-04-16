export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  rating: number;
  stock: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export interface Testimonial {
  id: number;
  author: string;
  image: string;
  descrition: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Review {
  id: number;
  user: User;
  product: Product;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: User;
  publishedAt: string;
  tags: string[];
} 