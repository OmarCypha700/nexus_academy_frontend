import { ExternalLink } from "lucide-react";

export function AdditionalResources({ resources = [] }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Additional Resources</h3>
      {resources && resources.length > 0 ? (
        <ul className="space-y-2">
          {resources.map((resource, index) => (
            <li key={index} className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No additional resources available for this lesson.</p>
      )}
    </div>
  );
}