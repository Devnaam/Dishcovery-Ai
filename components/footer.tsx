import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Utensils, Github, Linkedin, Heart } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t bg-background mt-12">
			<div className="container px-4 py-8 md:py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="md:col-span-1">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<Utensils className="h-5 w-5 text-primary" />
							<span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
								Dishcovery
							</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							Find creative recipes using ingredients you already have at home.
						</p>
						<p className="text-sm mt-4 flex items-center gap-1">
							Made with{" "}
							<Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> & AI
						</p>
					</div>

					<div className="md:col-span-1">
						<h3 className="font-medium mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Search Recipes
								</Link>
							</li>
							<li>
								<Link
									href="/cuisines"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Explore Cuisines
								</Link>
							</li>
							<li>
								<Link
									href="/favorites"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Favorites
								</Link>
							</li>
						</ul>
					</div>

					<div className="md:col-span-1">
						<h3 className="font-medium mb-4">About</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					<div className="md:col-span-1">
						<h3 className="font-medium mb-4">Join Our Newsletter</h3>
						<div className="flex flex-col space-y-2">
							<Input type="email" placeholder="Your email address" />
							<Button className="w-full">Subscribe</Button>
						</div>
						<div className="flex items-center gap-4 mt-6">
							<Link
								href="https://github.com/Devnaam"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Github className="h-5 w-5" />
								<span className="sr-only">GitHub</span>
							</Link>
							<Link
								href="https://www.linkedin.com/in/raj-priyadershi-56a256282/"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Linkedin className="h-5 w-5" />
								<span className="sr-only">LinkedIn</span>
							</Link>
							<Link
								href="https://devnaam4s.vercel.app/"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<span className="text-sm">Portfolio</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
					<p className="text-sm text-muted-foreground">
						© 2025 Dishcovery. All rights reserved.
					</p>
					<div className="flex items-center gap-4 mt-4 md:mt-0">
						<Link
							href="/privacy"
							className="text-xs text-muted-foreground hover:text-primary transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="text-xs text-muted-foreground hover:text-primary transition-colors"
						>
							Terms
						</Link>
						<Link
							href="/cookies"
							className="text-xs text-muted-foreground hover:text-primary transition-colors"
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
