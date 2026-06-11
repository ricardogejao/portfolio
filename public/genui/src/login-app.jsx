/* SmartHome+ login flow — app shell.
 *
 * Mounts the iOS device frame, manages the screen router, and wires
 * up the brand/platform Tweaks panel. All visuals route through CDS
 * tokens so a brand swap re-skins the entire flow without touching
 * any markup.
 */
(function () {
  const { useState, useEffect } = React;
  const {
    IOSStatusBar,
    WelcomeScreen, SignInScreen, ForgotScreen, CheckEmailScreen,
    OtpScreen, BiometricScreen, SuccessScreen, CreateScreen,
    HomeScreen,
    BrandMark,
    TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle,
  } = window;

  const SCREEN_ORDER = [
    "welcome",
    "create",
    "signin",
    "forgot",
    "check_email",
    "otp",
    "biometric",
    "success",
    "home",
  ];
  const SCREEN_LABEL = {
    welcome: "Welcome",
    create:  "Create account",
    signin:  "Sign in",
    forgot:  "Reset password",
    check_email: "Check email",
    otp:     "2-step verify",
    biometric: "Biometric",
    success: "Signed in",
    home:    "Home dashboard",
  };

  /* Apply brand + platform tokens by setting <html> attrs + calling
     the loader. Loader handles link.href swapping. */
  function applyTheme(brand, platform) {
    const root = document.documentElement;
    root.dataset.brand = brand;
    root.dataset.platform = platform;
    window.swapTokens && window.swapTokens(brand, platform);
  }

  /* Map our 8 screens to <section> renderers, plus a router prop bag. */
  function Router({ screen, setScreen, tweaks, form, setForm }) {
    const go = setScreen;
    const props = { go, tweaks, state: form, setState: setForm };
    switch (screen) {
      case "welcome":    return <WelcomeScreen {...props}/>;
      case "create":     return <CreateScreen {...props}/>;
      case "signin":     return <SignInScreen {...props}/>;
      case "forgot":     return <ForgotScreen {...props}/>;
      case "check_email":return <CheckEmailScreen {...props}/>;
      case "otp":        return <OtpScreen {...props}/>;
      case "biometric":  return <BiometricScreen {...props}/>;
      case "success":    return <SuccessScreen {...props}/>;
      case "home":       return <HomeScreen tweaks={{ ...tweaks, alert: false, ai: true }} onSignOut={() => go("welcome")}/>;
      default:           return <WelcomeScreen {...props}/>;
    }
  }

  /* The phone frame: status bar + screen area + home indicator.
     This is a simplified iPhone shell tuned to the login surface.
     Uses CDS IOSStatusBar from frames/ios-frame.jsx. */
  function Phone({ children, screen }) {
    const isDark = screen === "success";
    return (
      <div
        data-screen-label={`Phone · ${SCREEN_LABEL[screen] || screen}`}
        style={{
          width: 390, height: 844,
          borderRadius: 54,
          position: "relative",
          overflow: "hidden",
          background: isDark ? "var(--color-primary-dark)" : "var(--background-app)",
          boxShadow:
            "0 50px 110px rgba(0,0,0,0.18), 0 0 0 8px #0a0a0a, 0 0 0 9px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.12)",
          fontFamily: "var(--platform-font-default, var(--platform-font))",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          transition: "background 400ms ease",
        }}
      >
        {/* dynamic island */}
        <div style={{
          position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)",
          width: 122, height: 36, borderRadius: 22, background: "#000", zIndex: 50,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
        }}/>
        {/* status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
          <IOSStatusBar dark={isDark}/>
        </div>
        {/* content */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
        }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{
          position: "absolute", bottom: 8, left: 0, right: 0,
          display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 60,
        }}>
          <div style={{
            width: 134, height: 5, borderRadius: 100,
            background: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.3)",
          }}/>
        </div>
      </div>
    );
  }

  /* Subtle progress dots below the phone so reviewers know where they
     are in the flow without showing the chrome inside the phone. */
  function FlowDots({ screen, setScreen }) {
    const visible = SCREEN_ORDER.filter((s) => s !== "create");
    const order = visible.includes(screen) ? visible : ["welcome", ...visible];
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginTop: 28, justifyContent: "center",
      }}>
        {order.map((s) => {
          const active = s === screen;
          return (
            <button
              key={s}
              onClick={() => setScreen(s)}
              title={SCREEN_LABEL[s]}
              style={{
                background: "transparent", border: "none", cursor: "pointer", padding: 4,
              }}
            >
              <div style={{
                width: active ? 32 : 8, height: 8, borderRadius: 999,
                background: active
                  ? "var(--background-primary)"
                  : "var(--border-neutral-bold, rgba(0,0,0,0.2))",
                transition: "width 250ms ease, background 250ms ease",
              }}/>
            </button>
          );
        })}
      </div>
    );
  }

  function FlowLabel({ screen }) {
    return (
      <div style={{
        marginTop: 12, textAlign: "center",
        fontFamily: "var(--platform-font-default, var(--platform-font))",
        fontSize: 13, color: "rgba(0,0,0,0.5)", letterSpacing: "0.02em",
      }}>
        {SCREEN_LABEL[screen] || ""}
      </div>
    );
  }

  /* ── Tweaks ─────────────────────────────────────────────────────── */

  function Tweaks({ tweaks, setTweak }) {
    return (
      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand">
          <TweakRadio
            label="System"
            value={tweaks.brand}
            options={[{ value: "telus", label: "TELUS" }, { value: "homi", label: "Homi" }]}
            onChange={(v) => setTweak("brand", v)}
          />
          <TweakRadio
            label="Platform"
            value={tweaks.platform}
            options={[{ value: "ios", label: "iOS" }, { value: "android", label: "Android" }, { value: "web", label: "Web" }]}
            onChange={(v) => setTweak("platform", v)}
          />
        </TweakSection>
        <TweakSection label="Sign in">
          <TweakToggle label="Social sign-in" value={tweaks.social} onChange={(v) => setTweak("social", v)}/>
          <TweakToggle label="Show error states" value={tweaks.errors} onChange={(v) => setTweak("errors", v)}/>
          <TweakRadio
            label="Biometric"
            value={tweaks.biometric}
            options={[{ value: "face", label: "Face ID" }, { value: "touch", label: "Touch ID" }]}
            onChange={(v) => setTweak("biometric", v)}
          />
        </TweakSection>
      </TweaksPanel>
    );
  }

  /* ── App ────────────────────────────────────────────────────────── */

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "brand": "telus",
    "platform": "ios",
    "social": true,
    "errors": true,
    "biometric": "face"
  }/*EDITMODE-END*/;

  function App() {
    const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [screen, setScreen] = useState("welcome");
    const [form, setForm] = useState({
      email: "",
      password: "",
      name: "",
      remember: true,
      tos: false,
      attempted: false,
      otp: ["", "", "", "", "", ""],
    });

    // Reset form state when bouncing back to welcome.
    useEffect(() => {
      if (screen === "welcome") {
        setForm((f) => ({ ...f, otp: ["","","","","",""], attempted: false }));
      }
    }, [screen]);

    useEffect(() => {
      applyTheme(tweaks.brand, tweaks.platform);
    }, [tweaks.brand, tweaks.platform]);

    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "48px 24px 80px",
        background:
          "linear-gradient(180deg, var(--color-primary-lighter) 0%, var(--background-app) 38%, var(--background-app) 100%)",
        transition: "background 400ms ease",
        boxSizing: "border-box",
      }}>
        {/* Header strip */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", maxWidth: 1080, marginBottom: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BrandMark size={24}/>
            <div style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: "var(--background-neutral-subtle)",
              color: "var(--text-neutral)",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--platform-font-default, var(--platform-font))",
            }}>Sign in · {tweaks.brand === "telus" ? "TELUS" : "Homi"}</div>
          </div>
          <div style={{
            display: "flex", gap: 8,
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 12, color: "var(--text-neutral-subtle)",
          }}>
            <span>v1.0 · CDS</span>
          </div>
        </header>

        {/* Phone */}
        <Phone screen={screen}>
          <Router screen={screen} setScreen={setScreen} tweaks={tweaks} form={form} setForm={setForm}/>
        </Phone>

        <FlowDots screen={screen} setScreen={setScreen}/>
        <FlowLabel screen={screen}/>

        {/* Hint */}
        <div style={{
          marginTop: 32, padding: "10px 16px",
          borderRadius: "var(--radius-full)",
          background: "var(--background-neutral-subtle)",
          color: "var(--text-neutral)",
          fontSize: 13, lineHeight: 1.4,
          fontFamily: "var(--platform-font-default, var(--platform-font))",
        }}>
          Try the flow live — type anything, hit Continue. Toggle <strong>Tweaks</strong> for brand &amp; biometric.
        </div>

        <Tweaks tweaks={tweaks} setTweak={setTweak}/>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
})();
