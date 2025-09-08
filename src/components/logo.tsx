import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("text-primary", className)}
    >
      <g fill="currentColor">
        <path d="M50 10 C 20 20, 20 80, 50 90 S 80 20, 50 10 Z M 45 40 Q 40 50, 45 60 L 55 60 Q 60 50, 55 40 Z" opacity="0.3" />
        <path d="M30,80 C 40,70 60,70 70,80" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M35,85 C 45,75 55,75 65,85" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M40,90 C 45,85 55,85 60,90" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50,30 Q 55 20, 60 30 T 70 40" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M50,30 Q 45 20, 40 30 T 30 40" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M50,60 V 80" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="50" cy="50" r="12" />
        <text 
            x="50" 
            y="98" 
            fontFamily="PT Sans, sans-serif"
            fontWeight="bold"
            fontSize="14" 
            textAnchor="middle" 
            fill="currentColor"
            letterSpacing="1.5"
            >
            AGRISAGE
        </text>
      </g>
    </svg>
  );
}
