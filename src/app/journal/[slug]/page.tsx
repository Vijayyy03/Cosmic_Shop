import { articles } from "../page";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/journal"
          className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-2 text-sm text-primary font-semibold uppercase tracking-wider">
            <span>{article.category}</span>
            <span className="text-muted-foreground font-normal">&bull;</span>
            <span className="text-muted-foreground font-normal">{article.date}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
        </div>

        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-muted mb-12 shadow-md">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-stone prose-lg max-w-none text-muted-foreground">
          <p className="lead text-xl text-foreground font-medium mb-8">
            {article.excerpt}
          </p>
          <p>
            Spiritual wellness begins with intention. When we bring powerful tools like crystals, malas, or adaptogens into our space, they act as amplifiers for our own energy. However, like any vessel, they can absorb stagnation over time. 
          </p>
          <h2>The Art of the Ritual</h2>
          <p>
            Taking the time to care for your items is a ritual in itself. It forces you to slow down, disconnect from digital noise, and reconnect with the earth. Whether you prefer smoke cleansing with ethically sourced sage, or letting your crystals bathe in the light of the full moon, the most important element is your mindset.
          </p>
          <blockquote>
            "The magic isn't just in the stone; it's in the relationship you build with it."
          </blockquote>
          <p>
            Try setting a recurring calendar reminder based on the lunar cycle, or simply cleanse your items whenever they feel "heavy" or dull. 
          </p>
        </div>
      </div>
    </div>
  );
}
