"use client"
import { Sidebar } from '@/components/workspace/sidebar'
import { QueryProvider } from '@/providers/QueryProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryProvider>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar />
                <div className="flex-1 overflow-auto bg-background">
                    {children}
                </div>
            </div>
        </QueryProvider>
    )
}

export default layout