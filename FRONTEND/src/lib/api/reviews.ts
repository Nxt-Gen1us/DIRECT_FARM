import api from "../api";

export type ProductReview = {
  _id: string;
  author: { firstName?: string; lastName?: string; role?: string } | string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  return (await api.get<ProductReview[]>(`/reviews/product/${productId}`)) ?? [];
}
