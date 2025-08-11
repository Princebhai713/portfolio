
import { Navigation } from "@/components/navigation";
import { BlogSection } from "@/components/blog-section";
import { Footer } from "@/components/footer";

export default function Blog() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navigation />
      <div className="pt-16">
        <BlogSection />
      </div>
      <Footer />
    </div>
  );
}
