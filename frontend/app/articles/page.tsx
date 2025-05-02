'use client'

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Bookmark, Share2, Tag, Clock, ExternalLink } from 'lucide-react';
import Link from "next/link";

// Define article data type to match the API response
interface Article {
  article_id: number;
  author: string;
  title: string;
  description: string;
  url: string;
  urltoimage: string; // Note the lowercase 'i' in urltoimage
  contents: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Define component for related article card
const RelatedArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Link href={`/articles?id=${article.article_id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition duration-300 cursor-pointer">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={article.urltoimage || "/images/placeholder.jpg"}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            className="transition duration-300"
            unoptimized={true}
          />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{article.title}</h4>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={10} className="mr-1" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Function to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Function to estimate read time
const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export default function ArticleDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch article data
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    // Fetch the specific article
    fetch(`${API_BASE_URL}/articles/${id}`)
      .then(response => response.json())
      .then(responseData => {
        if (responseData.success) {
          setArticle(responseData.data);

          // After getting the article, fetch related articles from the same category
          return fetch(`${API_BASE_URL}/articles?category=${responseData.data.category}`);
        }
        throw new Error("Article not found");
      })
      .then(response => response.json())
      .then(relatedData => {
        if (relatedData.success) {
          // Filter out the current article and limit to 5 related articles
          const filtered = relatedData.data
            .filter((item: Article) => item.article_id !== Number(id))
            .slice(0, 5);

          setRelatedArticles(filtered);
        }
      })
      .catch(error => {
        console.error("Error fetching article:", error);
        router.push('/articles'); // Redirect to articles page if error
      })
      .finally(() => setIsLoading(false));

  }, [id, API_BASE_URL, router]);

  // Back to articles page
  const goBack = () => {
    router.push('/article');
  };

  // Handle sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.description,
        url: window.location.href,
      })
        .catch(err => console.log('Error sharing', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You would typically show a toast notification here
      alert('Link copied to clipboard!');
    }
  };

  // Handle bookmark (this would typically interact with user preferences in a real app)
  const handleBookmark = () => {
    // Just a placeholder for now
    alert('Article saved to bookmarks!');
  };

  // Open the original article URL
  const openOriginalArticle = () => {
    if (article?.url) {
      window.open(article.url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Artikel tidak ditemukan</h2>
          <p className="text-gray-600 mb-6">Maaf, artikel yang Anda cari tidak tersedia.</p>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke daftar artikel
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const readTime = estimateReadTime(article.contents);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Article Image */}
      <div className="relative w-full h-64 md:h-96 bg-blue-900">
        <Image
          src={article.urltoimage || "/images/placeholder.jpg"}
          alt={article.title}
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-70"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 container mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 text-shadow-lg">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white text-sm md:text-base">
            <span className="flex items-center">
              <Tag size={14} className="mr-1.5" />
              {article.category}
            </span>
            <span className="flex items-center">
              <Calendar size={14} className="mr-1.5" />
              {formatDate(article.createdAt)}
            </span>
            <span className="flex items-center">
              <User size={14} className="mr-1.5" />
              {article.author}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              {readTime} min read
            </span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleBookmark}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition duration-300"
              >
                <Bookmark size={14} />
                <span className="hidden sm:inline">Simpan</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition duration-300"
              >
                <Share2 size={14} />
                <span className="hidden sm:inline">Bagikan</span>
              </button>
              {article.url && (
                <button
                  onClick={openOriginalArticle}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition duration-300"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Buka Sumber Asli</span>
                </button>
              )}
            </div>
          </div>

          {/* Article description */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 font-medium italic">
              {article.description}
            </p>
          </div>

          {/* Article content */}
          <div className="bg-white text-gray-500 rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
            <div className="prose prose-blue max-w-none">
              {/* Render the article content */}
              <div dangerouslySetInnerHTML={{ __html: article.contents }} />
            </div>

            {/* Original source link at the end of the article */}
            {article.url && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Baca artikel asli di sumber
                </a>
              </div>
            )}
          </div>

          {/* Author section */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <User size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {article.author}
                </h3>
                <p className="text-gray-500 text-sm">
                  Penulis Dokterikan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related articles section */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              Artikel Terkait
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {relatedArticles.map(relatedArticle => (
                  <RelatedArticleCard
                    key={relatedArticle.article_id}
                    article={relatedArticle}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}