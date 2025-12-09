import { Layout } from "@/components/Layout";
import { useParams } from "react-router-dom";

export default function Placeholder() {
  const params = useParams<{ name?: string }>();
  const pageName = params.name || "Page";

  const readableTitle = pageName
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
              Coming Soon
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-poppins font-bold mb-4 glow-text">
            {readableTitle}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            This section is coming soon! Tell us what you'd like to see here.
          </p>
          <div className="glass-effect rounded-lg p-8 inline-block">
            <p className="text-muted-foreground mb-4">
              This is a placeholder page. To fill in this section with content:
            </p>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>
                ✓ Ask the AI to create the {readableTitle.toLowerCase()} section
              </li>
              <li>✓ Provide specific content or design requirements</li>
              <li>✓ The AI will update this page with your content</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
