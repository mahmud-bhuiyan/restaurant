export const siteInfo = {
  name: "Epicurean Haven",
  tagline: "Where every dish tells a story",
  description:
    "An intimate fine-dining experience celebrating seasonal ingredients, bold flavors, and the art of hospitality.",
  address: "42 Culinary Lane, Downtown",
  phone: "+1 (555) 123-4567",
  email: "hello@epicureanhaven.com",
  hours: [
    { days: "Mon – Thu", time: "5:00 PM – 10:00 PM" },
    { days: "Fri – Sat", time: "5:00 PM – 11:00 PM" },
    { days: "Sunday", time: "4:00 PM – 9:00 PM" },
  ],
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
  },
};

export const featuredMenu = [
  {
    id: "1",
    name: "Pan-Seared Scallops",
    description: "Cauliflower purée, crispy pancetta, lemon beurre blanc",
    price: 28,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1559847844-d7214261f162?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Wagyu Beef Tenderloin",
    description: "Truffle mash, roasted bone marrow, red wine jus",
    price: 58,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Dark Chocolate Soufflé",
    description: "Valrhona chocolate, vanilla bean ice cream",
    price: 16,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1624353365286-3f8c62da2555?w=600&h=400&fit=crop",
  },
];

export const galleryImages = [
  {
    id: "1",
    caption: "Main dining room",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=450&fit=crop",
  },
  {
    id: "2",
    caption: "Chef's signature dish",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop",
  },
  {
    id: "3",
    caption: "Wine & cocktails",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=450&fit=crop",
  },
  {
    id: "4",
    caption: "Private events",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=450&fit=crop",
  },
];

export const testimonials = [
  {
    id: "1",
    name: "Sarah Mitchell",
    rating: 5,
    message:
      "An unforgettable evening. The wagyu was perfectly cooked and the service was impeccable.",
  },
  {
    id: "2",
    name: "James Chen",
    rating: 5,
    message:
      "Best fine dining in the city. The ambiance is moody and elegant — exactly what we wanted for our anniversary.",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    rating: 4,
    message:
      "Every course was a masterpiece. The chocolate soufflé alone is worth the visit.",
  },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];
