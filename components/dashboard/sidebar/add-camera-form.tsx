'use client'

//Shadcn UI Imports
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CameraSchema, CameraSchemaType } from "@/schemas/camera-schema";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Button } from "@/components/ui/button"

//My imports
import { FormError, FormSuccess } from "@/components/auth/form-messages";



//General Imports
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";



export default function AddCameraForm() {

  const form = useForm<CameraSchemaType>({
          resolver: zodResolver(CameraSchema),
          defaultValues: {
            admin: "",
            password: "",
            url: "",
          },
        });

    const handleCameraSubmit = async (values: CameraSchemaType) => {
        console.log('YOOO im here')
    }


    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCameraSubmit)} className="space-y-8">
        <div>
            <FormField 
                control={form.control}
                name="admin"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4">
                        <FormLabel>admin </FormLabel>
                            <FormControl>
                                <Input
                                className="col-span-3"
                                placeholder="Admin Username..."
                                type="text"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage className="col-span-4"/>
                    </FormItem>
                )}
                />
            </div>
            <div>
            <FormField 
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input  className="col-span-3"
                      placeholder="***********"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4"/>
                </FormItem>
              )}
            />
            </div>
            <div>
            <FormField 
                control={form.control}
                name="url"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4">
                        <FormLabel>URL </FormLabel>
                            <FormControl>
                                <Input
                                className="col-span-3"
                                placeholder="Camera HTTP URL..."
                                type="text"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage className="col-span-4"/>
                    </FormItem>
                )}
                />
            </div>
            <Button variant={"default"} type="submit" className="w-full cursor-pointer">Save changes</Button> 
            {/* <FormSuccess message={success ? "Category added successfuly!" : ""} />
            <FormError message={success === false ? errorMessage : ""}/> */}
        </form>
    </Form>
      )
  }