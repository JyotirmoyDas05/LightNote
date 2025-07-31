import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Start Forging 🔥</h2>
                    <p className="mt-4">Capture your ideas instantly and organize your notes effortlessly with no Hidden Charges. Start your note-taking journey today!</p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg">
                            <Link href="/login">
                                <span>Get Started</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline">
                            <Link href="/">
                                <span>See it in Action</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
