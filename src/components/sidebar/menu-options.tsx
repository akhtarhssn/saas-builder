'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { Popover, PopoverTrigger } from '../ui/popover'
import { PopoverContent } from '@radix-ui/react-popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import Link from 'next/link'
// import Compass from '../icons/compass'

type Props = {
    defaultOpened?: boolean
    subAccounts: SubAccount[]
    sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
    sidebarLogo: string
    details: any
    user: any
    id: string
}

const MenuOptions = ({
    details,
    id,
    sidebarLogo,
    sidebarOpt,
    subAccounts,
    user,
    defaultOpened
}: Props) => {
    const [isMounted, setIsMounted] = useState(false);

    const openState = useMemo(
        () => (defaultOpened ? { open: true } : {}),
        [defaultOpened]
    )

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) return

    return (
        <Sheet
            modal={false}
            open={true}
        // {...openState}
        >
            <SheetTrigger asChild className='absolute left-4 top-4 z-50 md:hidden flex'>
                <Button variant='outline' size={'icon'}>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent
                showX={!defaultOpened}
                side='left'
                className={clsx("bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6", { "hidden md:inline-block z-0 w-[300px]": defaultOpened, "inline-block md:hidden z-[100] w-full": !defaultOpened })}
            >
                <div>
                    <AspectRatio ratio={16 / 5}>
                        <Image
                            src={sidebarLogo} alt='Sidebar Logo'
                            fill
                            className='rounded-md object-contain'
                        />
                    </AspectRatio>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="w-full my-4 flex items-center justify-between py-8"
                                variant="ghost"
                            >
                                <div className="flex items-center text-left gap-2">
                                    <Compass />
                                    <div className="flex flex-col">
                                        {details.name}
                                        <span className="text-muted-foreground">
                                            {details.address}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <ChevronsUpDown
                                        size={16}
                                        className="text-muted-foreground"
                                    />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-80 h-80 mt-4 z-[200]'>
                            <Command className='rounded-lg'>
                                <CommandInput placeholder='Search Accounts...' />
                                <CommandList className='pb-16'>
                                    <CommandEmpty>No Results Found</CommandEmpty>
                                    {(user?.role === 'AGENCY_OWNER' || user?.role === "AGENCY_ADMIN") && user?.Agency && (<CommandGroup heading='Agency'>
                                        <CommandItem
                                            key={user?.Agency?.id}
                                            className='!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:bg-muted transition-all'
                                        >
                                            {defaultOpened ?
                                                <Link href={`/agency/${user?.Agency?.id}`}>
                                                    <div className='relative w-60'>
                                                        <Image
                                                            src={user?.Agency?.agencyLogo}
                                                            alt='Agency Logo'
                                                            fill
                                                            className='rounded-md object-contain'
                                                        />
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        {user?.Agency?.name}
                                                        <span className='text-muted-foreground'>{user?.Agency?.address}</span>
                                                    </div>
                                                </Link>
                                                : (
                                                    <SheetClose asChild>
                                                        <Link href={`/agency/${user?.Agency?.id}`}>
                                                            <div className='relative w-60'>
                                                                <Image
                                                                    src={user?.Agency?.agencyLogo}
                                                                    alt='Agency Logo'
                                                                    fill
                                                                    className='rounded-md object-contain'
                                                                />
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                {user?.Agency?.name}
                                                                <span className='text-muted-foreground'>{user?.Agency?.address}</span>
                                                            </div>
                                                        </Link>
                                                    </SheetClose>
                                                )}
                                        </CommandItem>
                                    </CommandGroup>
                                    )}
                                    <CommandGroup heading="Accounts">
                                        {
                                            !!subAccounts ?
                                                subAccounts.map((subaccount) => (
                                                    <CommandItem key={subaccount.id}>
                                                        {defaultOpened ?
                                                            <Link href={`/subaccount/${subaccount?.id}`}>
                                                                <div className='relative w-60'>
                                                                    <Image
                                                                        src={subaccount?.subAccountLogo}
                                                                        alt='Sub Account Logo'
                                                                        fill
                                                                        className='rounded-md object-contain'
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col flex-1">
                                                                    {subaccount?.name}
                                                                    <span className='text-muted-foreground'>{subaccount?.address}</span>
                                                                </div>
                                                            </Link>
                                                            : (
                                                                <SheetClose asChild>
                                                                    <Link href={`/subaccount/${subaccount?.id}`}>
                                                                        <div className='relative w-60'>
                                                                            <Image
                                                                                src={subaccount?.subAccountLogo}
                                                                                alt='Sub Account Logo'
                                                                                fill
                                                                                className='rounded-md object-contain'
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col flex-1">
                                                                            {subaccount?.name}
                                                                            <span className='text-muted-foreground'>{subaccount?.address}</span>
                                                                        </div>
                                                                    </Link>
                                                                </SheetClose>
                                                            )}
                                                    </CommandItem>
                                                ))
                                                : "No Accounts"
                                        }
                                    </CommandGroup>
                                </CommandList>

                                {(user?.role === 'AGENCY_OWNER' || user?.role === "AGENCY_ADMIN") && (
                                    <Button className='w-full flex gap-2'>
                                        <PlusCircleIcon size={15} />
                                        Create Sub Account
                                    </Button>
                                )}

                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MenuOptions