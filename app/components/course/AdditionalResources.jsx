import { ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
// import { cn } from "@/app/lib/utils";

export function AdditionalResources({ resources = [] }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h3 className="text-lg font-medium text-gray-800">Additional Resources</h3>
      <Separator className="bg-gray-200" />
      {resources && resources.length > 0 ? (
        <ul className="space-y-2">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="flex flex-col p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                {resource.resource_type === "link" ? (
                  <ExternalLink className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <FileText className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" aria-hidden="true" />
                )}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm sm:text-base flex items-center"
                  aria-label={`Open resource: ${resource.title}`}
                >
                  <span className="truncate">{resource.title}</span>
                  <ArrowUpRight className="h-3 w-3 ml-1" aria-hidden="true" />
                </a>
                {/* <span
                  className={cn(
                    "ml-2 text-xs px-2 py-1 rounded-full",
                    resource.resource_type === "link" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  )}
                >
                  {resource.resource_type === "link" ? "Link" : "Document"}
                </span> */}
              </div>
              {resource.description && (
                <p className="text-sm text-gray-500 mt-1 ml-6">{resource.description}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 text-sm p-4">
          No additional resources available for this lesson.
        </div>
      )}
    </div>
  );
}