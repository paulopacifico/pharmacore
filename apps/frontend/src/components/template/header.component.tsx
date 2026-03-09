"use client";

import { Bars3Icon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useApp } from "@pharmacore/shared-web";
import { UserMenu } from "./user-menu.component";

export function Header() {
    const { setSidebarOpen, themeMode, toggleThemeMode } = useApp();

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border-subtle bg-bg-page px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-text-muted hover:text-text-primary lg:hidden"
            >
                <span className="sr-only">Abrir menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            <div
                aria-hidden="true"
                className="h-6 w-px bg-border-subtle lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form
                    action="#"
                    method="GET"
                    className="grid flex-1 grid-cols-1"
                >
                    <input
                        name="search"
                        placeholder="Buscar..."
                        aria-label="Buscar"
                        className="col-start-1 row-start-1 block size-full bg-transparent pl-8 text-sm text-text-primary outline-hidden placeholder:text-text-muted"
                    />
                    <MagnifyingGlassIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-text-muted"
                    />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button
                        type="button"
                        onClick={toggleThemeMode}
                        className="inline-flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                        title={
                            themeMode === "dark"
                                ? "Ativar modo claro"
                                : "Ativar modo escuro"
                        }
                    >
                        <span className="sr-only">
                            {themeMode === "dark"
                                ? "Ativar modo claro"
                                : "Ativar modo escuro"}
                        </span>
                        {themeMode === "dark" ? (
                            <SunIcon className="size-5" />
                        ) : (
                            <MoonIcon className="size-5" />
                        )}
                    </button>
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
