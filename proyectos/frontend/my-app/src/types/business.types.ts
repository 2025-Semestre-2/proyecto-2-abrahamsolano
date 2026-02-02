export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  guests: number;
  beds: number;
  imageUrl: string;
  type: string;
  description: string;
}

export interface PropertyFormData {
  title: string;
  location: string;
  price: string;
  guests: string;
  beds: string;
  type: string;
  description: string;
  imageUrl: string;
}
