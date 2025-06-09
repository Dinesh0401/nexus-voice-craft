import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				nexus: {
					primary: '#28a745',
					secondary: '#8E9196',
					light: '#F1F1F1',
					dark: '#333333',
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Montserrat', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'pulse-green': {
					'0%, 100%': {
						'box-shadow': '0 0 0 0 rgba(40, 167, 69, 0.4)'
					},
					'50%': {
						'box-shadow': '0 0 0 10px rgba(40, 167, 69, 0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'page-enter': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(20px) scale(0.98)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0) scale(1)' 
					}
				},
				'page-exit': {
					'0%': { 
						opacity: '1', 
						transform: 'translateX(0) scale(1)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translateX(-20px) scale(0.98)' 
					}
				},
				'tab-slide-in': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(10px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)' 
					}
				},
				'tab-slide-out': {
					'0%': { 
						opacity: '1', 
						transform: 'translateX(0)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translateX(-10px)' 
					}
				},
				'avatar-load': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.8)'
					},
					'50%': {
						transform: 'scale(1.05)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'typing-wave': {
					'0%, 60%, 100%': {
						transform: 'translateY(0)',
						opacity: '0.4'
					},
					'30%': {
						transform: 'translateY(-10px)',
						opacity: '1'
					}
				},
				'message-appear': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'smooth-bounce': {
					'0%, 20%, 50%, 80%, 100%': {
						transform: 'translateY(0)'
					},
					'40%': {
						transform: 'translateY(-8px)'
					},
					'60%': {
						transform: 'translateY(-4px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'pulse-green': 'pulse-green 2s infinite',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'page-enter': 'page-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'page-exit': 'page-exit 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'tab-slide-in': 'tab-slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'tab-slide-out': 'tab-slide-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				'avatar-load': 'avatar-load 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'typing-wave': 'typing-wave 1.4s ease-in-out infinite',
				'message-appear': 'message-appear 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'smooth-bounce': 'smooth-bounce 1s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
