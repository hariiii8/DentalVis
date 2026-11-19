import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
}

export function Breadcrumbs({ items, homeLabel = 'Home' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-[#0D9488] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{homeLabel}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-slate-500 hover:text-[#0D9488] transition-colors font-medium truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#134E4A] truncate max-w-[250px]" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
