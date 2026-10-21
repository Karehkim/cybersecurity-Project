import { useMemo, useState } from "react"
import { ZxcvbnFactory } from "@zxcvbn-ts/core"
import * as common from "@zxcvbn-ts/language-common"
import * as english from "@zxcvbn-ts/language-en"

const passwordEstimator = new ZxcvbnFactory({
    dictionary: {
        ...common.dictionary,
        ...english.dictionary,
    },
    graphs: common.adjacencyGraphs,
    translations: english.translations,
    useLevenshteinDistance: true,
})

type Finding = {
    title: string
    detail: string
}

const ratingStyles = [
    { label: "Weak", color: "#ef4444", soft: "#fff1f2" },
    { label: "Weak", color: "#ef4444", soft: "#fff1f2" },
    { label: "Fair", color: "#f59e0b", soft: "#fffbeb" },
    { label: "Strong", color: "#10b981", soft: "#ecfdf5" },
    { label: "Very strong", color: "#0f766e", soft: "#f0fdfa" },
]

const commonPasswords = [
    "password",
    "password123",
    "qwerty",
    "qwerty123",
    "123456",
    "12345678",
    "letmein",
    "welcome",
    "admin",
    "iloveyou",
]

function detectFindings(password: string): Finding[] {
    const findings: Finding[] = []
    const lower = password.toLowerCase()

    if (password.length < 12) {
        findings.push({
            title: "Too short",
            detail:
                "Longer passwords are significantly harder to guess. Aim for at least 12–16 characters.",
        })
    }

    if (commonPasswords.includes(lower)) {
        findings.push({
            title: "Common password",
            detail: "This password appears in lists attackers try first.",
        })
    }

    if (/(.)\1{2,}/i.test(password)) {
        findings.push({
            title: "Repeated characters",
            detail: "Runs of the same character create an easy-to-predict pattern.",
        })
    }

    if (
        /(1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwerty|asdf|zxcv)/i.test(
            password,
        )
    ) {
        findings.push({
            title: "Predictable sequence",
            detail:
                "Number, alphabet, and keyboard sequences are quickly recognized by cracking tools.",
        })
    }

    if (
        /(?:p[a@]ssw[o0]rd|[a@]dmin|w[e3]lc[o0]m[e3]|l[e3]tm[e3][i1]n)/i.test(
            password,
        ) &&
        !commonPasswords.includes(lower)
    ) {
        findings.push({
            title: "Predictable substitution",
            detail:
                "Replacing letters with similar symbols is a well-known pattern, not a strong disguise.",
        })
    }

    const classes = [
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length

    if (classes < 3 && password.length < 16) {
        findings.push({
            title: "Limited variety",
            detail:
                "Use a longer passphrase, or mix letters, numbers, and symbols in an unpredictable way.",
        })
    }

    return findings
}

function getSuggestions(
    password: string,
    findings: Finding[],
    librarySuggestions: string[],
) {
    const suggestions: string[] = []

    if (password.length < 16)
        suggestions.push(
            "Make it longer—four unrelated words can form a memorable passphrase.",
        )
    if (findings.some((finding) => finding.title.includes("sequence")))
        suggestions.push(
            "Replace sequences with unrelated words or randomly generated characters.",
        )
    if (findings.some((finding) => finding.title.includes("Common")))
        suggestions.push(
            "Avoid names, common phrases, and passwords used on other accounts.",
        )
    if (findings.some((finding) => finding.title.includes("Repeated")))
        suggestions.push(
            "Remove repeated runs and use a less predictable structure.",
        )

    suggestions.push(...librarySuggestions)
    suggestions.push(
        "Use a unique password for every account and store it in a password manager.",
    )

    return [...new Set(suggestions)].slice(0, 3)
}

function Icon({
    name,
    className = "h-5 w-5",
}: {
    name: "shield" | "eye" | "eye-off" | "lock" | "alert" | "arrow" | "check"
    className?: string
}) {
    const paths = {
        shield: (
            <path d="M12 3 4.8 6v5.1c0 4.6 3 8.8 7.2 9.9 4.2-1.1 7.2-5.3 7.2-9.9V6L12 3Z" />
        ),
        eye: (
            <>
                <path d="M2.5 12s3.3-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.3 5.5-9.5 5.5S2.5 12 2.5 12Z" />
                <circle cx="12" cy="12" r="2.5" />
            </>
        ),
        "eye-off": (
            <>
                <path d="m3 3 18 18M10.6 6.7c.5-.1.9-.2 1.4-.2 6.2 0 9.5 5.5 9.5 5.5a16 16 0 0 1-2.1 2.8M6.3 6.4C3.8 8 2.5 12 2.5 12s3.3 5.5 9.5 5.5c1.5 0 2.8-.3 3.9-.8M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            </>
        ),
        lock: (
            <>
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </>
        ),
        alert: (
            <>
                <path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4M12 17h.01" />
            </>
        ),
        arrow: <path d="m9 18 6-6-6-6" />,
        check: <path d="m5 12 4 4L19 6" />,
    }

    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    )
}

