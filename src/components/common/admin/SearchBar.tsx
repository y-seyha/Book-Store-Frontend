"use client";

import { Input } from "@/components/ui/input";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({
                                      value,
                                      onChange,
                                  }: SearchBarProps) {
    return (
        <Input
            placeholder="Search products..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="max-w-sm"
        />
    );
}