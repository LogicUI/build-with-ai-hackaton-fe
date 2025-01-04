'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { HopeIconSVG } from "../../assets/assets"
import { useAuth } from '@/app/hooks/useAuth'
import Image from "next/image";
import Link from 'next/link'
import { BounceLoader } from 'react-spinners';

const navigation = [
    { name: 'Entries', href: '/entries' },
    { name: 'Feelings AI', href: '/chatbot' },
]


export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const {handleLogout, logOutIsLoading, userMetaData, isLoggedIn} = useAuth()
    

    return (
        <>
            {logOutIsLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-center text-white">
                        <BounceLoader color="#ffffff" />
                        <p className="mt-4">Logout successful. Returning you to the homepage...</p>
                    </div>
                </div>
            )}
            <header className="text-white bg-dark">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5 flex justify-center items-center ">
                            <span className="sr-only">Your Company</span>
                            <Image
                                src={HopeIconSVG}
                                alt="icon" />
                            <h1 className="ml-3 text-xl fontWeight-semibold">HopeLog</h1>
                        </Link>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {isLoggedIn && navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-sm/6 font-semibold">
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
                        {isLoggedIn && userMetaData ? (
                            <>
                                <span className="mr-4 text-sm/6 font-semibold">Welcome {userMetaData.name}</span>
                                <Link href="/" onClick={handleLogout} className="text-sm/6 font-semibold">
                                    Log out <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="text-sm/6 font-semibold">
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        )}
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-dark text-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white-900/10">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="-m-1.5 p-1.5 flex justify-center items-center">
                                <span className="sr-only">Your Company</span>
                                <Image
                                    src={HopeIconSVG}
                                    alt="icon"
                                />
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-white-500/10">
                                <div className="space-y-2 py-6">
                                    {isLoggedIn && navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-white-50"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6 text-center">
                                    {isLoggedIn && userMetaData && (
                                        <span className="block mb-4 text-base/7 font-semibold">Welcome {userMetaData.name}</span>
                                    )}
                                    {isLoggedIn ? (
                                        <Link
                                            onClick={handleLogout}
                                            href="/"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold hover:bg-gray-50"
                                        >
                                            Log out
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold hover:bg-gray-50"
                                        >
                                            Log in
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
        </>
    )
}
