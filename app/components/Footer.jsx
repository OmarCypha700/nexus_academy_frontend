import Link from "next/link";
import { GraduationCap, Mail, MapPin } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { name: "Courses", href: "/courses" },
      // { name: "Pricing", href: "/prices" },
      // { name: "Become an Instructor", href: "/signup/instructor" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/#faq" },
      { name: "Contact", href: "mailto:researchnexus.info@gmail.com" },
    ],
  },
];

const legalItems = ["Terms of Service", "Privacy Policy"];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30 px-4 py-14">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Nexus Academy</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Empowering learning, one course at a time.
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> researchnexus.info@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Accra, Ghana
            </p>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-foreground">Legal</h3>
          <ul className="mt-3 space-y-2">
            {legalItems.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center mt-10 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Nexus Academy. All rights reserved.
      </p>
    </footer>
  );
}
