import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import blogsData from "@/data/blogs.json";

interface Blog {
  id: number;
  title: string;
  slug: string;
  author: string;
  date: string;
  category: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  readTime: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const blogs: Blog[] = blogsData.blogs;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-poppins font-bold mb-4">Blog Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find the blog you're looking for.
            </p>
            <Link to="/blogs">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedBlogs = blogs.filter((b) => b.category === blog.category && b.id !== blog.id);

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/blogs" className="inline-flex mb-8">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
          </Link>

          {/* Article Header */}
          <article className="glass-effect rounded-xl overflow-hidden">
            {/* Hero */}
            <div className="h-72 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-9xl">{blog.thumbnail}</div>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-12">
              {/* Meta */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-poppins font-bold mb-6 glow-text">
                {blog.title}
              </h1>

              {/* Author & Date */}
              <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(blog.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {blog.readTime}
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-lg text-muted-foreground my-6 italic">
                {blog.excerpt}
              </p>

              {/* Main Content */}
              <div className="prose prose-invert max-w-none mb-12">
                <p className="text-foreground leading-relaxed mb-6">
                  {blog.content}
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h2 className="text-2xl font-poppins font-bold mt-8 mb-4">Key Takeaways</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li>Point 1: Important insight from the article</li>
                  <li>Point 2: Another valuable takeaway</li>
                  <li>Point 3: Key learning to remember</li>
                </ul>
              </div>

              {/* Share & CTA */}
              <div className="bg-primary/10 rounded-lg p-6 mb-12 border border-primary/20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-poppins font-bold mb-1">Share this article</h3>
                    <p className="text-sm text-muted-foreground">
                      Help others discover this content
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="border-t border-border pt-8">
                <h3 className="font-poppins font-bold mb-3">About the Author</h3>
                <div className="flex gap-4">
                  <div className="text-4xl">{blog.thumbnail}</div>
                  <div>
                    <h4 className="font-semibold mb-1">{blog.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      Passionate tech enthusiast and core team member at DevNest. Loves sharing
                      knowledge and mentoring aspiring developers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-poppins font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedBlogs.slice(0, 2).map((relatedBlog) => (
                  <Link key={relatedBlog.id} to={`/blog/${relatedBlog.slug}`}>
                    <div className="glass-effect rounded-lg overflow-hidden hover-lift transition-all group cursor-pointer h-full">
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-5xl group-hover:scale-110 transition-transform">
                          {relatedBlog.thumbnail}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-poppins font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
