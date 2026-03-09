"use client";
import { AuthProvider } from "@pharmacore/auth-web";
import { AppProvider } from "@pharmacore/shared-web";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AppProvider>{children}</AppProvider>
        </AuthProvider>
    );
}
