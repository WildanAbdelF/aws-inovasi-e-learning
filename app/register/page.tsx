"use client";

import { useState } from "react";
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
import { registerUser, saveUser, StoredUser } from "@/lib/localStorageHelper";
import { useAuth } from "@/components/providers";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      accept: false,
    },
  });

  function onSubmit(values: any) {
    const user: StoredUser = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.email === "admin@example.com" ? "admin" : "user",
    };

    // Register user to persistent storage
    const success = registerUser(user);
    if (!success) {
      window.alert("Email sudah terdaftar. Silakan gunakan email lain atau login.");
      return;
    }

    // Save to current session
    saveUser(user);

    // Set session in context so navbar updates immediately
    login(user);

    window.alert("Pendaftaran berhasil. Anda sudah otomatis login.");
    if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div
          className="flex flex-col items-center mb-6"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z"/></svg>
          </div>
          <h1 className="text-2xl font-extrabold">Buat Akun Baru</h1>
          <p className="text-sm text-muted-foreground">Daftar untuk memulai perjalanan belajar Anda.</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="120"
          >
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
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Buat password yang kuat"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4" />
              <label htmlFor="terms" className="text-sm">Saya setuju dengan <span className="text-red-600">Syarat & Ketentuan</span></label>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform">Daftar</Button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-muted-foreground flex-1" />
              <span className="text-sm text-muted-foreground">atau</span>
              <div className="h-px bg-muted-foreground flex-1" />
            </div>

            <Button variant="outline" className="w-full hover:scale-105 transition-transform border-red-500 text-red-600 hover:bg-red-500 hover:text-white">Daftar dengan Google</Button>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun? <a className="text-red-600" href="/login">Login di sini</a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
