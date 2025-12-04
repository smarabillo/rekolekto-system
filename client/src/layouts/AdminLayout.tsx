// src/layouts/AdminLayout.tsx
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {(title || actions) && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3">{actions}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

// Optional: Page Section Component
export function PageSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {children}
    </div>
  );
}
