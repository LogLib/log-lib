const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{ts,tsx}"],
    darkMode: ["class"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-circle":
                    "radial-gradient(circle, var(--tw-gradient-stops), transparent 90%)",
            },
            colors: {
                brand: {
                    50: "#fffbe7",
                    100: "#fff5c1",
                    200: "#ffe885",
                    300: "#ffd240",
                    400: "#ffb90c",
                    500: "#f3a000",
                    600: "#d27800",
                    700: "#a75201",
                    800: "#8a4009",
                    900: "#75350e",
                    950: "#130701",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                logo: "#F9A858",
                emphasis: "#F9A858",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                sans: ["var(--font-satoshi)", ...fontFamily.sans],
                heading: ["var(--font-heading)", ...fontFamily.sans],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                typing: {
                    from: { width: "0" },
                    to: { width: "24ch" },
                },
                blink: {
                    from: { "border-right-color": "transparent" },
                    to: { "border-right-color": "black" },
                },
                text: {
                    "0%, 100%": {
                        "background-size": "200% 200%",
                        "background-position": "0% center",
                    },
                    "50%": {
                        "background-size": "200% 200%",
                        "background-position": "100% center",
                    },
                },
                border: {
                    "0%, 100%": {
                        transform: "translateX(0)",
                    },
                    "50%": {
                        transform: "translateX(50px)",
                    },
                    "70%": {
                        transform: "translateX(100px)",
                    },
                    "80%": {
                        transform: "translateX(400px)",
                    },
                    "100%": {
                        transform: "translateX(600px)",
                    },
                },
                "background-pan": {
                    from: {
                        "background-position": "0% center",
                    },
                    to: {
                        "background-position": "-200% center",
                    },
                },
                "spin-slow": {
                    from: {
                        "transform-origin": "center center",
                        transform: "rotate(0deg)",
                    },
                    to: {
                        "transform-origin": "center center",
                        transform: "rotate(360deg)",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                typing: "typing 2s steps(14), blink 0.1s infinite",
                text: "text 6s linear infinite",
                border: "border 30s ease infinite -2s",
                "background-pan": "background-pan 3s linear infinite",
                "spin-slow": "spin-slow 10s linear infinite",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [
        // @ts-ignore
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/container-queries"),
    ],
};
