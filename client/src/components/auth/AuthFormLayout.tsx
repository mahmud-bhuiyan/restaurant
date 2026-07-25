import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../ui/PageHeader";

type AuthFormLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
};

export default function AuthFormLayout({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthFormLayoutProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-center text-sm text-gray-500">
          {footerText}{" "}
          <Link to={footerLinkTo} className="text-gold hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
