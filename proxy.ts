import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: "",
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value: "",
                            ...options,
                        });
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Protected routes
        if (
            request.nextUrl.pathname.startsWith("/workspace") ||
            request.nextUrl.pathname.startsWith("/profile") ||
            request.nextUrl.pathname.startsWith("/messages")
        ) {
            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // Auth routes (redirect to workspace if already logged in)
        if (
            request.nextUrl.pathname.startsWith("/login") ||
            request.nextUrl.pathname.startsWith("/signup")
        ) {
            if (user) {
                return NextResponse.redirect(new URL("/workspace", request.url));
            }
        }
    } catch (e) {
        // If there is an error, just continue. The client can handle auth errors.
        console.error("Middleware error:", e);
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
