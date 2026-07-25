import { Link } from "react-router-dom";
import PageMeta from "../components/seo/PageMeta";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <PageMeta
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
      />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-2 font-display text-4xl text-white">Page Not Found</h1>
        <p className="mt-4 max-w-md text-gray-400">
          This page may have moved or no longer exists. Head back to the menu or
          home page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button variant="outline">Home</Button>
          </Link>
          <Link to="/menu">
            <Button>View Menu</Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