export default function App() {
    const [password, setPassword] = useState("")
    const [isVisible, setIsVisible] = useState(false)

    const analysis = useMemo(() => {
        if (!password) return null
        const result = passwordEstimator.check(password)
        const findings = detectFindings(password)
        const suggestions = getSuggestions(
            password,
            findings,
            result.feedback.suggestions,
        )
        return { result, findings, suggestions, style: ratingStyles[result.score] }
    }, [password])

    return (
        <main className="min-h-screen bg-[#f5f7f7] text-[#142b2b]">
            <header className="border-b border-[#dfe7e5] bg-white/90 backdrop-blur">
                <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8">
                    <a
                        href="#"
                        className="flex items-center gap-3"
                        aria-label="Password Check home"
                    >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#103f3c] text-white shadow-sm">
                            <Icon name="shield" className="h-[22px] w-[22px]" />
                        </span>
                        <span className="text-[17px] font-bold tracking-[-0.02em]">
                            Password Check
                        </span>
                    </a>
                    <div className="hidden items-center gap-2 rounded-full border border-[#d8e5e1] bg-[#f7fbfa] px-3.5 py-2 text-xs font-semibold text-[#35635f] sm:flex">
                        <span className="h-2 w-2 rounded-full bg-[#2da58d]" />
                        100% private &amp; local
                    </div>
                </div>
            </header>

            <section className="relative overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
                <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#d8eeea]/55 blur-[100px]" />
                <div className="relative mx-auto max-w-4xl">
                    <div className="mx-auto mb-10 max-w-2xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe1de] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#38716a] shadow-sm">
                            <Icon name="lock" className="h-3.5 w-3.5" />
                            Secure by design
                        </div>
                        <h1 className="text-balance text-[40px] font-bold leading-[1.08] tracking-[-0.045em] text-[#0e3331] sm:text-[56px]">
                            How strong is your password?
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#5b706e] sm:text-lg">
                            Get an instant, honest assessment—and practical advice to make
                            your password harder to guess.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-[28px] border border-[#dce5e3] bg-white shadow-[0_24px_70px_rgba(21,58,54,0.12)]">
                        <div className="p-6 sm:p-9">
                            <label
                                htmlFor="password"
                                className="mb-3 block text-sm font-bold text-[#1b3936]"
                            >
                                Enter a password to check
                            </label>
                            <div className="group relative">
                                <input
                                    id="password"
                                    type={isVisible ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="new-password"
                                    spellCheck={false}
                                    placeholder="Type or paste a password"
                                    className="h-16 w-full rounded-2xl border border-[#cbd9d6] bg-[#fbfcfc] px-5 pr-16 text-lg font-medium tracking-wide text-[#163633] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[#9aabaa] focus:border-[#26796e] focus:bg-white focus:ring-4 focus:ring-[#26796e]/10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsVisible((value) => !value)}
                                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-[#617875] transition hover:bg-[#edf4f2] hover:text-[#164b45] focus:outline-none focus:ring-2 focus:ring-[#26796e]/30"
                                    aria-label={isVisible ? "Hide password" : "Show password"}
                                >
                                    <Icon name={isVisible ? "eye-off" : "eye"} />
                                </button>
                            </div>

                            <div className="mt-5" aria-live="polite">
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 1, 2, 3].map((index) => {
                                        const activeSegments = analysis
                                            ? Math.max(1, analysis.result.score)
                                            : 0
                                        return (
                                            <div
                                                key={index}
                                                className="h-1.5 rounded-full transition-colors duration-300"
                                                style={{
                                                    backgroundColor:
                                                        index < activeSegments && analysis
                                                            ? analysis.style.color
                                                            : "#e4eae9",
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                                <div className="mt-3 flex min-h-6 items-center justify-between gap-4">
                                    <span className="text-xs text-[#768986]">
                                        {password
                                            ? `${password.length} characters`
                                            : "Your password never leaves this device"}
                                    </span>
                                    {analysis && (
                                        <span
                                            className="text-sm font-extrabold"
                                            style={{ color: analysis.style.color }}
                                        >
                                            {analysis.style.label}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {!analysis ? (
                                <div className="mt-8 grid min-h-[226px] place-items-center rounded-2xl border border-dashed border-[#cfddda] bg-[#f8faf9] p-8 text-center">
                                    <div>
                                        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e8f2f0] text-[#3c756e]">
                                            <Icon name="shield" />
                                        </span>
                                        <p className="mt-4 font-bold text-[#294744]">
                                            Your results will appear here
                                        </p>
                                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#70827f]">
                                            Start typing to see your strength rating, detected
                                            weaknesses, and recommendations.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                                    <div
                                        className="rounded-2xl border p-5"
                                        style={{
                                            backgroundColor: analysis.style.soft,
                                            borderColor: `${analysis.style.color}30`,
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6f827f]">
                                                    Strength
                                                </p>
                                                <p
                                                    className="mt-1 text-2xl font-extrabold"
                                                    style={{ color: analysis.style.color }}
                                                >
                                                    {analysis.style.label}
                                                </p>
                                            </div>
                                            <span
                                                className="grid h-11 w-11 place-items-center rounded-xl text-white"
                                                style={{ backgroundColor: analysis.style.color }}
                                            >
                                                <Icon
                                                    name={analysis.result.score >= 3 ? "check" : "alert"}
                                                />
                                            </span>
                                        </div>
                                        <div className="mt-8 border-t border-black/8 pt-4">
                                            <p className="text-xs font-semibold text-[#6f827f]">
                                                Estimated time to crack
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-[#264744]">
                                                {
                                                    analysis.result.crackTimes
                                                        .offlineSlowHashingXPerSecond.display
                                                }
                                                <span className="font-normal text-[#71827f]">
                                                    {" "}
                                                    in a slow offline attack
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-[#e0e7e5] bg-white p-5">
                                        <p className="text-sm font-extrabold text-[#253f3d]">
                                            {analysis.findings.length
                                                ? "What makes it guessable"
                                                : "Looking good"}
                                        </p>
                                        <div className="mt-3 space-y-3">
                                            {analysis.findings.length ? (
                                                analysis.findings.slice(0, 2).map((finding) => (
                                                    <div key={finding.title} className="flex gap-3">
                                                        <span className="mt-0.5 text-[#dd6b55]">
                                                            <Icon name="alert" className="h-4 w-4" />
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#3a4e4c]">
                                                                {finding.title}
                                                            </p>
                                                            <p className="mt-0.5 text-xs leading-5 text-[#758582]">
                                                                {finding.detail}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex gap-3">
                                                    <span className="mt-0.5 text-[#168b75]">
                                                        <Icon name="check" className="h-4 w-4" />
                                                    </span>
                                                    <p className="text-sm leading-6 text-[#607572]">
                                                        No obvious common patterns or repeated sequences
                                                        were detected.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {analysis && (
                            <div className="border-t border-[#e4eae8] bg-[#f8faf9] px-6 py-6 sm:px-9">
                                <p className="text-sm font-extrabold text-[#253f3d]">
                                    Ways to improve it
                                </p>
                                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                                    {analysis.suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion}
                                            className="flex items-start gap-2.5 text-xs leading-5 text-[#5e7471]"
                                        >
                                            <span className="mt-0.5 text-[#2b7e74]">
                                                <Icon name="arrow" className="h-4 w-4" />
                                            </span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mx-auto mt-7 flex max-w-xl items-start justify-center gap-3 text-center text-xs leading-5 text-[#6c7e7b]">
                        <Icon
                            name="lock"
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#397169]"
                        />
                        <p>
                            Analysis happens entirely in your browser. We never store, log, or
                            transmit what you type.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
