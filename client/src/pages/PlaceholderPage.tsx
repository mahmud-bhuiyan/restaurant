import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <PublicLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <PageHeader
          eyebrow="Coming Soon"
          title={title}
          description={description}
        />
        <Link to="/" className="mt-8">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </PublicLayout>
  );
}
