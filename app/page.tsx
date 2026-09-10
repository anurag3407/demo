import CardStackDemo from "@/components/card-stack-demo";
import TooltipCardDemo from "@/components/tooltip-card-demo";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <header className="text-center max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Aceternity UI & Shadcn Components
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
          Next.js 15, Tailwind CSS v4, TypeScript, and Motion integration.
        </p>
      </header>

      {/* Card Stack Component Section */}
      <section className="w-full max-w-4xl flex flex-col items-center border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 bg-white dark:bg-neutral-900 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Card Stack Component</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Auto-flipping stacked testimonial cards powered by Motion.
        </p>
        <CardStackDemo />
      </section>

      {/* Tooltip Card Component Section */}
      <section className="w-full max-w-4xl flex flex-col items-center border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 bg-white dark:bg-neutral-900 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Tooltip Card Component</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Cursor-tracking animated tooltip cards with rich media content.
        </p>
        <TooltipCardDemo />
      </section>
    </div>
  );
}
