"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      accept: false,
    },
  });

  function onSubmit(values: any) {
    // Simulasi signup sukses
    window.alert("Pendaftaran berhasil. Silakan login.");
    router.push("/login");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z"/></svg>
          </div>
          <h1 className="text-2xl font-extrabold">Buat Akun Baru</h1>
          <p className="text-sm text-muted-foreground">Daftar untuk memulai perjalanan belajar Anda.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan nama lengkap Anda" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Masukkan email Anda" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Buat password yang kuat" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4" />
              <label htmlFor="terms" className="text-sm">Saya setuju dengan <span className="text-red-600">Syarat & Ketentuan</span></label>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Daftar</Button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-muted-foreground flex-1" />
              <span className="text-sm text-muted-foreground">atau</span>
              <div className="h-px bg-muted-foreground flex-1" />
            </div>

            <Button variant="outline" className="w-full">Daftar dengan Google</Button>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun? <a className="text-red-600" href="/login">Login di sini</a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
