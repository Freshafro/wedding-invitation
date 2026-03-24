"use client";

import { useEffect, useMemo, useState } from "react";
import { rsvpSchema } from "@/lib/validation";

type FieldErrorCode =
  | "validationInviteCode"
  | "validationFullName"
  | "validationAttendance"
  | "validationGuestCount"
  | "validationAdditionalGuests"
  | "invalidCode"
  | "inviteLimit"
  | "serverError";

type FieldError = {
  code: FieldErrorCode;
  maxGuestsAllowed?: number;
};

type FieldErrors = Partial<Record<string, FieldError>>;
type FormSubmitEvent = Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0];
type Locale = "en" | "fr";
type StatusCode = "success" | "serverError" | "networkError" | "rateLimitError" | "invalidCode";
type InviteLookup = {
  inviteCode: string;
  householdName: string;
  maxGuestsAllowed: number;
};

const initialForm = {
  inviteCode: "",
  fullName: "",
  attendance: "yes",
  guestCount: "",
  additionalGuestNames: [] as string[],
  dietaryNotes: "",
  website: "",
};

const INVITE_CODE_SESSION_KEY = "inviteCode";

export function RsvpForm({
  locale = "en",
  maxPeoplePerInvitationMessage,
  showHeader = true,
}: {
  locale?: Locale;
  maxPeoplePerInvitationMessage?: React.ReactNode;
  showHeader?: boolean;
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusCode, setStatusCode] = useState<StatusCode | "">("");
  const [inviteLookup, setInviteLookup] = useState<InviteLookup | null>(null);
  const [isCheckingInvite, setIsCheckingInvite] = useState(false);

  const maxGuestOptions = useMemo(() => inviteLookup?.maxGuestsAllowed ?? 10, [inviteLookup]);

  const copy = useMemo(
    () => ({
      en: {
        kicker: "Guest Response",
        title: "RSVP",
        thankYouTitle: "Thank you!",
        thankYouMessage:
          "Your response has been received successfully. We are so excited to celebrate with you.",
        inviteCode: "Invitation code",
        inviteCodeHint: "Use the code included in your invitation email or link. ",
        checkingCode: "Checking code...",
        inviteFoundPrefix: "Invitation found for",
        inviteLimitPrefix: "This invitation allows for up to",
        inviteLimitSuffix: "guest(s).",
        invalidCode: "Invitation code not found. Please check your email or code.",
        fullName: "Full name",
        attendance: "Will you be able to attend?",
        yesOption: "Yes, I will be able to attend",
        noOption: "No, I will not be able to attend",
        partySize: "Number of people",
        additionalGuestNames: "Full names of additional guests",
        additionalGuestLabel: "Additional guest",
        dietary: "Dietary notes",
        submit: "Submit your response",
        submitting: "Sending your response...",
        success: "Thank you! Your response has been sent.",
        serverError: "Something went wrong. Please try again.",
        networkError: "Could not send your response. Please try again in a moment.",
        rateLimitError: "Please wait a moment before sending another RSVP.",
        validationInviteCode: "Please enter your invitation code.",
        validationFullName: "Please enter your full name.",
        validationAttendance: "Please select whether you can attend.",
        validationGuestCount: "Please choose a valid number of guests.",
        validationAdditionalGuests: "Please complete all additional guest names.",
      },
      fr: {
        kicker: "Réponse des invités",
        title: "RSVP",
        thankYouTitle: "Merci!",
        thankYouMessage:
          "Votre réponse a bien été reçue.",
        inviteCode: "Code d'invitation",
        inviteCodeHint: "Utilisez le code reçu dans votre courriel d'invitation. ",
        checkingCode: "Vérification du code...",
        inviteFoundPrefix: "Invitation trouvée pour",
        inviteLimitPrefix: "Cette invitation permet jusqu'à",
        inviteLimitSuffix: "personne(s).",
        invalidCode: "Code d'invitation introuvable. Veuillez vérifier votre courriel ou votre code.",
        fullName: "Nom complet",
        attendance: "Serez-vous présent(e) ?",
        yesOption: "Oui, avec plaisir",
        noOption: "Non, je ne pourrai pas être présent(e)",
        partySize: "Nombre de personnes",
        additionalGuestNames: "Noms complets des personnes qui vous accompagnent",
        additionalGuestLabel: "Accompagnateur(trice)",
        dietary: "Restrictions alimentaires",
        submit: "Envoyer ma réponse",
        submitting: "Envoi de la réponse en cours...",
        success: "Merci! Votre réponse a bien été envoyée.",
        serverError: "Une erreur est survenue. Veuillez réessayer.",
        networkError: "Impossible d'envoyer votre réponse pour le moment. Veuillez réessayer.",
        rateLimitError: "Veuillez patienter un moment avant d'envoyer une autre réponse.",
        validationInviteCode: "Veuillez saisir votre code d'invitation.",
        validationFullName: "Veuillez saisir votre nom complet.",
        validationAttendance: "Veuillez indiquer si vous serez présent(e).",
        validationGuestCount: "Veuillez sélectionner un nombre de personnes valide.",
        validationAdditionalGuests: "Veuillez compléter les noms des personnes accompagnatrices.",
      },
    }),
    []
  );

  const t = copy[locale];
  const errorTextClass = "text-sm leading-5 text-red-600";
  const requiredMarkClass = "ml-0.5 relative -top-[2px] text-[0.72em] leading-none";
  const fieldControlClass =
    "w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-2.5 text-base leading-6 transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/35 focus-visible:ring-offset-1 focus:border-[#332c30]/50";
  const parsedGuestCount = Number.parseInt(form.guestCount, 10);
  const additionalGuestsCount =
    form.attendance === "yes" && Number.isFinite(parsedGuestCount)
      ? Math.max(0, parsedGuestCount - 1)
      : 0;
  const guestCountOptions = useMemo(
    () => {
      if (!form.attendance) {
        return [
          <option value="" key="guest-count-placeholder">
            {""}
          </option>,
        ];
      }

      if (form.attendance === "no") {
        return [
          <option value="0" key="guest-count-0">
            0
          </option>,
        ];
      }

      return [
        <option value="" key="guest-count-placeholder">
          {""}
        </option>,
        ...Array.from({ length: maxGuestOptions }, (_, index) => {
          const value = index + 1;
          return (
            <option value={String(value)} key={`guest-count-${value}`}>
              {value}
            </option>
          );
        }),
      ];
    },
    [form.attendance, maxGuestOptions]
  );

  const getValidationErrorCode = (field: string): FieldErrorCode => {
    switch (field) {
      case "inviteCode":
        return "validationInviteCode";
      case "fullName":
        return "validationFullName";
      case "attendance":
        return "validationAttendance";
      case "guestCount":
        return "validationGuestCount";
      case "additionalGuestNames":
        return "validationAdditionalGuests";
      default:
        return "serverError";
    }
  };

  const getFieldErrorMessage = (error: FieldError) => {
    switch (error.code) {
      case "validationInviteCode":
        return t.validationInviteCode;
      case "validationFullName":
        return t.validationFullName;
      case "validationAttendance":
        return t.validationAttendance;
      case "validationGuestCount":
        return t.validationGuestCount;
      case "validationAdditionalGuests":
        return t.validationAdditionalGuests;
      case "invalidCode":
        return t.invalidCode;
      case "inviteLimit":
        return `${t.inviteLimitPrefix} ${error.maxGuestsAllowed ?? 0} ${t.inviteLimitSuffix}`;
      case "serverError":
      default:
        return t.serverError;
    }
  };

  const getStatusMessage = (code: StatusCode) => {
    switch (code) {
      case "success":
        return t.success;
      case "serverError":
        return t.serverError;
      case "networkError":
        return t.networkError;
      case "rateLimitError":
        return t.rateLimitError;
      case "invalidCode":
      default:
        return t.invalidCode;
    }
  };

  const isSuccessStatus = statusCode === "success";
  const getFieldControlClass = (hasError: boolean) =>
    `${fieldControlClass} ${hasError ? "border-red-500 focus-visible:ring-red-200 focus:border-red-500" : ""}`;

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
    const urlCode = new URLSearchParams(window.location.search).get("code") ?? "";
    const storedCode = window.sessionStorage.getItem(INVITE_CODE_SESSION_KEY) ?? "";
    const code = (urlCode || storedCode).trim().toUpperCase();
    if (!code) {
      return;
    }

    window.sessionStorage.setItem(INVITE_CODE_SESSION_KEY, code);
    setForm((prev) => (prev.inviteCode === code ? prev : { ...prev, inviteCode: code }));
  }, []);

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
    setStatusCode("");

    const parsed = rsvpSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = { code: getValidationErrorCode(field) };
        }
      }
      setErrors(nextErrors);
      return;
    }

    if (!inviteLookup) {
      setErrors((prev) => ({ ...prev, inviteCode: { code: "invalidCode" } }));
      return;
    }

    if (parsed.data.guestCount > inviteLookup.maxGuestsAllowed) {
      setErrors((prev) => ({
        ...prev,
        guestCount: {
          code: "inviteLimit",
          maxGuestsAllowed: inviteLookup.maxGuestsAllowed,
        },
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
        if (response.status === 429) {
          setStatusCode("rateLimitError");
        } else if (response.status === 400 && typeof data?.error === "string") {
          if (data.error.includes("Invitation code not found")) {
            setStatusCode("invalidCode");
          } else {
            setStatusCode("serverError");
          }
        } else {
          setStatusCode("serverError");
        }
        return;
      }

      setStatusCode("success");
      setForm((prev) => ({
        ...initialForm,
        inviteCode: prev.inviteCode,
      }));
    } catch {
      setStatusCode("networkError");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccessStatus) {
    return (
      <div className="space-y-4 rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-6 text-center shadow-[0_14px_36px_rgba(51,44,48,0.12)] sm:p-7">
        <h2 className="font-display text-4xl leading-none sm:text-5xl">{t.thankYouTitle}</h2>
        <p className="mx-auto max-w-prose text-lg leading-8 sm:text-xl">{t.thankYouMessage}</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-6 rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-6 shadow-[0_14px_36px_rgba(51,44,48,0.12)] sm:space-y-7 sm:p-7"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      {showHeader ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.12em]">{t.kicker}</p>
          <h2 className="font-display text-4xl leading-none sm:text-5xl">{t.title}</h2>
        </div>
      ) : maxPeoplePerInvitationMessage ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.12em]">{t.kicker}</p>
          <p className="font-display w-full text-justify text-sm leading-none sm:text-left sm:text-base">
            {maxPeoplePerInvitationMessage}
          </p>
        </div>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5c5358]">{t.kicker}</p>
      )}

      {showHeader && maxPeoplePerInvitationMessage ? (
        <p className="font-display w-full text-justify text-sm leading-none sm:text-left sm:text-base">
          {maxPeoplePerInvitationMessage}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 sm:col-span-2">
          <span className="block text-base font-medium">
            {t.inviteCode}
            <span aria-hidden className={requiredMarkClass}>
              *
            </span>
          </span>
          <input
            className={`${getFieldControlClass(Boolean(errors.inviteCode))} lining-nums tabular-nums uppercase tracking-wide`}
            value={form.inviteCode}
            onChange={(e) => setForm((prev) => ({ ...prev, inviteCode: e.target.value.toUpperCase() }))}
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(errors.inviteCode)}
          />
          <span className="text-sm leading-5 text-[#4a4146]" aria-live="polite">
            {isCheckingInvite
              ? t.checkingCode
              : inviteLookup
                ? `${t.inviteFoundPrefix} ${inviteLookup.householdName}. ${t.inviteLimitPrefix} ${inviteLookup.maxGuestsAllowed} ${t.inviteLimitSuffix}`
                : t.inviteCodeHint}
          </span>
          {errors.inviteCode ? (
            <span className={errorTextClass} role="alert">
              {getFieldErrorMessage(errors.inviteCode)}
            </span>
          ) : null}
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="block text-base font-medium">
            {t.fullName}
            <span aria-hidden className={requiredMarkClass}>
              *
            </span>
          </span>
          <input
            className={getFieldControlClass(Boolean(errors.fullName))}
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName ? (
            <span className={errorTextClass} role="alert">
              {getFieldErrorMessage(errors.fullName)}
            </span>
          ) : null}
        </label>

        <label className="space-y-1">
          <span className="block text-base font-medium">
            {t.attendance}
            <span aria-hidden className={requiredMarkClass}>
              *
            </span>
          </span>
          <select
            className={getFieldControlClass(Boolean(errors.attendance))}
            value={form.attendance}
            onChange={(e) => {
              const attendance = e.target.value;
              setForm((prev) => ({
                ...prev,
                attendance,
                guestCount:
                  attendance === "yes"
                    ? prev.guestCount === "0"
                      ? ""
                      : prev.guestCount
                    : attendance === "no"
                      ? "0"
                      : "",
              }));
            }}
            aria-invalid={Boolean(errors.attendance)}
          >
            <option value="">{""}</option>
            <option value="yes">{t.yesOption}</option>
            <option value="no">{t.noOption}</option>
          </select>
          {errors.attendance ? (
            <span className={errorTextClass} role="alert">
              {getFieldErrorMessage(errors.attendance)}
            </span>
          ) : null}
        </label>

        <label className="space-y-1">
          <span className="block text-base font-medium">
            {t.partySize}
            <span aria-hidden className={requiredMarkClass}>
              *
            </span>
          </span>
          <select
            className={getFieldControlClass(Boolean(errors.guestCount))}
            value={form.guestCount}
            onChange={(e) => setForm((prev) => ({ ...prev, guestCount: e.target.value }))}
            disabled={form.attendance !== "yes" || !inviteLookup}
            aria-invalid={Boolean(errors.guestCount)}
          >
            {guestCountOptions}
          </select>
          {errors.guestCount ? (
            <span className={errorTextClass} role="alert">
              {getFieldErrorMessage(errors.guestCount)}
            </span>
          ) : null}
        </label>

        {additionalGuestsCount > 0 ? (
          <div className="space-y-2 sm:col-span-2">
            <span className="block text-base font-medium">{t.additionalGuestNames}</span>
            <div className="grid gap-3">
              {form.additionalGuestNames.map((value, index) => (
                <label className="space-y-1" key={`additional-guest-${index}`}>
                  <span className="block text-base font-medium">
                    {t.additionalGuestLabel} {index + 1}
                    <span aria-hidden className={requiredMarkClass}>
                      *
                    </span>
                  </span>
                  <input
                    className={getFieldControlClass(Boolean(errors.additionalGuestNames))}
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
              <span className={errorTextClass} role="alert">
                {getFieldErrorMessage(errors.additionalGuestNames)}
              </span>
            ) : null}
          </div>
        ) : null}

        <label className="space-y-1 sm:col-span-2">
          <span className="block text-base font-medium">{t.dietary}</span>
          <textarea
            className={getFieldControlClass(Boolean(errors.dietaryNotes))}
            rows={3}
            value={form.dietaryNotes}
            onChange={(e) => setForm((prev) => ({ ...prev, dietaryNotes: e.target.value }))}
            aria-invalid={Boolean(errors.dietaryNotes)}
          />
          {errors.dietaryNotes ? (
            <span className={errorTextClass} role="alert">
              {getFieldErrorMessage(errors.dietaryNotes)}
            </span>
          ) : null}
        </label>

        <label className="hidden" aria-hidden>
          Leave this field empty
          <input value={form.website} onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))} />
        </label>
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer rounded-xl border border-[#332c30] bg-[#332c30] px-4 py-3 text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? t.submitting : t.submit}
      </button>

      {statusCode ? (
        <p className={`text-sm font-medium ${isSuccessStatus ? "text-emerald-700" : "text-red-600"}`} aria-live="polite">
          {getStatusMessage(statusCode)}
        </p>
      ) : null}
    </form>
  );
}
