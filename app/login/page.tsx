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
import { getUser, saveUser, StoredUser } from "@/lib/localStorageHelper";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: any) {
    const stored = getUser();

    if (!stored) {
      window.alert("Akun belum terdaftar. Silakan daftar terlebih dahulu.");
      return;
    }

    if (stored.email !== values.email || stored.password !== values.password) {
      window.alert("Email atau password salah.");
      return;
    }

    // Set sesi di context + pastikan data user tersimpan
    const user: StoredUser = {
      name: stored.name,
      email: stored.email,
      password: stored.password,
      role: stored.role || (stored.email === "admin@example.com" ? "admin" : "user"),
    };
    saveUser(user);
    login(user);

    window.alert("Login sukses");
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
          <h1 className="text-2xl font-extrabold">Selamat Datang Kembali</h1>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="contoh@email.com" />
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
                  <FormLabel>Kata Sandi</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Masukkan kata sandi Anda" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <a className="text-sm text-blue-600" href="#">Lupa Kata Sandi?</a>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Login</Button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-muted-foreground flex-1" />
              <span className="text-sm text-muted-foreground">atau</span>
              <div className="h-px bg-muted-foreground flex-1" />
            </div>

            <Button variant="outline" className="w-full">Login dengan Google</Button>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun? <a className="text-red-600" href="/register">Daftar di sini</a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
