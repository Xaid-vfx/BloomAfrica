'use client'

import { LayoutGrid, List } from 'lucide-react'

export type MobileViewMode = 'grid' | 'list'

interface MobileViewToggleProps {
    currentView: MobileViewMode
    onViewChange: (view: MobileViewMode) => void
}

export default function MobileViewToggle({ currentView, onViewChange }: MobileViewToggleProps) {
    const views: { mode: MobileViewMode; icon: typeof LayoutGrid; label: string }[] = [
        { mode: 'list', icon: List, label: 'List' },
        { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
    ]

    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {views.map(({ mode, icon: Icon, label }) => (
                <button
                    key={mode}
                    onClick={() => onViewChange(mode)}
                    className={`
                        flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all
                        ${currentView === mode
                            ? 'bg-white text-[#0A1F44] shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }
                    `}
                    title={`${label} view`}
                >
                    <Icon size={14} />
                    <span>{label}</span>
                </button>
            ))}
        </div>
    )
}
