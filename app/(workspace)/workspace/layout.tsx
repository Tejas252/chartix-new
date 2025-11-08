"use client"
import { Sidebar } from '@/components/workspace/sidebar'
import { QueryProvider } from '@/providers/QueryProvider'
import { UserProvider } from '@/providers/UserProvider'
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryProvider>
            <UserProvider>
                <div className="flex h-screen overflow-hidden">
                    {/* Mobile sidebar - hidden on medium screens and above */}
                    <div className="md:hidden fixed top-4 left-4 z-40">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-16 p-0">
                                <Sidebar className="border-r-0" />
                            </SheetContent>
                        </Sheet>
                    </div>
                    
                    {/* Desktop sidebar - visible on medium screens and above */}
                    <div className="hidden md:flex">
                        <Sidebar />
                    </div>
                    
                    <div className="flex-1 overflow-auto bg-background">
                        {children}
                    </div>
                </div>
            </UserProvider>
        </QueryProvider>
    )
}

export default layout