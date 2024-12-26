"use client";

export default function page() {
  return (
    <div className="relative max-w-full overflow-hidden space-y-4 ">
      <div className="mx-auto max-w-6xl">
        <h1 className="bg-gradient-to-r from-stone-300 to-stone-400/80 bg-clip-text mb-3 text-center text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-relaxed">
          Pricing
        </h1>
      </div>
      <div className=" flex items-center justify-center">
        <p className=" max-w-lg break-words text-center font-medium text-stone-50 mb-10">
          Always free.
        </p>
      </div>
    </div>
  );
}
