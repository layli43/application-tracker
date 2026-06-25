"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (e.target.value) params.set("search", e.target.value);
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }, 300);
  }

  return (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="Search jobs..."
        className="pl-8 h-8 text-sm"
      />
    </div>
  );
}
