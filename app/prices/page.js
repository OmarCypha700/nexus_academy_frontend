import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    title: "Starter",
    price: "$9",
    features: [
      "Access to all free courses",
      "Community support",
      "Monthly newsletters"
    ],
    cta: "Get Started"
  },
  {
    title: "Pro",
    price: "$29",
    features: [
      "Everything in Starter",
      "Access to premium courses",
      "Downloadable resources",
      "1-on-1 mentorship"
    ],
    cta: "Go Pro"
  },
  {
    title: "Enterprise",
    price: "Contact us",
    features: [
      "Custom course packages",
      "Team analytics",
      "Dedicated support manager"
    ],
    cta: "Contact Sales"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Choose your plan</h2>
        <p className="mt-4 text-lg text-gray-600">Flexible pricing for learners and teams of all sizes.</p>
      </div>
      <div className="grid gap-8 max-w-7xl mx-auto sm:grid-cols-2 lg:grid-cols-3 px-4">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className="flex flex-col justify-between shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-semibold text-gray-800 mb-2">{plan.title}</CardTitle>
              <p className="text-3xl text-center font-bold text-black">{plan.price}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 mt-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="text-green-500 w-5 h-5 mt-1" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
