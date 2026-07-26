import { ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import DOMPurify from "dompurify";

export function AdditionalResources({ resources = [] }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h3 className="text-lg font-medium text-foreground">Additional Resources</h3>
      <Separator className="bg-border" />
      {resources && resources.length > 0 ? (
        <ul className="space-y-2">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="flex flex-col p-2 rounded-md hover:bg-muted transition-colors duration-200"
            >
              <div className="flex items-center">
                {resource.resource_type === "link" ? (
                  <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                ) : (
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                )}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm sm:text-base flex items-center"
                  aria-label={`Open resource: ${resource.title}`}
                >
                  <span className="truncate">{resource.title}</span>
                  <ArrowUpRight className="h-3 w-3 ml-1" aria-hidden="true" />
                </a>
              </div>
              {resource.description && (
                <div
                  className="text-sm text-muted-foreground mt-1 ml-6 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(resource.description),
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-muted-foreground text-sm p-4">
          No additional resources available for this lesson.
        </div>
      )}
    </div>
  );
}