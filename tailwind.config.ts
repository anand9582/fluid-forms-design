import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
       fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        gujarati: ['"Noto Sans Gujarati"', 'sans-serif'],
        roboto: ['Roboto', 'system-ui', 'sans-serif'],
        lato: ['"Lato"', 'sans-serif'],
        mulish: ['"Mulish"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        helvetica: ['"Helvetica"', 'Arial', 'sans-serif'],
      },fontSize: {
          'fontSize12px': '12px',
          'fontSize13px': '13px',
          'fontSize14px': '14px',
          'fontSize15px': '15px',
          'fontSize16px': '16px',
          'fontSize18px': '18px',
          'fontSize20px': '20px',
          'fontSize22px': '22px',
          'fontSize24px': '24px',
          'custom-40px': '36px',
          'custom-21px': '21px', 
          'custom-48px': '48px',
          'custom-56px': '56px',
          'custom-60px': '60px', 
        },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        bgprimary: '#f1f5f9',
        bgprimarylight:"#E5E5E5",
        bglightblue:"#F8FAFC",
        bggray:"#E2E8F0",
        textgray:"#475569",
        textpar:"#475569",
        textlightred:"#F87171",
        textgraylight:"#475569",
        Ailightorange:"#D97706",
        Ailightred:"#DC2626",
        Aidarkorange:"#D97706",
        Ailighteronered:"#DC2626",
        tablecolor:"#64748B",
        primarydarkblack: "#0A0A0A",
        labelcolor:"#171717",
        pagination: {
            text: "#404040",
            disabled: "#94A3B8",
            hover: "#1F2937",
          },
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          muted: "hsl(var(--sidebar-muted))",
        },
        chart: {
          blue: "hsl(var(--chart-blue))",
          green: "hsl(var(--chart-green))",
          orange: "hsl(var(--chart-orange))",
          red: "hsl(var(--chart-red))",
          purple: "hsl(var(--chart-purple))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.3s ease-out",
      },
        boxShadow: {
          alert: "0 2px 4px -2px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)",
          DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", 
          md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
          none: "none",
          custom: "0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 30px rgba(0, 0, 0, 0.1)",
          "added":
            "0 1px 2px -1px rgba(0,0,0,0.10), 0 1px 3px 0 rgba(0,0,0,0.10)",
              },

    },
  },
} satisfies Config;
