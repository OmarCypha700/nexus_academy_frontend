"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

export default function Reveal({ as: Tag = "div", className, delay = 0, children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        !visible && "opacity-0",
        visible && "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 ease-out",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
