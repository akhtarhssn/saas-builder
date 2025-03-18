"use client"

import { Agency } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { NumberInput } from '@tremor/react'
import { v4 } from 'uuid'

import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FileUpload from '@/components/global/file-upload'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { deleteAgency, initUser, saveActivityLogsNotification, updateAgencyDetails, upsertAgency } from '@/lib/queries'
import { Button } from '../ui/button'
import Loading from '../global/loading'

type Props = {
    data?: Partial<Agency>
}

const FormSchema = z.object({
    name: z.string().min(2, { message: "Agency name must be at least 2 characters" }),
    companyEmail: z.string().email({ message: "Invalid email address" }),
    companyPhone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
    whiteLabel: z.boolean(),
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: z.string().min(2, { message: "State must be at least 2 characters" }),
    zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
    country: z.string().min(2, { message: "Country must be at least 2 characters" }),
    agencyLogo: z.string(),
})

const AgencyDetails = ({ data }: Props) => {
    const { toast } = useToast()
    const router = useRouter()

    const [deletingAgency, setDeletingAgency] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: data?.name,
            companyEmail: data?.companyEmail,
            companyPhone: data?.companyPhone,
            whiteLabel: data?.whiteLabel,
            address: data?.address,
            city: data?.city,
            state: data?.state,
            zipCode: data?.zipCode,
            country: data?.country,
            agencyLogo: data?.agencyLogo,
        },
    })

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (data) {
            form.reset(data)
        }
    }, [data, form])

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            let newUserData;
            let customerId;
            if (!data?.id) {
                const bodyData = {
                    email: values.companyEmail,
                    name: values.name,
                    shipping: {
                        address: {
                            city: values.city,
                            country: values.country,
                            line1: values.address,
                            postalCode: values.zipCode,
                            state: values.state
                        },
                        name: values.name
                    },
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.address,
                        postalCode: values.zipCode,
                        state: values.zipCode
                    }
                }

            }

            // WIP custId
            newUserData = await initUser({ role: 'AGENCY_OWNER' })
            if (!data?.id) {
                await upsertAgency({
                    id: data?.id ? data.id : v4(),
                    // customerId: data?.customerId,
                    address: values.address,
                    agencyLogo: values.agencyLogo,
                    city: values.city,
                    companyPhone: values.companyPhone,
                    country: values.country,
                    name: values.name,
                    state: values.state,
                    whiteLabel: values.whiteLabel,
                    zipCode: values.zipCode,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    companyEmail: values.companyEmail,
                    connectAccountId: '',
                    goal: 5,
                })
                toast({
                    title: "Created Agency",
                    // description: "Failed to delete agency and subaccounts"
                })

                return router.refresh();
            }
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: "Oppse!",
                description: "Failed to save agency details"
            })
        }
    }

    const handleDeleteAgency = async () => {
        if (!data?.id) return
        setDeletingAgency(true)
        // await updateAgencyDetails(data.id, { isDeleted: true })
        // WIP: discontinue the subscription

        try {
            const response = await deleteAgency(data.id)
            toast({
                title: "Agency Deleted",
                description: "Your agency and all subaccounts have been deleted",
            })
            router.refresh()
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: "Oppse!",
                description: "Failed to delete agency and subaccounts"
            })
        }
        setDeletingAgency(false)
    }

    return (
        <AlertDialog>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Agency Information</CardTitle>
                    <CardDescription>
                        Let&apos;s create an agency for your business. You can edit agency settings later from the agency settings tabs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className='space-y-4'
                        >
                            <FormField disabled={isLoading} control={form.control} name='agencyLogo' render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agency Logo</FormLabel>
                                    <FormControl>
                                        <FileUpload apiEndpoint='agencyLogo' onChange={field.onChange} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}></FormField>
                            <div className="flex md:flex-row gap-4 ">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Agency Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Your Agency Name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name='companyEmail'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Agency Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Your Agency Email' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="companyPhone"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Agency Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Phone"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="whiteLabel"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                                            <div>
                                                <FormLabel>White Label Agency</FormLabel>
                                                <FormDescription>
                                                    Turning on white label mode will show your agency logo
                                                    to all sub accounts by default. You can overwrite this
                                                    functionality through sub account settings.
                                                </FormDescription>
                                            </div>

                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 st..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="City"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="State"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Zip Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Zipcode"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Country"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                data?.id && (
                                    <div className='flex flex-col gap-2'>
                                        <FormLabel>Create A Goal</FormLabel>
                                        <FormDescription>✨ Create a goal for your agency. As your business grows your goals grow too, so don&apos;t forget to set the bar higher!</FormDescription>
                                        <NumberInput
                                            defaultValue={data?.goal}
                                            onValueChange={async (val) => {
                                                if (!data?.id) return
                                                await updateAgencyDetails(data.id, { goal: val })
                                                await saveActivityLogsNotification({
                                                    agencyId: data.id,
                                                    description: `Update the agency goal to | ${val} Sub Account`,
                                                    subAccountId: undefined,
                                                })
                                                router.refresh()
                                            }}
                                            min={1}
                                            className='bg-background !border !border-input'
                                            placeholder='Sub Account Goal'
                                        />
                                    </div>
                                )}
                            <Button type='submit' disabled={isLoading}>
                                {isLoading ? <Loading /> : 'Save Agency Information'}
                            </Button>
                        </form>
                    </Form>
                    {!data?.id && (
                        <div className='flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'>
                            <div className='flex flex-col gap-y-2'>
                                <div>
                                    Danger Zone
                                </div>
                                <span className='w-1/5 h-0.5 bg-red-300'></span>
                                <div className='text-muted-foreground'>
                                    Deleting your agency cannot be undone. This will also delete all sub accounts. Sub accounts will no longer have access to funnels, contacts etc.
                                </div>
                                <div className='ml-auto'>
                                    <AlertDialogTrigger
                                        disabled={isLoading || deletingAgency}
                                        className='text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap duration-300'
                                    >
                                        {deletingAgency ? "Deleting..." : "Delete Agency"}
                                    </AlertDialogTrigger>
                                </div>
                            </div>
                        </div>
                    )}

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-left">
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                                This action cannot be undone. This will permanently delete the
                                Agency account and all related sub accounts.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                            <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deletingAgency}
                                className="bg-destructive hover:bg-destructive"
                                onClick={handleDeleteAgency}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CardContent>
            </Card>
        </AlertDialog>
    )

}

export default AgencyDetails