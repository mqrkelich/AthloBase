import { HTMLAttributes } from "react";
import Link from "next/link";

interface FooterProps extends HTMLAttributes<HTMLDivElement> {
    user?: {
        id: string;
        name: string;
    };
}

export function Footer({
                           user,
                       }: FooterProps) {
    return (
        <footer className="py-12 border-t border-white/10">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">AthloBase</h3>
                        <p className="text-white/70">The modern platform for sports club management.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#features" className="text-white/70 hover:text-white">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-white/70 hover:text-white">
                                    Roadmap
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-white/70 hover:text-white">
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Community</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="https://github.com/mqrkelich/AthloBase"  className="text-white/70 hover:text-white">
                                    GitHub
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-white/70 hover:text-white">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-white/70 hover:text-white">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50">
                    <p>© {new Date().getFullYear()} AthloBase. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
