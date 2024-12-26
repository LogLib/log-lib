"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import React, { useRef, useState } from "react";

interface UsageCardProps {
  title: string;
  value: string;
  description?: string;
  icon: keyof typeof Icons;
}

export const UsageCard = ({
  title,
  value,
  description,
  icon,
}: UsageCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const Icon = Icons[icon];
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <Card
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative  group  overflow-hidden border-white/90  dark:border-gray-800 bg-stone-900 dark:bg-gradient-to-tr rounded-xl  dark:to-stone-900/70  dark:from-stone-950 dark:shadow-2xl "
    >
      <div
        className="pointer-events-none  absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(222,182,255,.2), transparent 40%)`,
        }}
      />

      <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl pb-5">{title}</CardTitle>
        <Icon className="text-white/50 group-hover:opacity-100 opacity-50 transform transition-opacity duration-300 absolute bottom-[-35px] w-36 h-36 font-thin  right-[-30px] " />
      </CardHeader>
      <CardContent className="space-y-1 ">
        <div className="text-2xl pb-1 font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export function UsageCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-4 w-40" />
      </CardContent>
    </Card>
  );
}
