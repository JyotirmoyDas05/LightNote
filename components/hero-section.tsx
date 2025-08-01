'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import { ShootingStars } from './ShootingStars'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

// Word switching animation component
const WordSwitcher = () => {
    const words = ['Forge ⚒️', 'Build 🏗️', 'Create 🧬', 'Design 🎨', 'Craft 🪡']
    const [currentWordIndex, setCurrentWordIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }, 2000) // Change word every 2 seconds

        return () => clearInterval(interval)
    }, [words.length])

    // Find the longest word to determine container width
    const longestWord = words.reduce((a, b) => a.length > b.length ? a : b)

    return (
        <span 
            className="relative inline-block text-center"
            style={{ 
                width: `${longestWord.length * 0.55}em`, // Dynamic width based on longest word
                minWidth: '1em' // Minimum width to ensure proper spacing
            }}
        >
            {words.map((word, index) => (
                <span
                    key={word}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                        index === currentWordIndex
                            ? 'opacity-100 transform translate-y-0'
                            : index < currentWordIndex
                            ? 'opacity-0 transform -translate-y-4'
                            : 'opacity-0 transform translate-y-4'
                    }`}
                    style={{
                        display: index === 0 ? 'flex' : 'flex',
                        position: index === 0 ? 'relative' : 'absolute'
                    }}
                >
                    {word}
                </span>
            ))}
        </span>
    )
}

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden relative">
                {/* Light theme grid background, hidden in dark mode, absolutely positioned behind content */}
                <div
                  className="absolute inset-0 -z-30 block dark:hidden"
                  aria-hidden
                  style={{
                    backgroundColor: '#f8fafc',
                    backgroundImage: `
                      linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 30px",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                    maskImage:
                      "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                  }}
                />
                {/* ...existing code... */}
                <section>
                    <div className="relative pt-24 md:pt-36">
                        {/* Natural Shooting Stars - Only in dark mode */}
                        <div className="hidden dark:block">
                            <ShootingStars
                                minSpeed={6}
                                maxSpeed={12}
                                starColor="#ffffff"
                                trailColor="#ffffff44"
                                starWidth={20}
                                starHeight={2}
                            />
                        </div>
                        
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            <Image
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>
                        
                        {/* Rest of your existing code remains the same */}
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Introducing Support for AI Models</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <h1 className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-semibold">
                                    <TextEffect
                                        as="span"
                                        preset="fade-in-blur"
                                        speedSegment={0.3}
                                        delay={0.5}
                                        className="inline-block"
                                    >
                                        <WordSwitcher />
                                    {' '}Your Ideas with LightNote
                                    </TextEffect>
                                </h1>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                    LightNote is your creative canvas—where thoughts become notes, ideas connect, and inspiration flows. Effortless, flexible, and designed for clarity and Simplicity.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                    <Button
                                        size="lg"
                                        className="rounded-xl px-5 text-base"
                                        onClick={async () => {
                                            // Check session status via API or cookie
                                            try {
                                                const res = await fetch("/api/auth/session");
                                                const data = await res.json();
                                                if (data?.user) {
                                                    window.location.href = "/dashboard";
                                                } else {
                                                    window.location.href = "/login";
                                                }
                                            } catch {
                                                window.location.href = "/login";
                                            }
                                        }}>
                                        <span className="text-nowrap">Start Building</span>
                                    </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="#link">
                                            <span className="text-nowrap">See it in Action</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="/mail2.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <Image
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="/mail2-light.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}
