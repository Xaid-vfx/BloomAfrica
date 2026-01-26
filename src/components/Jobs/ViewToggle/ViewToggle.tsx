'use client'

import { LayoutGrid, List, Columns } from 'lucide-react'

export type ViewMode = 'grid' | 'list' | 'split'

interface ViewToggleProps {
    currentView: ViewMode
    onViewChange: (view: ViewMode) => void
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    const views: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
        { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
        { mode: 'list', icon: List, label: 'List' },
        { mode: 'split', icon: Columns, label: 'Split' },
    ]

    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {views.map(({ mode, icon: Icon, label }) => (
                <button
                    key={mode}
                    onClick={() => onViewChange(mode)}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                        ${currentView === mode
                            ? 'bg-white text-[#0A1F44] shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }
                    `}
                    title={`${label} view`}
                >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{label}</span>
                </button>
            ))}
        </div>
    )
}
