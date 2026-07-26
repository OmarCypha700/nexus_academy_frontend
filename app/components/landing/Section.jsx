import { cn } from "@/app/lib/utils";

export default function Section({ as: Tag = "section", className, containerClassName, children, ...props }) {
  return (
    <Tag className={cn("w-full py-20 md:py-28 px-4", className)} {...props}>
      <div className={cn("max-w-6xl mx-auto", containerClassName)}>{children}</div>
    </Tag>
  );
}
