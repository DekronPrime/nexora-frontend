import { Check } from "lucide-react";

import { PricingPlan } from "@/src/types";
import { Button } from "./button";

type PricingCardProps = {
  plan: PricingPlan;
};

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={`
    relative flex h-full flex-col 
    rounded-xl border
    bg-background
    px-6
    py-8
    transition-all duration-300
    hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl

    ${
      plan.featured
        ? "scale-105 border-[3px] border-primary shadow-primary/20 shadow-2xl"
        : "border-border"
    }
  `}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-0 right-0 flex items-center justify-center">
          <span className="rounded-full bg-primary px-4 py-1 text-base font-semibold text-primary-foreground shadow-lg">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-foreground font-unbounded">
          {plan.name}
        </h3>

        <p className="mt-2 text-muted-foreground font-sofia">
          {plan.description}
        </p>
      </div>

      <div className="mb-8 font-sofia">
        <span className="text-5xl font-bold tracking-tight text-foreground">
          ${plan.price}
        </span>

        <span className="ml-2 text-muted-foreground">/{plan.period}</span>
      </div>

      <ul className="mb-8 flex-1 space-y-4 bg-secondary p-4 rounded-lg border border-border">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="h-4 w-4" />
            </div>

            <span className="text-md italic text-primary">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        variant={plan.owned ? "ghost" : "deluxe"}
        className={`
          
          font-semibold transition-all duration-300

          ${
            plan.featured
              ? "bg-primary hover:opacity-90"
              : "border border-border bg-secondary hover:border-primary hover:bg-primary/10"
          }
          ${
            plan.owned &&
            "border-muted-foreground hover:border-muted-foreground hover:text-muted-foreground text-muted-foreground user-select-none cursor-not-allowed"
          }
        `}
      >
        {plan.owned ? "Owned" : plan.buttonText}
      </Button>
    </div>
  );
}
