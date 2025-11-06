"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => void;
    };
    __tsOnLoad?: () => void;
  }
}

const Schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  budget: z.enum(["starter","core","custom"]).optional(),
  message: z.string().min(10, "Give us a little more context"),
  // Turnstile token
  cfToken: z.string().min(1, "Captcha failed"),
});
type FormData = z.infer<typeof Schema>;

export default function ContactForm() {
  const [sent, setSent] = useState<"idle"|"ok"|"err">("idle");
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } =
    useForm<FormData>({ resolver: zodResolver(Schema) });

  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.warn("Turnstile site key missing (NEXT_PUBLIC_TURNSTILE_SITE_KEY).");
      return;
    }

    const render = () => {
      if (!widgetRef.current) return;
      if (!window.turnstile) return;
      window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token: string) => setValue("cfToken", token),
      });
    };

    if (typeof window !== "undefined" && window.turnstile) render();
    window.__tsOnLoad = render;

    return () => {
      if (typeof window !== "undefined") window.__tsOnLoad = undefined;
    };
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setSent("idle");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSent(res.ok ? "ok" : "err");
  };

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__tsOnLoad" strategy="afterInteractive" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-white/70">Name</label>
          <input {...register("name")} className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500" />
          {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-white/70">Email</label>
          <input {...register("email")} className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500" />
          {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-white/70">Company</label>
          <input {...register("company")} className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-white/70">Budget (rough)</label>
          <select {...register("budget")} className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500">
            <option value="">Select…</option>
            <option value="starter">Starter (WordPress / rapid)</option>
            <option value="core">Core (hybrid)</option>
            <option value="custom">Custom (Next.js / headless)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70">Project details</label>
        <textarea rows={5} {...register("message")} className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500" />
        {errors.message && <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>}
      </div>

      {/* TODO: replace this with the Cloudflare Turnstile widget and remove the input */}
      <input type="hidden" {...register("cfToken")} />
      {/* e.g., setValue('cfToken', token) in the Turnstile callback */}
      <div ref={widgetRef} className="mt-2" />

      <button disabled={isSubmitting} className="rounded-full bg-blue-500 px-5 py-2.5 font-medium text-white hover:bg-blue-400 transition disabled:opacity-50">
        {isSubmitting ? "Sending…" : "Send message"}
      </button>

      {sent === "ok" && <p className="text-emerald-400 text-sm mt-2">Thanks! We’ll be in touch shortly.</p>}
      {sent === "err" && <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>}
    </form>
    </>
  );
}