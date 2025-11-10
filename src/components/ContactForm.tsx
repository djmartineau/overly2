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
  projectScale: z.string().optional(),
  message: z.string().min(10, "Give us a little more context"),
  cfToken: z.string().min(1, "Please complete the verification"),
});
type FormData = z.infer<typeof Schema>;

export default function ContactForm({ onSuccess }: { onSuccess?: () => void }){
  const [sent, setSent] = useState<"idle"|"ok"|"err">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    clearErrors,
  } = useForm<FormData>({ resolver: zodResolver(Schema) });

  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.warn("Turnstile site key missing (NEXT_PUBLIC_TURNSTILE_SITE_KEY).");
      return;
    }

    const render = () => {
      if (!widgetRef.current || !window.turnstile) return;
      window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token: string) => {
          setValue("cfToken", token, { shouldValidate: true, shouldDirty: true });
          clearErrors("cfToken");
        },
        "error-callback": () => {
          setValue("cfToken", "", { shouldValidate: true, shouldDirty: true });
          setError("cfToken", { type: "validate", message: "Verification failed. Please try again." });
        },
        "expired-callback": () => {
          setValue("cfToken", "", { shouldValidate: true, shouldDirty: true });
          setError("cfToken", { type: "validate", message: "Verification expired. Please retry." });
        },
      });
    };

    if (typeof window !== "undefined" && window.turnstile) render();
    window.__tsOnLoad = render;
    return () => { if (typeof window !== "undefined") window.__tsOnLoad = undefined; };
  }, [setValue, setError, clearErrors]);

  const onSubmit = async (data: FormData) => {
    setSent("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setSent("err");
        // Surface server message if available
        const msg = json?.error || "Something went wrong. Please try again.";
        setError("cfToken", { type: "server", message: msg }); // show near widget (most common failure point)
        return;
      }

      // Optional analytics hook:
      // window.dataLayer?.push({ event: "contact_submit", project_scale: data.projectScale ?? "" });

      setSent("ok");
      onSuccess?.();
    } catch {
      setSent("err");
      setError("cfToken", { type: "server", message: "Network error. Please try again." });
    }
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__tsOnLoad"
        strategy="afterInteractive"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-white/70">Name</label>
            <input
              {...register("name")}
              className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500"
            />
            {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-white/70">Email</label>
            <input
              {...register("email")}
              className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500"
            />
            {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-white/70">Company</label>
            <input
              {...register("company")}
              className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70">Project scale</label>
            <select
              {...register("projectScale")}
              className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500"
              defaultValue=""
            >
              <option value="">Choose one (optional)</option>
              <option value="Starter">Starter — a focused single project</option>
              <option value="Plus">Plus — multi-service collaboration</option>
              <option value="Comprehensive">Comprehensive — brand-wide or long-term strategy</option>
              <option value="Not sure">Not sure — let’s talk through it</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/70">Project details</label>
          <textarea
            rows={5}
            {...register("message")}
            className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-blue-500"
          />
          {errors.message && <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>}
        </div>

        {/* Hidden field + widget */}
        <input type="hidden" {...register("cfToken")} />
        <div ref={widgetRef} className="mt-2" />
        {errors.cfToken && (
          <p className="text-sm text-red-400 mt-1" aria-live="polite">
            {errors.cfToken.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-blue-500 px-5 py-2.5 font-medium text-white hover:bg-blue-400 transition disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>

        {sent === "ok" && <p className="text-emerald-400 text-sm mt-2">Thanks! We’ll be in touch shortly.</p>}
        {sent === "err" && <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>}
      </form>
    </>
  );
}