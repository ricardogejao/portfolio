/* SmartHome+ login flow — individual screens
 *
 * Each screen is a self-contained component that takes a router prop bag
 * and renders inside the iOS device frame. All styling resolves to CDS
 * tokens; nothing here invents colors, type, or radii.
 */
(function () {
  const { useState, useEffect, useRef } = React;
  const { Button, TextInputField, Checkbox, FeedbackCaption, Banner } = window;

  /* ── Screen chrome ──────────────────────────────────────────────── */

  // Soft, brand-tinted hero block used on the welcome screen.
  function WelcomeHero() {
    return (
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: "var(--radius-xlarge)",
        background:
          "radial-gradient(120% 80% at 20% 0%, var(--color-primary-light) 0%, var(--color-primary-pure) 55%, var(--color-primary-dark) 100%)",
        overflow: "hidden",
        boxShadow: "var(--elevation-level2)",
      }}>
        {/* abstract concentric arcs — a "house listening" motif */}
        <svg viewBox="0 0 360 360" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.85 }} aria-hidden="true">
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[180, 230, 280].map((r, i) => (
            <circle key={r} cx="180" cy="260" r={r} fill="none" stroke="#fff" strokeOpacity={0.18 - i*0.04} strokeWidth="1.5"/>
          ))}
          {/* house outline */}
          <path
            d="M180 130 L240 175 L240 245 L120 245 L120 175 Z"
            fill="rgba(255,255,255,0.08)"
            stroke="#fff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* door */}
          <rect x="166" y="200" width="28" height="45" rx="4" fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth="1.5"/>
          {/* signal arcs above roof */}
          <g transform="translate(180 130)" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M-22 -8 Q0 -28 22 -8" opacity="0.7"/>
            <path d="M-36 -2 Q0 -46 36 -2" opacity="0.45"/>
            <path d="M-50 4 Q0 -64 50 4" opacity="0.25"/>
          </g>
        </svg>
        {/* corner badge */}
        <div style={{
          position: "absolute", top: 16, left: 16,
          padding: "6px 10px",
          borderRadius: "var(--radius-full)",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "#fff",
          fontFamily: "var(--typo-interface-label-small-family)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>SmartHome+</div>
      </div>
    );
  }

  // Wordmark — uses the brand display font.
  function BrandMark({ size = 28 }) {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 2,
        fontFamily: "var(--brand-font-primary)",
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1,
        color: "var(--text-neutral-bolder)",
        letterSpacing: "-0.02em",
      }}>
        <span>SmartHome</span>
        <span style={{ color: "var(--text-primary)" }}>+</span>
      </div>
    );
  }

  // Plain back chevron used on inner screens.
  function BackBtn({ onClick }) {
    return (
      <button onClick={onClick} aria-label="Back" style={{
        width: 44, height: 44, padding: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "transparent", border: "none", cursor: "pointer",
        marginLeft: -10,
        color: "var(--text-neutral-bolder)",
      }}>
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
          <path d="M10 1L2 10L10 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  // Shared scrollable column used by every inner screen.
  function ScreenPad({ children, gap = 24, padTop = 56 }) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: `${padTop}px 24px 32px`,
        gap,
        boxSizing: "border-box",
        background: "var(--background-app)",
        overflow: "auto",
      }}>
        {children}
      </div>
    );
  }

  /* ── Social login row ───────────────────────────────────────────── */

  function SocialLogin({ onPick }) {
    const btn = (label, icon, key) => (
      <button
        key={key}
        onClick={() => onPick(key)}
        style={{
          flex: 1,
          height: 56,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "var(--background-app)",
          border: "var(--border-width-thin) solid var(--border-neutral)",
          borderRadius: "var(--radius-full)",
          color: "var(--text-neutral-bolder)",
          fontFamily: "var(--typo-component-button-large-family)",
          fontSize: "var(--typo-component-button-large-size)",
          fontWeight: "var(--typo-component-button-large-weight)",
          cursor: "pointer",
        }}>
        {icon}
        <span>{label}</span>
      </button>
    );
    return (
      <div style={{ display: "flex", gap: 12 }}>
        {btn("Apple", (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M14.84 10.69c.02 2.46 2.16 3.28 2.18 3.29-.02.06-.34 1.16-1.13 2.3-.68.99-1.39 1.97-2.51 1.99-1.1.02-1.45-.65-2.71-.65-1.26 0-1.65.63-2.69.67-1.08.04-1.9-1.07-2.59-2.05-1.4-2.02-2.47-5.71-1.03-8.2.71-1.24 1.99-2.02 3.38-2.04 1.06-.02 2.06.71 2.71.71.65 0 1.86-.88 3.13-.75.53.02 2.03.21 2.99 1.62-.08.05-1.79 1.04-1.77 3.11ZM12.83 4.6c.57-.7.96-1.66.85-2.61-.83.03-1.83.55-2.43 1.24-.53.61-1 1.59-.87 2.52.93.07 1.88-.47 2.45-1.15Z"/>
          </svg>
        ), "apple")}
        {btn("Google", (
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M19.6 10.23c0-.68-.06-1.34-.18-1.97H10v3.74h5.4a4.62 4.62 0 0 1-2 3.03v2.51h3.24c1.9-1.74 3-4.31 3-7.31Z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H1.07v2.59A10 10 0 0 0 10 20Z" fill="#34A853"/>
            <path d="M4.42 11.9a6 6 0 0 1 0-3.81V5.5H1.07a10 10 0 0 0 0 9l3.35-2.6Z" fill="#FBBC04"/>
            <path d="M10 3.97c1.47 0 2.79.51 3.83 1.5l2.87-2.87C14.96 1 12.7 0 10 0 6.1 0 2.73 2.24 1.07 5.5l3.35 2.59C5.2 5.73 7.4 3.97 10 3.97Z" fill="#EA4335"/>
          </svg>
        ), "google")}
      </div>
    );
  }

  /* ── Screen 1 · Welcome ─────────────────────────────────────────── */

  function WelcomeScreen({ go }) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 24px 32px",
        background: "var(--background-app)",
        boxSizing: "border-box",
      }}>
        <div style={{ marginBottom: 24 }}>
          <WelcomeHero/>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            fontFamily: "var(--typo-display-small-family)",
            fontSize: 34,
            lineHeight: 1.1,
            fontWeight: "var(--typo-display-small-weight, 400)",
            letterSpacing: "-0.02em",
            color: "var(--text-neutral-bolder)",
            textWrap: "balance",
          }}>
            Your home, <em style={{ fontStyle: "italic", color: "var(--text-primary)" }}>simply</em> connected.
          </div>
          <div style={{
            fontFamily: "var(--typo-body-large-regular-family)",
            fontSize: 16,
            lineHeight: 1.5,
            color: "var(--text-neutral)",
          }}>
            Cameras, locks, sensors, and scenes — one app, every room.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
          <Button emphasis="high" fullWidth onClick={() => go("signin")}>Sign in</Button>
          <Button emphasis="medBorderless" fullWidth onClick={() => go("create")}>Create an account</Button>
          <div style={{
            textAlign: "center",
            marginTop: 4,
            fontFamily: "var(--typo-body-small-regular-family)",
            fontSize: 12,
            color: "var(--text-neutral-subtle)",
            lineHeight: 1.5,
          }}>
            By continuing you accept the <span style={{ color: "var(--text-primary)", textDecoration: "underline" }}>Terms</span> &amp; <span style={{ color: "var(--text-primary)", textDecoration: "underline" }}>Privacy notice</span>.
          </div>
        </div>
      </div>
    );
  }

  /* ── Screen 2 · Sign in ─────────────────────────────────────────── */

  function SignInScreen({ go, tweaks, state, setState }) {
    const [showPw, setShowPw] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const emailValid = /\S+@\S+\.\S+/.test(state.email);
    const showError = tweaks.errors && state.attempted && (!emailValid || state.password.length < 6);

    function handleSubmit() {
      setState((s) => ({ ...s, attempted: true }));
      if (!emailValid || state.password.length < 6) return;
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        // Always route through 2FA → biometric → success
        go("otp");
      }, 900);
    }

    return (
      <ScreenPad>
        <BackBtn onClick={() => go("welcome")}/>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            fontFamily: "var(--typo-display-small-family)",
            fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.02em",
            color: "var(--text-neutral-bolder)",
          }}>Welcome back</div>
          <div style={{ fontSize: 15, color: "var(--text-neutral)", lineHeight: 1.5 }}>
            Sign in to keep an eye on home.
          </div>
        </div>

        {showError && (
          <Banner
            status="critical"
            type="small"
            headline="We couldn't sign you in"
            body={!emailValid ? "Check your email address and try again." : "That password looks too short. Use at least 6 characters."}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextInputField
            label="Email"
            placeholder="you@example.com"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value, attempted: false }))}
            caption={showError && !emailValid ? { status: "error", text: "Enter a valid email address." } : null}
            state={showError && !emailValid ? "active" : "enabled"}
          />

          <div style={{ position: "relative" }}>
            <TextInputField
              label="Password"
              placeholder="Enter password"
              value={state.password}
              onChange={(e) => setState((s) => ({ ...s, password: e.target.value, attempted: false }))}
              caption={showError && emailValid && state.password.length < 6 ? { status: "error", text: "Password must be at least 6 characters." } : null}
              state={showError && emailValid && state.password.length < 6 ? "active" : "enabled"}
            />
            {/* show / hide eye — sits above the input, doesn't change tabIndex */}
            <button onClick={() => setShowPw((v) => !v)} style={{
              position: "absolute", right: 14, top: 38,
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-neutral-subtle)", padding: 8,
              fontFamily: "var(--typo-interface-label-small-family)",
              fontSize: 13, fontWeight: 600,
            }}>{showPw ? "Hide" : "Show"}</button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Checkbox checked={state.remember} onChange={(v) => setState((s) => ({ ...s, remember: v }))} label="Stay signed in"/>
            <button onClick={() => go("forgot")} style={{
              background: "transparent", border: "none", padding: "8px 0", cursor: "pointer",
              color: "var(--text-primary)",
              fontFamily: "var(--typo-body-medium-regular-family)",
              fontSize: 14, fontWeight: 600,
            }}>Forgot password?</button>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <Button
          emphasis="high"
          fullWidth
          state={submitting ? "loading" : "enabled"}
          onClick={handleSubmit}
        >
          {submitting ? "Signing you in" : "Continue"}
        </Button>

        {tweaks.social && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-neutral-subtle)" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border-neutral-subtle)" }}/>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--border-neutral-subtle)" }}/>
            </div>
            <SocialLogin onPick={() => go("biometric")}/>
          </>
        )}
      </ScreenPad>
    );
  }

  /* ── Screen 3 · Forgot password ─────────────────────────────────── */

  function ForgotScreen({ go, state, setState }) {
    const [sending, setSending] = useState(false);
    function submit() {
      if (!/\S+@\S+\.\S+/.test(state.email)) return;
      setSending(true);
      setTimeout(() => { setSending(false); go("check_email"); }, 700);
    }
    return (
      <ScreenPad>
        <BackBtn onClick={() => go("signin")}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            fontFamily: "var(--typo-display-small-family)",
            fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.02em",
            color: "var(--text-neutral-bolder)",
          }}>Reset password</div>
          <div style={{ fontSize: 15, color: "var(--text-neutral)", lineHeight: 1.5 }}>
            We'll email you a link to set a new one.
          </div>
        </div>
        <TextInputField
          label="Email"
          placeholder="you@example.com"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
        />
        <div style={{ flex: 1 }}/>
        <Button emphasis="high" fullWidth state={sending ? "loading" : "enabled"} onClick={submit}>
          {sending ? "Sending" : "Send reset link"}
        </Button>
        <Button emphasis="lowGhost" fullWidth onClick={() => go("signin")}>Back to sign in</Button>
      </ScreenPad>
    );
  }

  function CheckEmailScreen({ go, state }) {
    return (
      <ScreenPad>
        <BackBtn onClick={() => go("forgot")}/>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 24, gap: 20 }}>
          <div style={{
            width: 96, height: 96, borderRadius: "var(--radius-full)",
            background: "var(--background-primary-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-primary)",
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M3.5 6.5L12 12.5L20.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              fontFamily: "var(--typo-display-small-family)",
              fontSize: 26, lineHeight: 1.15, letterSpacing: "-0.02em",
              color: "var(--text-neutral-bolder)",
            }}>Check your email</div>
            <div style={{ fontSize: 15, color: "var(--text-neutral)", lineHeight: 1.55, maxWidth: 280, margin: "0 auto" }}>
              We sent a reset link to <span style={{ color: "var(--text-neutral-bolder)", fontWeight: 600 }}>{state.email || "you@example.com"}</span>. The link expires in 15 minutes.
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        <Button emphasis="high" fullWidth onClick={() => go("signin")}>Open mail app</Button>
        <Button emphasis="lowGhost" fullWidth onClick={() => go("forgot")}>Resend link</Button>
      </ScreenPad>
    );
  }

  /* ── Screen 4 · OTP (2FA) ───────────────────────────────────────── */

  function OtpScreen({ go, tweaks, state, setState }) {
    const refs = useRef([]);
    const [submitting, setSubmitting] = useState(false);
    const digits = state.otp;
    const filled = digits.every((d) => d !== "");

    // Auto-error if all 6 are filled and not "123456" (only when errors tweak on)
    const isWrong = tweaks.errors && filled && digits.join("") !== "123456";

    function setDigit(i, v) {
      v = v.replace(/\D/g, "").slice(-1);
      const next = digits.slice();
      next[i] = v;
      setState((s) => ({ ...s, otp: next }));
      if (v && i < 5) refs.current[i + 1]?.focus();
    }

    function onKey(i, e) {
      if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    }

    function verify() {
      if (!filled || isWrong) return;
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); go("biometric"); }, 800);
    }

    // auto-verify when valid 123456 is typed
    useEffect(() => {
      if (filled && !isWrong) {
        const t = setTimeout(verify, 250);
        return () => clearTimeout(t);
      }
    }, [digits.join("")]);

    return (
      <ScreenPad>
        <BackBtn onClick={() => go("signin")}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            fontFamily: "var(--typo-display-small-family)",
            fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.02em",
            color: "var(--text-neutral-bolder)",
          }}>Enter your code</div>
          <div style={{ fontSize: 15, color: "var(--text-neutral)", lineHeight: 1.5 }}>
            We sent a 6-digit code to <span style={{ color: "var(--text-neutral-bolder)", fontWeight: 600 }}>{state.email || "you@example.com"}</span>.
          </div>
          {tweaks.errors && (
            <div style={{ marginTop: 4, fontSize: 12, color: "var(--text-neutral-subtle)" }}>
              Try <code style={{ background: "var(--background-neutral-subtle)", padding: "2px 6px", borderRadius: 4, color: "var(--text-neutral-bolder)" }}>123456</code> for the happy path.
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginTop: 8 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              style={{
                width: "100%", height: 64,
                textAlign: "center",
                fontFamily: "var(--typo-display-small-family)",
                fontSize: 28, fontWeight: 600,
                color: isWrong ? "var(--text-error)" : "var(--text-neutral-bolder)",
                background: "var(--background-app)",
                border: isWrong
                  ? "var(--border-width-thick) solid var(--border-error)"
                  : (d ? "var(--border-width-thick) solid var(--border-primary)" : "var(--border-width-thin) solid var(--border-neutral)"),
                borderRadius: "var(--radius-medium)",
                outline: "none",
                transition: "border-color 150ms ease",
              }}
            />
          ))}
        </div>

        {isWrong && (
          <FeedbackCaption status="error" text="That code didn't match. Try again or resend."/>
        )}

        <button onClick={() => setState((s) => ({ ...s, otp: ["","","","","",""] }))} style={{
          alignSelf: "flex-start",
          background: "transparent", border: "none", padding: "10px 0", cursor: "pointer",
          color: "var(--text-primary)",
          fontFamily: "var(--typo-body-medium-regular-family)",
          fontSize: 14, fontWeight: 600,
        }}>Resend code</button>

        <div style={{ flex: 1 }}/>

        <Button
          emphasis="high"
          fullWidth
          state={submitting ? "loading" : (filled && !isWrong ? "enabled" : "disabled")}
          onClick={verify}
        >
          {submitting ? "Verifying" : "Verify"}
        </Button>
      </ScreenPad>
    );
  }

  /* ── Screen 5 · Biometric prompt overlay ────────────────────────── */

  function BiometricScreen({ go, tweaks }) {
    const [phase, setPhase] = useState("scanning"); // scanning | success
    useEffect(() => {
      const t = setTimeout(() => setPhase("success"), 1800);
      const t2 = setTimeout(() => go("success"), 2600);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }, []);

    const isFace = tweaks.biometric === "face";

    return (
      <div style={{
        position: "relative",
        height: "100%",
        background: "var(--background-app)",
      }}>
        {/* dimmed background underneath */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, var(--background-app) 0%, var(--background-neutral-subtle) 100%)",
        }}/>

        {/* prompt sheet */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: 32, gap: 24, textAlign: "center",
        }}>
          {/* face id / touch id ring */}
          <div style={{
            width: 132, height: 132,
            borderRadius: "var(--radius-xlarge)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: phase === "success" ? "var(--background-success-subtle)" : "var(--background-primary-subtle)",
            color: phase === "success" ? "var(--text-success-bold)" : "var(--text-primary)",
            transition: "all 350ms ease",
            position: "relative",
          }}>
            {/* scanning ring */}
            {phase === "scanning" && (
              <div style={{
                position: "absolute", inset: -8,
                borderRadius: "calc(var(--radius-xlarge) + 8px)",
                border: "2px solid var(--border-primary)",
                opacity: 0.6,
                animation: "shp-pulse 1.4s ease-in-out infinite",
              }}/>
            )}
            {phase === "scanning" ? (
              isFace ? (
                /* Face ID glyph */
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M12 22V16a4 4 0 0 1 4-4h6M52 22V16a4 4 0 0 0-4-4h-6M12 42v6a4 4 0 0 0 4 4h6M52 42v6a4 4 0 0 1-4 4h-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                  <circle cx="25" cy="28" r="1.6" fill="currentColor"/>
                  <circle cx="39" cy="28" r="1.6" fill="currentColor"/>
                  <path d="M32 26V36H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24 42c2 2 5 3 8 3s6-1 8-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                /* Touch ID fingerprint */
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none">
                    <path d="M14 32c0-10 8-18 18-18s18 8 18 18v6"/>
                    <path d="M22 32c0-5.5 4.5-10 10-10s10 4.5 10 10v8"/>
                    <path d="M30 32c0-1.1.9-2 2-2s2 .9 2 2v12"/>
                    <path d="M22 44c0 3 1 5 2 7"/>
                    <path d="M42 38c0 4-2 8-4 11"/>
                    <path d="M14 40c0 4 2 8 4 10"/>
                  </g>
                </svg>
              )
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12.5L9.5 17L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{
              fontFamily: "var(--typo-display-small-family)",
              fontSize: 22, fontWeight: 600, color: "var(--text-neutral-bolder)",
            }}>
              {phase === "scanning"
                ? (isFace ? "Look at your phone" : "Touch the sensor")
                : "Recognised"}
            </div>
            <div style={{ fontSize: 14, color: "var(--text-neutral)", lineHeight: 1.5, maxWidth: 260 }}>
              {phase === "scanning"
                ? `Use ${isFace ? "Face ID" : "Touch ID"} to finish signing in.`
                : "Welcome back."}
            </div>
          </div>
        </div>

        {/* skip */}
        {phase === "scanning" && (
          <button onClick={() => go("success")} style={{
            position: "absolute", bottom: 56, left: 0, right: 0,
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-primary)", fontSize: 15, fontWeight: 600,
            padding: 12,
          }}>Use password instead</button>
        )}
      </div>
    );
  }

  /* ── Screen 6 · Success ─────────────────────────────────────────── */

  function SuccessScreen({ go }) {
    return (
      <div style={{
        height: "100%",
        background:
          "radial-gradient(120% 80% at 50% -20%, var(--color-primary-light) 0%, var(--color-primary-pure) 40%, var(--color-primary-dark) 100%)",
        color: "#fff",
        display: "flex", flexDirection: "column", padding: "56px 24px 32px",
        boxSizing: "border-box",
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{
            width: 96, height: 96, borderRadius: "var(--radius-full)",
            background: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.35)",
            animation: "shp-pop 480ms cubic-bezier(.2,.9,.3,1.4) both",
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5L9.5 17L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              fontFamily: "var(--typo-display-small-family)",
              fontSize: 32, lineHeight: 1.1, letterSpacing: "-0.02em",
              color: "#fff",
            }}>You're in.</div>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(255,255,255,0.82)", maxWidth: 260, margin: "0 auto" }}>
              Front door locked. 3 cameras online. Living room is set to <em>Evening</em>.
            </div>
          </div>
        </div>
        <Button emphasis="high" fullWidth onClick={() => go("home")}>Go to dashboard</Button>
      </div>
    );
  }

  /* ── Screen · Create account (light placeholder) ────────────────── */

  function CreateScreen({ go, state, setState }) {
    return (
      <ScreenPad>
        <BackBtn onClick={() => go("welcome")}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            fontFamily: "var(--typo-display-small-family)",
            fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.02em",
            color: "var(--text-neutral-bolder)",
          }}>Create an account</div>
          <div style={{ fontSize: 15, color: "var(--text-neutral)", lineHeight: 1.5 }}>
            Just three things to get going.
          </div>
        </div>
        <TextInputField label="Full name" placeholder="Alex Patel" value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}/>
        <TextInputField label="Email" placeholder="you@example.com" value={state.email} onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}/>
        <TextInputField label="Password" placeholder="At least 8 characters" value={state.password} onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))} hint="Use 8+ characters with a number." showHint/>

        <Checkbox checked={state.tos} onChange={(v) => setState((s) => ({ ...s, tos: v }))} label="I agree to the Terms and Privacy notice"/>

        <div style={{ flex: 1 }}/>
        <Button emphasis="high" fullWidth state={state.tos ? "enabled" : "disabled"} onClick={() => go("otp")}>Create account</Button>
        <Button emphasis="lowGhost" fullWidth onClick={() => go("signin")}>I already have an account</Button>
      </ScreenPad>
    );
  }

  // Keyframes used by biometric + success screens.
  if (!document.getElementById("shp-kf")) {
    const st = document.createElement("style");
    st.id = "shp-kf";
    st.textContent = `
      @keyframes shp-pulse {
        0%   { transform: scale(1);   opacity: 0.55; }
        50%  { transform: scale(1.06); opacity: 0.25; }
        100% { transform: scale(1);   opacity: 0.55; }
      }
      @keyframes shp-pop {
        0% { transform: scale(0.6); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(st);
  }

  Object.assign(window, {
    WelcomeScreen, SignInScreen, ForgotScreen, CheckEmailScreen,
    OtpScreen, BiometricScreen, SuccessScreen, CreateScreen, BrandMark,
  });
})();
