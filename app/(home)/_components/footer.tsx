import Link from "next/link"
import {Github} from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
                <div className="flex-1 space-y-4">
                    <h2 className="font-bold">AthloBase</h2>
                    <p className="text-sm text-muted-foreground">The ultimate sports team management platform.</p>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/privacy-policy"
                                      className="text-muted-foreground transition-colors hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-of-service"
                                      className="text-muted-foreground transition-colors hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/about"
                                      className="text-muted-foreground transition-colors hover:text-primary">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link target="_blank" href="https://github.com/mqrkelich/AthloBase/blob/main/README.md"
                                      className="text-muted-foreground transition-colors hover:text-primary">
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Connect</h3>
                        <div className="flex space-x-4">
                            <Link
                                href="https://github.com/mqrkelich/AthloBase"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Github className="h-5 w-5"/>
                                <span className="sr-only">GitHub</span>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
            <div className="container border-t py-6">
                <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} AthloBase. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
