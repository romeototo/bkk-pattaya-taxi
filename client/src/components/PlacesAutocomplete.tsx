/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
    _mapsScriptLoading?: Promise<void>;
    _mapsScriptLoaded?: boolean;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

function loadMapsScript(): Promise<void> {
  if (window._mapsScriptLoaded) return Promise.resolve();
  if (window._mapsScriptLoading) return window._mapsScriptLoading;

  window._mapsScriptLoading = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=places,geocoding`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      window._mapsScriptLoaded = true;
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      resolve(); // resolve anyway to avoid hanging
    };
    document.head.appendChild(script);
  });

  return window._mapsScriptLoading;
}

type Suggestion = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
  /** Bias results toward Thailand */
  countryBias?: string;
}

export function PlacesAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  id,
  required,
  countryBias = "th",
}: PlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Google Maps and init service
  useEffect(() => {
    loadMapsScript().then(() => {
      if (window.google?.maps?.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        setMapsReady(true);
      }
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(
    (input: string) => {
      if (!mapsReady || !autocompleteService.current || input.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);

      autocompleteService.current.getPlacePredictions(
        {
          input,
          sessionToken: sessionToken.current ?? undefined,
          componentRestrictions: countryBias ? { country: countryBias } : undefined,
          types: ["establishment", "geocode"],
        },
        (predictions, status) => {
          setLoading(false);
          if (
            status === window.google!.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(
              predictions.map((p) => ({
                placeId: p.place_id,
                description: p.description,
                mainText: p.structured_formatting.main_text,
                secondaryText: p.structured_formatting.secondary_text ?? "",
              }))
            );
            setIsOpen(true);
            setActiveIndex(-1);
          } else {
            setSuggestions([]);
            setIsOpen(false);
          }
        }
      );
    },
    [mapsReady, countryBias]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 250);
  };

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.description);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    // Refresh session token after selection
    if (window.google?.maps?.places) {
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={cn("pl-9 pr-8", className)}
          required={required}
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
          <ul role="listbox" className="py-1 max-h-60 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={s.placeId}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before click
                  handleSelect(s);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                  i === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
              >
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.mainText}</p>
                  {s.secondaryText && (
                    <p className="text-xs text-muted-foreground truncate">{s.secondaryText}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
