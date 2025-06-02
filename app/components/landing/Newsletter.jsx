import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function Newsletter() {
  return (
    <section className="w-full py-14 bg-indigo-700 text-white text-center px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Subscribe for Updates</h2>
        <p className="mb-6 text-sm sm:text-base">Get notified when new courses drop!</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Input placeholder="Enter your email" className="w-full" />
          <Button variant="secondary" className="w-full sm:w-auto">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}