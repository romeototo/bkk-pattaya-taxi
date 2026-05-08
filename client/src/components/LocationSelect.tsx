import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_LOCATIONS = [
  // Bangkok
  { label: "Suvarnabhumi Airport (BKK)", category: "Airport" },
  { label: "Don Mueang Airport (DMK)", category: "Airport" },
  { label: "Bangkok City Center", category: "Bangkok" },
  { label: "Khao San Road, Bangkok", category: "Bangkok" },
  { label: "Sukhumvit, Bangkok", category: "Bangkok" },
  { label: "Silom, Bangkok", category: "Bangkok" },
  { label: "Siam Square, Bangkok", category: "Bangkok" },
  { label: "MBK Center, Bangkok", category: "Bangkok" },
  // Pattaya
  { label: "Pattaya City Center", category: "Pattaya" },
  { label: "Walking Street, Pattaya", category: "Pattaya" },
  { label: "Jomtien Beach, Pattaya", category: "Pattaya" },
  { label: "North Pattaya", category: "Pattaya" },
  { label: "South Pattaya", category: "Pattaya" },
  { label: "Hilton Pattaya", category: "Pattaya" },
  { label: "Terminal 21 Pattaya", category: "Pattaya" },
  // Others
  { label: "U-Tapao Airport (UTP)", category: "Airport" },
  { label: "Hua Hin", category: "Other" },
  { label: "Rayong", category: "Other" },
];

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSelect({
  value,
  onChange,
  placeholder,
  className,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState(PRESET_LOCATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    const q = val.toLowerCase();
    setFiltered(
      q.length > 0
        ? PRESET_LOCATIONS.filter((loc) => loc.label.toLowerCase().includes(q))
        : PRESET_LOCATIONS
    );
    setIsOpen(true);
  };

  const handleSelect = (label: string) => {
    onChange(label);
    setIsOpen(false);
  };

  // Group by category
  const grouped = filtered.reduce<Record<string, typeof PRESET_LOCATIONS>>((acc, loc) => {
    if (!acc[loc.category]) acc[loc.category] = [];
    acc[loc.category].push(loc);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn("pl-9", className)}
          autoComplete="off"
          required
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
          <ul className="py-1 max-h-60 overflow-y-auto">
            {Object.entries(grouped).map(([category, locations]) => (
              <li key={category}>
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                  {category}
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc.label}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(loc.label);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 w-full text-left cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{loc.label}</span>
                  </button>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
