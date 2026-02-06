export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password123"
};

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Estantería Minimalista Oak",
    category: "Anaqueles",
    price: 450,
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800",
    stock: 12
  },
  {
    id: 2,
    name: "Silla Comedor Viena",
    category: "Juegos de Comedor",
    price: 180,
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&q=80&w=800",
    stock: 24
  },
  {
    id: 3,
    name: "Mesa de Centro Nogal",
    category: "Interiores",
    price: 320,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800",
    stock: 5
  },
  {
    id: 4,
    name: "Lámpara de Pie Arco",
    category: "Iluminación",
    price: 210,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    stock: 8
  },
  {
    id: 5,
    name: "Juego Comedor Nordic",
    category: "Juegos de Comedor",
    price: 1200,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800",
    stock: 3
  },
  {
    id: 6,
    name: "Anaquel Modular Gris",
    category: "Anaqueles",
    price: 550,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
    stock: 10
  }
];

export const SALES_DATA = [
  { month: "Ene", sales: 4500 },
  { month: "Feb", sales: 5200 },
  { month: "Mar", sales: 4800 },
  { month: "Abr", sales: 6100 },
  { month: "May", sales: 5900 },
  { month: "Jun", sales: 7500 },
];
