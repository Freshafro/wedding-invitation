"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { rsvpSchema } from "@/lib/validation";

type FieldErrors = Partial<Record<string, string>>;
type FormSubmitEvent = Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0];
type Locale = "en" | "fr";
type InviteLookup = {
  inviteCode: string;
  householdName: string;
  maxGuestsAllowed: number;
};

const initialForm = {
  inviteCode: "",
  fullName: "",
  attendance: "yes",
  guestCount: "1",
  additionalGuestNames: [] as string[],
  dietaryNotes: "",
  website: "",
};

export function RsvpForm({ locale = "en" }: { locale?: Locale }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [inviteLookup, setInviteLookup] = useState<InviteLookup | null>(null);
  const [isCheckingInvite, setIsCheckingInvite] = useState(false);
  const searchParams = useSearchParams();

  const maxGuestOptions = useMemo(() => inviteLookup?.maxGuestsAllowed ?? 10, [inviteLookup]);

  const guestCountOptions = useMemo(
    () => {
      if (form.attendance === "no") {
        return [
          <option value="0" key="guest-count-0">
            0
          </option>,
        ];
      }

      return Array.from({ length: maxGuestOptions }, (_, index) => {
        const value = index + 1;
        return (
          <option value={String(value)} key={`guest-count-${value}`}>
            {value}
          </option>
        );
      });
    },
    [form.attendance, maxGuestOptions]
  );

  const copy = useMemo(
    () => ({
      en: {
        kicker: "Guest Response",
        title: "RSVP",
        deadline: "Please send your response by July 1st, 2026.",
        inviteCode: "Invitation code *",
        inviteCodeHint: "Use the code included in your invitation email or link.",
        checkingCode: "Checking code...",
        inviteFoundPrefix: "Invitation found for",
        inviteLimitPrefix: "This invitation allows for up to",
        inviteLimitSuffix: "guest(s).",
        invalidCode: "Invitation code not found. Please check your email or code.",
        fullName: "Full name *",
        attendance: "Will you be able to attend? *",
        yesOption: "Yes, I will be able to attend",
        noOption: "No, I will not be able to attend",
        partySize: "Number of people in your party *",
        additionalGuestNames: "Full names of additional guests",
        additionalGuestLabel: "Additional guest",
        dietary: "Dietary notes",
        submit: "Submit your response",
        submitting: "Sending your response...",
        success: "Thank you! Your response has been sent.",
        serverError: "Something went wrong. Please try again.",
        networkError: "Could not send your response. Please try again in a moment.",
      },
      fr: {
        kicker: "Réponse des invites",
        title: "RSVP",
        deadline: "Merci de répondre avant le 1er juillet 2026.",
        inviteCode: "Code d'invitation *",
        inviteCodeHint: "Utilisez le code reçu dans votre email d'invitation.",
        checkingCode: "Vérification du code...",
        inviteFoundPrefix: "Invitation trouvée pour",
        inviteLimitPrefix: "Cette invitation permet jusqu'à",
        inviteLimitSuffix: "personne(s).",
        invalidCode: "Code d'invitation introuvable. Veuillez vérifier votre email/code.",
        fullName: "Nom complet *",
        attendance: "Serez-vous présent(e) ? *",
        yesOption: "Oui, avec plaisir",
        noOption: "Non, je ne pourrai pas être présent(e)",
        partySize: "Nombre de personnes *",
        additionalGuestNames: "Noms complet des personnes qui vous accompagnent",
        additionalGuestLabel: "Accompagnateur(trice)",
        dietary: "Restrictions alimentaires",
        submit: "Envoyer ma réponse",
        submitting: "Envoi de la réponse en cours...",
        success: "Merci! Votre réponse a bien été envoyée.",
        serverError: "Une erreur est survenue. Veuillez réessayer.",
        networkError: "Impossible d'envoyer votre réponse pour le moment. Veuillez réessayer.",
      },
    }),
    []
  );

  const t = copy[locale];
  const additionalGuestsCount =
    form.attendance === "yes" ? Math.max(0, Number.parseInt(form.guestCount, 10) - 1) : 0;

  useEffect(() => {
    setForm((prev) => {
      if (prev.additionalGuestNames.length === additionalGuestsCount) {
        return prev;
      }

      if (additionalGuestsCount === 0) {
        return { ...prev, additionalGuestNames: [] };
      }

      if (prev.additionalGuestNames.length < additionalGuestsCount) {
        const padding = Array.from(
          { length: additionalGuestsCount - prev.additionalGuestNames.length },
          () => ""
        );
        return {
          ...prev,
          additionalGuestNames: [...prev.additionalGuestNames, ...padding],
        };
      }

      return {
        ...prev,
        additionalGuestNames: prev.additionalGuestNames.slice(0, additionalGuestsCount),
      };
    });
  }, [additionalGuestsCount]);

  useEffect(() => {
    const code = searchParams.get("code") ?? "";
    if (!code) {
      return;
    }

    const normalized = code.trim().toUpperCase();
    setForm((prev) => (prev.inviteCode === normalized ? prev : { ...prev, inviteCode: normalized }));
  }, [searchParams]);

  useEffect(() => {
    const code = form.inviteCode.trim().toUpperCase();

    if (code.length < 3) {
      setInviteLookup(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsCheckingInvite(true);
      try {
        const response = await fetch(`/api/rsvp?code=${encodeURIComponent(code)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setInviteLookup(null);
          return;
        }

        const data = (await response.json()) as InviteLookup;
        setInviteLookup(data);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.inviteCode;
          return next;
        });

        setForm((prev) => {
          if (prev.attendance === "yes" && Number(prev.guestCount) > data.maxGuestsAllowed) {
            return { ...prev, guestCount: String(data.maxGuestsAllowed) };
          }
          return prev;
        });
      } catch {
        if (!controller.signal.aborted) {
          setInviteLookup(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingInvite(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [form.inviteCode]);

  const handleSubmit = async (event: FormSubmitEvent) => {
    event.preventDefault();
    setStatusMessage("");

    const parsed = rsvpSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    if (!inviteLookup) {
      setErrors((prev) => ({ ...prev, inviteCode: t.invalidCode }));
      return;
    }

    if (parsed.data.guestCount > inviteLookup.maxGuestsAllowed) {
      setErrors((prev) => ({
        ...prev,
        guestCount: `${t.inviteLimitPrefix} ${inviteLookup.maxGuestsAllowed} ${t.inviteLimitSuffix}`,
      }));
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatusMessage(data?.error ?? t.serverError);
        return;
      }

      setStatusMessage(t.success);
      setForm((prev) => ({
        ...initialForm,
        inviteCode: prev.inviteCode,
      }));
    } catch {
      setStatusMessage(t.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-6 rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-7 shadow-[0_14px_36px_rgba(51,44,48,0.12)]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{t.kicker}</p>
        <h2 className="font-display text-5xl leading-none">{t.title}</h2>
        <p className="inline-block rounded-xl border border-[var(--border-muted)] bg-white/70 px-3 py-2 text-sm leading-6">
          {t.deadline}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 sm:col-span-2">
          <span className="block text-sm font-medium">{t.inviteCode}</span>
          <input
            className="w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-2.5 font-semibold uppercase tracking-wide focus:outline-none"
            value={form.inviteCode}
            onChange={(e) => setForm((prev) => ({ ...prev, inviteCode: e.target.value.toUpperCase() }))}
            autoCapitalize="characters"
            autoCorrect="off"
          />
          <span className="text-xs">
            {isCheckingInvite
              ? t.checkingCode
              : inviteLookup
                ? `${t.inviteFoundPrefix} ${inviteLookup.householdName}. ${t.inviteLimitPrefix} ${inviteLookup.maxGuestsAllowed} ${t.inviteLimitSuffix}`
                : t.inviteCodeHint}
          </span>
          {errors.inviteCode ? <span className="text-xs">{errors.inviteCode}</span> : null}
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="block text-sm font-medium">{t.fullName}</span>
          <input
            className="w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-2.5 focus:outline-none"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
          />
          {errors.fullName ? <span className="text-xs">{errors.fullName}</span> : null}
        </label>

        <label className="space-y-1">
          <span className="block text-sm font-medium">{t.attendance}</span>
          <select
            className="w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-2.5 focus:outline-none"
            value={form.attendance}
            onChange={(e) => {
              const attendance = e.target.value;
              setForm((prev) => ({
                ...prev,
                attendance,
                guestCount: attendance === "yes" ? (prev.guestCount === "0" ? "1" : prev.guestCount) : "0",
              }));
            }}
          >
            <option value="yes">{t.yesOption}</option>
            <option value="no">{t.noOption}</option>
          </select>
          {errors.attendance ? <span className="text-xs">{errors.attendance}</span> : null}
        </label>

        <label className="space-y-1">
          <span className="block text-sm font-medium">{t.partySize}</span>
          <select
            className="w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-2.5 focus:outline-none"
            value={form.guestCount}
            onChange={(e) => setForm((prev) => ({ ...prev, guestCount: e.target.value }))}
            disabled={form.attendance === "no" || !inviteLookup}
          >
            {guestCountOptions}
          </select>
          {errors.guestCount ? <span className="text-xs">{errors.guestCount}</span> : null}
        </label>

        {additionalGuestsCount > 0 ? (
          <div className="space-y-2 sm:col-span-2">
            <span className="block text-sm font-medium">{t.additionalGuestNames}</span>
            <div className="grid gap-3">
              {form.additionalGuestNames.map((value, index) => (
                <label className="space-y-1" key={`additional-guest-${index}`}>
                  <span className="block text-xs font-medium uppercase tracking-[0.12em]">
                    {t.additionalGuestLabel} {index + 1} *
                  </span>
                  <input
                    className="w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-2.5 focus:outline-none"
                    value={value}
                    onChange={(e) =>
                      setForm((prev) => {
                        const nextNames = [...prev.additionalGuestNames];
                        nextNames[index] = e.target.value;
                        return { ...prev, additionalGuestNames: nextNames };
                      })
                    }
                  />
                </label>
              ))}
            </div>
            {errors.additionalGuestNames ? (
              <span className="text-xs">{errors.additionalGuestNames}</span>
            ) : null}
          </div>
        ) : null}

        <label className="space-y-1 sm:col-span-2">
          <span className="block text-sm font-medium">{t.dietary}</span>
          <textarea
            className="w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-2.5 focus:outline-none"
            rows={3}
            value={form.dietaryNotes}
            onChange={(e) => setForm((prev) => ({ ...prev, dietaryNotes: e.target.value }))}
          />
          {errors.dietaryNotes ? <span className="text-xs">{errors.dietaryNotes}</span> : null}
        </label>

        <label className="hidden" aria-hidden>
          Leave this field empty
          <input value={form.website} onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))} />
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl border border-[#332c30] bg-[#332c30] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? t.submitting : t.submit}
      </button>

      {statusMessage ? (
        <p className="text-sm">{statusMessage}</p>
      ) : null}
    </form>
  );
}
