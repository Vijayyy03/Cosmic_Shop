import Link from "next/link";
import Image from "next/image";

export const articles = [
  {
    id: "1",
    title: "How to Cleanse and Recharge Your Crystals",
    slug: "how-to-cleanse-crystals",
    excerpt: "Discover the ancient practices of smudging, moonlight bathing, and salt water cleansing to keep your gemstones vibrating at their highest frequency.",
    date: "October 12, 2023",
    image: "https://images.unsplash.com/photo-1596489370041-37d457630713?q=80&w=800&auto=format&fit=crop",
    category: "Guides"
  },
  {
    id: "2",
    title: "The Healing Power of Ashwagandha",
    slug: "healing-power-of-ashwagandha",
    excerpt: "An in-depth look at this powerful Ayurvedic adaptogen and how incorporating it into your daily routine can help manage stress and increase vitality.",
    date: "November 04, 2023",
    image: "https://images.unsplash.com/photo-1616111162464-b0d3bb630722?q=80&w=800&auto=format&fit=crop",
    category: "Wellness"
  },
  {
    id: "3",
    title: "Ethical Sourcing: Behind the Scenes",
    slug: "ethical-sourcing-behind-the-scenes",
    excerpt: "Take a journey with us to the family-run mines we partner with. See firsthand how we guarantee fair trade practices in the crystal industry.",
    date: "January 18, 2024",
    image: "https://images.unsplash.com/photo-1608248593859-0524bd37f1e7?q=80&w=800&auto=format&fit=crop",
    category: "Our Journey"
  }
];

export default function JournalPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">The Cosmic Journal</h1>
        <p className="text-lg text-muted-foreground">
          Insights, guides, and stories from our journey in spiritual wellness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/journal/${article.slug}`}
            className="group flex flex-col bg-background rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                {article.category}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <p className="text-sm text-muted-foreground mb-3">{article.date}</p>
              <h2 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                {article.excerpt}
              </p>
              <div className="text-primary font-medium text-sm flex items-center mt-auto">
                Read Article &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
