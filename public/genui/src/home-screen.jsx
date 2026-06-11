/* SmartHome+ home screen — v2 (Adaptive hero edition)
 *
 * Layout (scroll top → bottom, inside 390×844 phone shell):
 *   1. Hero (full-bleed gradient)
 *        ├ Status-bar spacer
 *        ├ Top nav  (greeting / property / + bell)
 *        ├ Central status block (orb · headline · subtitle · context pills)
 *        └ Arm strip (Arm Away · Arm Stay · Night)            — disarmed only
 *   2. Tip row (amber, one line)
 *   3. AI Assistant card  (insight + Set up / Not now)
 *   4. Routine chips      (Movie Night ✦ · Good Night ✦ · Away Mode ✦ · + New)
 *   5. Favorites (2-col grid)
 *   6. Cameras (horizontal scroll)
 *   7. Today at home (event list — adapts to security state)
 *   8. Midi bar (AI command input)
 *   9. Footer line
 *   10. Bottom navigation
 *
 * Hero variants:  disarmed  ·  armed-away  ·  alarm
 */
(function () {
  const { useState, useMemo } = React;
  const { Icon, DeviceTile, AppNav } = window;

  function CDSIcon({ name, size = 20, color = "currentColor" }) {
    if (!Icon || !name) return null;
    return <Icon name={name} size={size} color={color}/>;
  }

  /* ── HERO ────────────────────────────────────────────────────────── */

  /* Hero gradients — built from existing CDS color tokens only.
   * TELUS purple ramp: --color-brand-purple-{50..900}
   * Global blue ramp:  --color-global-blue-{50..900}
   * Global red ramp:   --color-global-red-{50..900}
   */
  const HERO_GRADIENT = {
    /* Case 01 / 06 — standard purple */
    disarmed:
      "linear-gradient(170deg, var(--color-brand-purple-500) 0%, var(--color-brand-purple-700) 55%, var(--color-brand-purple-800) 100%)",
    /* Case 02 — one step deeper purple, "bold" */
    "disarmed-deep":
      "linear-gradient(170deg, var(--color-brand-purple-700) 0%, var(--color-brand-purple-800) 55%, var(--color-brand-purple-900) 100%)",
    /* Case 05 — darkest purple, near-indigo, for night */
    "disarmed-night":
      "linear-gradient(170deg, var(--color-brand-purple-800) 0%, var(--color-brand-purple-900) 60%, var(--color-base-black) 100%)",
    /* Case 04 — lightest/subtle purple, "primary-subtle" feeling */
    "disarmed-subtle":
      "linear-gradient(170deg, var(--color-brand-purple-400) 0%, var(--color-brand-purple-600) 55%, var(--color-brand-purple-700) 100%)",
    /* Case 03 — navy, built from --color-global-blue ramp */
    "armed-away":
      "linear-gradient(170deg, var(--color-global-blue-700) 0%, var(--color-global-blue-800) 55%, var(--color-global-blue-900) 100%)",
    /* Alarm — built from --color-global-red ramp */
    alarm:
      "linear-gradient(170deg, var(--color-global-red-600) 0%, var(--color-global-red-700) 55%, var(--color-global-red-800) 100%)",
  };

  function Hero({ state, property, name, unread, onChangeProperty, scenario, hasCardOverlap }) {
    const sc = scenario || {};
    const armStrip = sc.armStrip === undefined ? "default" : sc.armStrip;
    const gradient = sc.heroTint && HERO_GRADIENT[sc.heroTint]
      ? HERO_GRADIENT[sc.heroTint]
      : (HERO_GRADIENT[state] || HERO_GRADIENT.disarmed);
    return (
      <div style={{
        position: "relative",
        background: gradient,
        color: "#fff",
        padding: hasCardOverlap ? "0 0 56px" : "0 0 16px",
        transition: "background 500ms ease",
      }}>
        {/* ambient green wash behind the status block */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(60% 45% at 50% 38%, rgba(126,224,161,0.12) 0%, rgba(126,224,161,0) 65%)",
        }}/>
        {/* status bar spacer + reduced top breathing room */}
        <div style={{ height: 56 }}/>

        <TopNav property={property} name={name} unread={unread} onChangeProperty={onChangeProperty} greeting={sc.greeting} dark/>

        {state === "disarmed"     && <CenterDisarmed scenario={sc}/>}
        {state === "armed-away"   && <CenterArmedAway scenario={sc}/>}
        {state === "alarm"        && <CenterAlarm/>}

        {state === "disarmed" && armStrip !== "none" && <ArmStrip emphasis={armStrip}/>}
      </div>
    );
  }

  /* ── Top nav inside hero ─────────────────────────────────────────── */

  /* ── FlatHeader (v10): flat, on page bg, no elevation, no gradient.
   *                   Merges top nav, state row, headline, and 2 metrics. */

  function FlatHeader({ property, name, unread, onChangeProperty, scenario, onAiClick }) {
    const sc = scenario || {};
    const stateIcon  = sc.stateIcon  || "homeSecurityArmSolid";
    const stateBadge = sc.stateBadge || "ALL CLEAR";
    const headline   = sc.headline   || "Home is secure.";
    const showDisarm = sc.heroDisarm === true;
    const stateTone  = sc.stateTone  || "primary"; /* primary | alarm */
    const badgeColor = stateTone === "alarm"
      ? "var(--text-error-bold, #810414)"
      : "var(--text-primary)";
    const badgeIconColor = stateTone === "alarm"
      ? "var(--icon-error-bold, #810414)"
      : "var(--icon-primary, #4b286d)";

    return (
      <div style={{
        position: "relative",
        padding: "16px 20px 14px",
        background: "var(--background-app, #fff)",
      }}>
        {/* Row 1 — badge (left) + actions (right) */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          minHeight: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, marginTop: 28 }}>
            {stateIcon && (
              <CDSIcon name={stateIcon} size={18} color={badgeIconColor}/>
            )}
            {stateBadge && (
              <span style={{
                fontFamily: "var(--platform-font-default, var(--platform-font))",
                fontSize: 11, fontWeight: 800,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: badgeColor,
              }}>{stateBadge}</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CircleIconBtn icon="actionPlusLine" label="Add device" onDark={false}/>
            <CircleIconBtn icon="objectBellLine" label="Notifications" badge={unread} onDark={false}/>
            <CircleIconBtn icon="objectStarsSolid" label="AI Assistant" onDark={false} filled onClick={onAiClick}/>
          </div>
        </div>

        {/* Row 2 — Headline (full width) */}
        <div style={{
          marginTop: 12,
          fontFamily: "var(--typo-heading-large-bold-family)",
          fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em",
          color: "var(--text-neutral-bolder)",
        }}>{headline}</div>

        {/* Row 3 — Subtitle */}
        {sc.subtitle && (
          <div style={{
            marginTop: 4,
            fontFamily: "var(--typo-body-medium-regular-family)",
            fontSize: 13, fontWeight: 400, lineHeight: 1.4,
            color: "var(--text-neutral-subtle)",
          }}>{sc.subtitle}</div>
        )}

        {/* Disarm action (Case 03 only) */}
        {showDisarm && (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-start" }}>
            <button style={{
              height: 36, padding: "0 22px",
              background: "transparent",
              border: "1px solid var(--border-primary, #4b286d)",
              color: "var(--text-primary, #4b286d)",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--typo-component-button-small-family)",
              fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}>Disarm</button>
          </div>
        )}
      </div>
    );
  }

  /* ── HeroCard (v9): contained gradient card with state badge, headline,
   *                  Details button, and metrics grid. */

  function HeroCard({ state, scenario }) {
    const sc = scenario || {};
    const gradient = sc.heroTint && HERO_GRADIENT[sc.heroTint]
      ? HERO_GRADIENT[sc.heroTint]
      : (HERO_GRADIENT[state] || HERO_GRADIENT.disarmed);
    const stateIcon  = sc.stateIcon  || "homeSecurityArmSolid";
    const stateBadge = sc.stateBadge || "ALL CLEAR";
    const headline   = sc.headline   || "Home is secure";
    const showDetails = sc.heroDetails !== false;
    const showDisarm  = sc.heroDisarm === true;
    const metrics    = sc.metrics || [];
    const accent     = sc.heroAccent || "green";
    const accentColor =
      accent === "blue" ? "rgba(94,180,255,0.22)" :
      accent === "red"  ? "rgba(255,80,80,0.22)"  :
                          "rgba(126,224,161,0.22)";

    return (
      <div style={{
        position: "relative",
        margin: "4px 16px 0",
        borderRadius: "var(--radius-large)",
        background: gradient,
        color: "#fff",
        padding: "16px 16px 14px",
        overflow: "hidden",
        boxShadow: "var(--elevation-level2)",
        transition: "background 500ms ease",
      }}>
        {/* ambient wash, accent-tinted */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(70% 55% at 18% 0%, ${accentColor} 0%, transparent 70%)`,
        }}/>

        {/* top row — state icon + badge/headline / Details button */}
        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: "var(--radius-medium)",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <CDSIcon name={stateIcon} size={22} color="rgba(255,255,255,0.92)"/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.62)",
              }}>{stateBadge}</div>
              <div style={{
                marginTop: 4,
                fontFamily: "var(--typo-heading-medium-bold-family)",
                fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em",
                color: "#fff",
              }}>{headline}</div>
            </div>
          </div>

          {showDetails && (
            <button style={{
              height: 30, padding: "0 12px",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.28)",
              color: "#fff",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--typo-component-button-small-family)",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
            }}>Details</button>
          )}
        </div>

        {metrics.length > 0 && (
          <div style={{
            position: "relative",
            margin: "12px 0 10px",
            height: 1,
            background: "rgba(255,255,255,0.15)",
          }}/>
        )}

        {metrics.length > 0 && (
          <div style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
            gap: 8,
          }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ minWidth: 0 }}>
                <CDSIcon name={m.icon} size={16} color="rgba(255,255,255,0.62)"/>
                <div style={{
                  marginTop: 4,
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{m.label}</div>
                <div style={{
                  marginTop: 2,
                  fontFamily: "var(--typo-body-medium-bold-family)",
                  fontSize: 13, fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {showDisarm && (
          <div style={{ position: "relative", marginTop: 14, display: "flex", justifyContent: "center" }}>
            <button style={{
              height: 36, padding: "0 22px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.55)",
              color: "#fff",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--typo-component-button-small-family)",
              fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}>Disarm</button>
          </div>
        )}
      </div>
    );
  }

  /* ── Top nav inside hero ─────────────────────────────── */

  function TopNav({ property, name, unread, onChangeProperty, greeting, dark }) {
    const muted    = dark ? "rgba(255,255,255,0.7)" : "var(--text-neutral-subtle)";
    const primary  = dark ? "#fff" : "var(--text-neutral-bolder)";
    const chevron  = dark ? "rgba(255,255,255,0.85)" : "var(--icon-neutral)";
    return (
      <div style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px 8px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 13, fontWeight: 500, color: muted,
            letterSpacing: "0.01em",
          }}>{greeting || `Welcome back, ${name}.`}</div>
          <button onClick={onChangeProperty} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: 0, background: "transparent", border: "none", cursor: "pointer",
            fontFamily: "var(--typo-heading-medium-bold-family)",
            fontSize: 22, fontWeight: 700, color: primary,
            letterSpacing: "-0.01em",
          }}>
            <span>{property}</span>
            <CDSIcon name="arrowChevronDownLine" size={20} color={chevron}/>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CircleIconBtn icon="actionPlusLine" label="Add device" onDark={dark}/>
          <CircleIconBtn icon="objectBellLine" label="Notifications" badge={unread} onDark={dark}/>
        </div>
      </div>
    );
  }

  function CircleIconBtn({ icon, label, badge, onDark, filled, onClick }) {
    return (
      <button aria-label={label} onClick={onClick} style={{
        position: "relative", width: 40, height: 40, padding: 0,
        background: filled
          ? "linear-gradient(135deg, #4B286D 0%, #E53293 100%)"
          : (onDark ? "rgba(255,255,255,0.16)" : "var(--background-neutral-subtle)"),
        border: (filled || !onDark) ? "none" : "1px solid rgba(255,255,255,0.18)",
        borderRadius: "var(--radius-full)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        backdropFilter: onDark && !filled ? "blur(6px)" : "none",
        WebkitBackdropFilter: onDark && !filled ? "blur(6px)" : "none",
      }}>
        <CDSIcon name={icon} size={18} color={filled ? "#fff" : (onDark ? "#fff" : "var(--icon-neutral-bold)")}/>
        {badge ? (
          <span style={{
            position: "absolute", top: -2, right: -2,
            minWidth: 18, height: 18, padding: "0 5px",
            borderRadius: "var(--radius-full)",
            background: "var(--background-error, #d33)",
            color: "#fff",
            fontSize: 10, fontWeight: 700,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: "2px solid rgba(0,0,0,0.0)",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.18)",
            boxSizing: "border-box",
          }}>{badge}</span>
        ) : null}
      </button>
    );
  }

  /* ── Orbs ────────────────────────────────────────────────────────── */

  function Orb({ tint, children, pulse }) {
    // tint: outer ring color, inner halo color
    return (
      <div style={{
        position: "relative",
        width: 64, height: 64,
        borderRadius: "50%",
        background: "var(--background-success-subtle, rgba(126,224,161,0.12))",
        border: "1px solid rgba(255,255,255,0.14)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "inset 0 0 24px rgba(255,255,255,0.10)",
      }}>
        {pulse && (
          <span aria-hidden="true" style={{
            position: "absolute", inset: -6, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.18)",
            animation: "shp-orb-pulse 1.8s ease-out infinite",
          }}/>
        )}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: tint || "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18), inset 0 0 16px rgba(255,255,255,0.18)",
        }}>
          {children}
        </div>
      </div>
    );
  }

  /* ── State centers ──────────────────────────────────────────────── */

  const DEFAULT_PILLS = [
    { label: "21° indoor" },
    { label: "Lucas home",  dot: "#5ec3ff" },
    { label: "2 / 2 locked",dot: "#7be0a1" },
    { label: "2 cameras live", icon: "homeVideoCameraSolid" },
  ];

  function CenterDisarmed({ scenario }) {
    const sc = scenario || {};
    const headline = sc.headline || "All secure.";
    const subtitle = sc.subtitle === undefined ? "Your home is protected" : sc.subtitle;
    const pills    = sc.pills || DEFAULT_PILLS;
    return (
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "6px 20px 12px",
        textAlign: "center",
      }}>
        <Orb tint="rgba(126,224,161,0.32)">
          <CDSIcon name="actionCheckLine" size={26} color="#fff"/>
        </Orb>
        <div style={{
          fontFamily: "var(--typo-heading-large-bold-family)",
          fontSize: 26, fontWeight: 700, marginTop: 12, letterSpacing: "-0.01em",
        }}>{headline}</div>
        {subtitle && (
          <div style={{
            fontSize: 13, marginTop: 3, color: "rgba(255,255,255,0.72)",
          }}>{subtitle}</div>
        )}

        {/* context pills */}
        {pills && pills.length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            gap: 6, marginTop: 12, maxWidth: 320,
          }}>
            {pills.map((p, i) => <ContextPill key={i} icon={p.icon} dot={p.dot} label={p.label}/>)}
          </div>
        )}
      </div>
    );
  }

  function CenterArmedAway({ scenario }) {
    const sc = scenario || {};
    const headline = sc.headline || "All zones clear";
    const metaLine = sc.metaLine === undefined ? "Armed by Lucas · 8:30am · 6h ago" : sc.metaLine;
    return (
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "6px 20px 14px",
        textAlign: "center",
      }}>
        <Orb tint="rgba(60,130,255,0.32)">
          <CDSIcon name="actionLockSolid" size={26} color="#fff"/>
        </Orb>
        <div style={{
          fontFamily: "var(--typo-heading-large-bold-family)",
          fontSize: 26, fontWeight: 700, marginTop: 12, letterSpacing: "-0.01em",
        }}>{headline}</div>
        <div style={{
          marginTop: 8,
          padding: "4px 10px",
          background: "rgba(94,180,255,0.18)",
          border: "1px solid rgba(160,210,255,0.4)",
          color: "#cde3ff",
          borderRadius: "var(--radius-full)",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
        }}>Armed Away</div>
        {metaLine && (
          <div style={{
            fontSize: 12, marginTop: 8, color: "rgba(255,255,255,0.65)",
          }}>{metaLine}</div>
        )}

        <div style={{ marginTop: 12 }}>
          <GhostPill label="Disarm" prominent/>
        </div>
      </div>
    );
  }

  function CenterAlarm() {
    return (
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "14px 20px 22px",
        textAlign: "center",
      }}>
        <Orb tint="rgba(255,70,70,0.28)" pulse>
          <span aria-hidden="true" style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "#ff5151",
            boxShadow: "0 0 24px 4px rgba(255,80,80,0.7)",
            animation: "shp-alarm-blink 1s ease-in-out infinite",
          }}/>
        </Orb>
        <div style={{
          fontSize: 11, fontWeight: 800, marginTop: 14,
          letterSpacing: "0.18em", color: "#ffb4ad",
        }}>ALARM</div>
        <div style={{
          fontFamily: "var(--typo-heading-large-bold-family)",
          fontSize: 28, fontWeight: 700, marginTop: 6, letterSpacing: "-0.01em",
        }}>Garage · Motion</div>
        <div style={{
          fontSize: 13, marginTop: 6, color: "rgba(255,255,255,0.82)",
        }}>Triggered 4:10pm · Monitoring notified</div>
        <div style={{
          fontSize: 12, marginTop: 2, color: "rgba(255,255,255,0.6)",
        }}>Calling Sarah (emergency contact 1)</div>

        <button style={{
          marginTop: 16,
          width: "100%",
          maxWidth: 320,
          height: 48,
          background: "#fff",
          color: "var(--color-error-darker, #7a1612)",
          border: "none",
          borderRadius: "var(--radius-full)",
          fontFamily: "var(--typo-component-button-large-family)",
          fontSize: 14, fontWeight: 700,
          letterSpacing: "0.01em",
          cursor: "pointer",
          boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
        }}>Cancel alarm — verify with passcode</button>
      </div>
    );
  }

  /* ── Helpers (hero) ─────────────────────────────────────────────── */

  function ContextPill({ icon, dot, label }) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 10px",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: "var(--radius-full)",
        fontSize: 12, fontWeight: 600,
        color: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        whiteSpace: "nowrap",
      }}>
        {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, boxShadow: `0 0 8px ${dot}` }}/>}
        {icon && <CDSIcon name={icon} size={13} color="rgba(255,255,255,0.9)"/>}
        {label}
      </span>
    );
  }

  function GhostPill({ label, prominent, fullWidth }) {
    return (
      <button style={{
        height: 44,
        minWidth: 110,
        width: fullWidth ? "100%" : "auto",
        padding: "0 22px",
        background: prominent ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
        border: prominent ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.35)",
        color: "#fff",
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--typo-component-button-small-family)",
        fontSize: 13, fontWeight: prominent ? 700 : 600,
        letterSpacing: "0.01em",
        cursor: "pointer",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      }}>{label}</button>
    );
  }

  function ArmStrip({ emphasis }) {
    // emphasis: "default" | "all-light" | "away" | "night"
    const e = emphasis || "default";
    const eAway  = e === "away";
    const eNight = e === "night";
    return (
      <div style={{
        position: "relative",
        display: "flex", gap: 8,
        padding: "4px 20px 6px",
      }}>
        <ArmBtn label="Arm Away"  prominent={eAway}/>
        <ArmBtn label="Arm Stay"/>
        <ArmBtn label="Night"     prominent={eNight}/>
      </div>
    );
  }
  function ArmBtn({ label, prominent }) {
    return (
      <button style={{
        flex: 1,
        height: prominent ? 44 : 40,
        background: prominent ? "rgba(255,255,255,0.18)" : "transparent",
        border: prominent
          ? "1px solid rgba(255,255,255,0.8)"
          : "1px solid rgba(255,255,255,0.28)",
        color: prominent ? "#fff" : "rgba(255,255,255,0.92)",
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--typo-component-button-small-family)",
        fontSize: 13, fontWeight: prominent ? 700 : 500,
        letterSpacing: "0.01em",
        cursor: "pointer",
        backdropFilter: prominent ? "blur(6px)" : "none",
        WebkitBackdropFilter: prominent ? "blur(6px)" : "none",
      }}>{label}</button>
    );
  }

  /* ── TIP ROW ─────────────────────────────────────────────────────── */

  function TipRow() {
    return (
      <button style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "calc(100% - 40px)",
        margin: "20px 20px 4px",
        padding: "12px 14px",
        background: "var(--color-global-amber-50, #fff4d6)",
        border: "1px solid var(--color-global-amber-200, #f4d893)",
        borderRadius: "var(--radius-large)",
        color: "var(--color-global-amber-900, #5a3b00)",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "var(--platform-font-default, var(--platform-font))",
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: "var(--radius-full)",
          background: "var(--color-global-amber-200, #f4d893)",
          color: "var(--color-global-amber-900, #5a3b00)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <CDSIcon name="objectFlameSolid" size={16} color="currentColor"/>
        </span>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#5a3b00" }}>
          Heater on since 7am · Save $3.40 tonight <span style={{ color: "var(--color-primary-pure)" }}>✦</span>
        </span>
        <CDSIcon name="arrowChevronRightLine" size={16} color="var(--color-global-amber-700, #8a5a00)"/>
      </button>
    );
  }

  /* ── AI ASSISTANT CARD ───────────────────────────────────────────── */

  function AiAssistantCard({ onDismiss, scenario }) {
    const sc = scenario || {};
    const ai = sc.ai || {};
    const body      = ai.body      || "Your heater has been on for 7 hours. Turn it off tonight and save $3.40?";
    const primary   = ai.primary   || "Turn off";
    const secondary = ai.secondary === undefined ? "Not now" : ai.secondary;
    const tag       = ai.tag       || "for you now";
    const [confirmedPrimary, setConfirmedPrimary] = useState(false);
    const [confirmedSecondary, setConfirmedSecondary] = useState(false);
    const tone      = ai.tone      || "default"; /* default | energy | night | alarm | emergency */
    const noDismiss = ai.noDismiss === true;
    const gradient  = tone === "energy"
      ? "linear-gradient(135deg, var(--color-brand-green-500, #2A7C00) 0%, var(--color-brand-green-300, #66CC00) 100%)"
      : tone === "night"
      ? "linear-gradient(135deg, var(--color-global-blue-800, #002852) 0%, var(--color-global-blue-700, #003F81) 100%)"
      : tone === "alarm" || tone === "emergency"
      ? "linear-gradient(135deg, var(--color-global-red-700, #810414) 0%, var(--color-global-red-500, #d80b25) 100%)"
      : "linear-gradient(135deg, #4B286D 0%, #E53293 100%)";
    const shadowColor = tone === "energy"
      ? "rgba(42, 124, 0, 0.22)"
      : tone === "night"
      ? "rgba(0, 40, 82, 0.30)"
      : tone === "alarm" || tone === "emergency"
      ? "rgba(129, 4, 20, 0.30)"
      : "rgba(75, 40, 109, 0.18)";
    const primaryBtnColor = tone === "energy"
      ? "var(--color-brand-green-700, #163e06)"
      : tone === "night"
      ? "var(--color-global-blue-800, #002852)"
      : tone === "alarm" || tone === "emergency"
      ? "var(--color-global-red-700, #810414)"
      : "var(--text-primary, #4b286d)";
    return (
      <div style={{
        position: "relative",
        zIndex: 5,
        margin: "4px 16px 12px",
        padding: "16px 16px 14px",
        background: gradient,
        borderRadius: "var(--radius-large)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 8px 18px ${shadowColor}, 0 2px 6px ${shadowColor}`,
      }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AiOrb size={26} inverse icon={ai.icon}/>
            <span style={{
              fontFamily: "var(--typo-body-small-regular-family)",
              fontSize: "var(--typo-body-small-regular-size, 12px)",
              fontWeight: "var(--typo-body-small-regular-weight, 400)",
              color: "rgba(255,255,255,0.6)",
            }}>{tag}</span>
          </div>
          {!noDismiss && (
            <button aria-label="Dismiss" onClick={onDismiss} style={{
              width: 28, height: 28, padding: 0,
              background: "transparent", border: "none", borderRadius: "var(--radius-full)",
              cursor: "pointer", color: "rgba(255,255,255,0.55)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <CDSIcon name="actionCloseLine" size={16} color="rgba(255,255,255,0.55)"/>
            </button>
          )}
        </div>
        {/* body */}
        <div style={{
          fontFamily: "var(--typo-heading-small-bold-family, var(--platform-font-default, var(--platform-font)))",
          fontSize: "var(--typo-heading-small-bold-size, 20px)",
          fontWeight: "var(--typo-heading-small-bold-weight, 700)",
          lineHeight: "var(--typo-heading-small-bold-line-height, 25px)",
          letterSpacing: "-0.01em",
          color: "#fff",
        }}>{body}</div>
        {ai.bodyMeta && (
          <div style={{
            marginTop: 4,
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 13, fontWeight: 400, lineHeight: 1.4,
            color: "rgba(255,255,255,0.78)",
          }}>{ai.bodyMeta}</div>
        )}
        {/* actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <button onClick={() => { setConfirmedPrimary(true); setTimeout(() => setConfirmedPrimary(false), 1400); }} style={{
            padding: "9px 16px",
            background: confirmedPrimary ? "rgba(255,255,255,0.85)" : "#fff",
            color: primaryBtnColor,
            border: "none",
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--typo-component-button-small-family)",
            fontSize: 13, fontWeight: 700,
            cursor: "pointer",
            transition: "transform 140ms ease, background 140ms ease",
            transform: confirmedPrimary ? "scale(0.97)" : "scale(1)",
          }}>{confirmedPrimary ? "✓ Done" : primary}</button>
          {secondary && (
            <button onClick={() => { setConfirmedSecondary(true); setTimeout(() => setConfirmedSecondary(false), 1000); }} style={{
              padding: "9px 8px",
              background: "transparent", border: "none",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--typo-component-button-small-family)",
              fontSize: 13, fontWeight: 600,
              cursor: "pointer",
              opacity: confirmedSecondary ? 0.4 : 1,
              transition: "opacity 200ms ease",
            }}>{secondary}</button>
          )}
        </div>
      </div>
    );
  }

  function AiOrb({ size = 24, inverse, icon }) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <CDSIcon name={icon || "objectStarsSolid"} size={size} color={inverse ? "#fff" : "var(--color-primary-pure)"}/>
      </span>
    );
  }

  /* ── ROUTINE CHIPS (horizontal scroll) ───────────────────────────── */

  const DEFAULT_CHIPS = [
    { id: "movie", label: "Movie Night", sparkle: true },
    { id: "good",  label: "Good Night",  sparkle: true },
    { id: "away",  label: "Away Mode",   sparkle: true },
    { id: "new",   label: "New",         plus: true },
  ];

  function RoutineChips({ chips }) {
    const items = chips || DEFAULT_CHIPS;
    const [pressed, setPressed] = useState(null);
    return (
      <div style={{
        display: "flex", gap: 8,
        padding: "6px 20px 4px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {items.map((c) => (
          <button key={c.id} onClick={() => { setPressed(c.id); setTimeout(() => setPressed(null), 700); }} style={{
            flexShrink: 0,
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 36,
            padding: "0 14px",
            background: c.plus
              ? "var(--background-neutral-subtle, #f3f3f3)"
              : pressed === c.id
              ? "var(--color-brand-purple-200, #c9a4ea)"
              : "var(--background-primary-subtle, #ede9fe)",
            border: c.plus
              ? "1px solid var(--border-neutral-subtle, #e5e5e5)"
              : "1.5px solid var(--border-primary-subtle, #c4b5fd)",
            borderRadius: "var(--radius-full)",
            color: c.plus
              ? "var(--text-neutral-bold, #1a1a1a)"
              : "var(--text-primary, #5b21b6)",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 13, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap",
            transition: "background 160ms ease, transform 160ms ease",
            transform: pressed === c.id ? "scale(0.96)" : "scale(1)",
          }}>
            {c.plus && <span style={{ fontSize: 16, lineHeight: 1, color: "var(--text-neutral-bold)" }}>+</span>}
            {c.label}
            {c.sparkle && <span style={{ color: "var(--text-primary, #5b21b6)", opacity: 0.85 }}>✦</span>}
          </button>
        ))}
      </div>
    );
  }

  /* ── SECTION HEADER ──────────────────────────────────────────────── */

  function SectionHeader({ title, action, emphasis }) {
    const isLight = emphasis === "light";
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: isLight
            ? "var(--typo-body-medium-bold-family)"
            : "var(--typo-heading-medium-bold-family)",
          fontSize: isLight ? 14 : 18,
          fontWeight: isLight ? 600 : 700,
          color: isLight ? "var(--text-neutral)" : "var(--text-neutral-bolder)",
          letterSpacing: isLight ? "0.02em" : "-0.01em",
          textTransform: "none",
        }}>{title}</h2>
        {action && (
          <button style={{
            background: "transparent", border: "none", padding: 4, cursor: "pointer",
            color: "var(--text-primary)",
            fontFamily: "var(--typo-body-medium-regular-family)",
            fontSize: 13, fontWeight: 600,
          }}>{action}</button>
        )}
      </div>
    );
  }

  /* ── FAVORITES ───────────────────────────────────────────────────── */

  function FavoritesGrid({ devices, onToggle, onPress }) {
    return (
      <div style={{ paddingTop: 20 }}>
        <SectionHeader title="Favorites" action="See all"/>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12, padding: "14px 20px 4px",
        }}>
          {devices.map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: 165 }}>
                <DeviceTile
                  state={d.state}
                  name={d.name}
                  statusText={d.statusText}
                  deviceIcon={d.icon}
                  statusIcon={d.statusIcon}
                  temperature={d.temperature}
                  layout="vertical"
                  onToggle={() => onToggle(d.id)}
                  onPress={() => onPress(d.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── CAMERAS ─────────────────────────────────────────────────────── */

  function CamerasStrip({ cams }) {
    return (
      <div style={{ paddingTop: 24 }}>
        <SectionHeader title="Cameras" action="View all" emphasis="light"/>
        <div style={{
          display: "flex", gap: 12,
          padding: "14px 20px 4px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {cams.map((c) => <CameraCard key={c.id} cam={c}/>)}
        </div>
      </div>
    );
  }

  function CameraCard({ cam }) {
    const hasImage = !!cam.image;
    const [hover, setHover] = useState(false);
    const bg = hasImage
      ? `url("${cam.image}") center / cover no-repeat`
      : (cam.tone === "outdoor"
        ? "linear-gradient(140deg, #0e2f4c 0%, #1a4d7a 40%, #2e6fa3 100%)"
        : "linear-gradient(140deg, #1f1a2c 0%, #3a2e54 50%, #6b4d8a 100%)");
    return (
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        flexShrink: 0,
        width: 220, height: 138,
        borderRadius: "var(--radius-large)",
        overflow: "hidden",
        position: "relative",
        background: bg,
        boxShadow: hover ? "var(--elevation-level2)" : "var(--elevation-level1)",
        color: "#fff",
        cursor: "pointer",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
      }}>
        {!hasImage && (
          <svg viewBox="0 0 220 138" width="220" height="138" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
            {cam.tone === "outdoor" ? (
              <React.Fragment>
                <rect width="220" height="80" fill="rgba(255,255,255,0.06)"/>
                <path d="M0 90 L40 80 L80 95 L130 78 L180 95 L220 84 L220 138 L0 138 Z" fill="rgba(0,0,0,0.35)"/>
                <circle cx="180" cy="30" r="14" fill="rgba(255,255,255,0.18)"/>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <rect width="220" height="138" fill="rgba(0,0,0,0.25)"/>
                <rect x="40" y="50" width="60" height="55" rx="6" fill="rgba(255,255,255,0.1)"/>
                <rect x="115" y="65" width="70" height="40" rx="6" fill="rgba(255,255,255,0.08)"/>
              </React.Fragment>
            )}
          </svg>
        )}
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 8px",
            background: cam.live ? "rgba(255,40,40,0.9)" : "rgba(0,0,0,0.5)",
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }}/>
            {cam.live ? "Live" : "Offline"}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 8px",
            background: "rgba(0,0,0,0.4)",
            borderRadius: "var(--radius-full)",
            fontSize: 11, fontWeight: 600,
          }}>HD</span>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "18px 12px 10px",
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{cam.name}</div>
          <div style={{ fontSize: 11, opacity: 0.82, marginTop: 2 }}>{cam.event}</div>
        </div>
      </div>
    );
  }

  /* ── TODAY AT HOME (event feed) ──────────────────────────────────── */

  function TodayAtHome({ events }) {
    const past     = events.filter((e) => e.kind !== "upcoming");
    const upcoming = events.filter((e) => e.kind === "upcoming");
    return (
      <div style={{ paddingTop: 24 }}>
        <SectionHeader title="Today at home" action="See all" emphasis="light"/>
        <div style={{
          margin: "10px 12px 4px",
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {past.map((e, i) => <EventRow key={e.id} e={e} emphasis={i === 0 && e.kind !== "routine" ? "high" : "default"}/>)}
          {upcoming.length > 0 && (
            <div style={{
              height: 1,
              margin: "10px 12px",
              background: "var(--border-neutral-subtle, #ECECEC)",
            }}/>
          )}
          {upcoming.map((e) => <EventRow key={e.id} e={e} emphasis="upcoming"/>)}
        </div>
      </div>
    );
  }

  /* Pick an icon for an event based on its `icon` field (if set) or its text. */
  function eventIconFor(e) {
    if (e.icon) return e.icon;
    const t = (e.text || "").toLowerCase();
    if (t.includes("motion"))      return "homeMotionSensorSolid";
    if (t.includes("unlock"))      return "homeSecurityDisarmSolid";
    if (t.includes("auto-lock") || t.includes("locked"))
                                   return "homeDoorLockSolid";
    if (t.includes("thermostat") || t.includes("°") || t.includes("heat"))
                                   return "homeThermometerSolid";
    if (t.includes("scene") || t.includes("light") || t.includes("warm") || t.includes("bulb"))
                                   return "homeBulbSolid";
    if (t.includes("arrived") || t.includes("welcome"))
                                   return "homeAtHomeRightSolid";
    if (t.includes("geofence"))    return "abstractLocationSolid";
    if (t.includes("armed"))       return "homeSecurityArmSolid";
    if (t.includes("disarm"))      return "homeSecurityDisarmSolid";
    if (t.includes("cms") || t.includes("monitoring") || t.includes("central"))
                                   return "connectCellularNetworkLine";
    if (t.includes("call") || t.includes("phone"))
                                   return "objectPhoneSolid";
    if (t.includes("camera"))      return "homeVideoCameraSolid";
    return "timeClockSolid";
  }

  function EventRow({ e, emphasis }) {
    const isHigh     = emphasis === "high";
    const isRoutine  = e.kind === "routine";
    const isUpcoming = emphasis === "upcoming" || e.kind === "upcoming";
    const [hover, setHover] = useState(false);
    const iconName = isRoutine
      ? (e.icon || "objectStarsSolid")
      : isUpcoming
      ? (e.icon || "timeClockLine")
      : eventIconFor(e);

    /* tonal palette by event tone */
    const palette = {
      alarm:    { bg: "var(--background-error-subtle)",   fg: "var(--text-error-bold, #e0322a)",   iconBg: "var(--background-error-subtle)",   iconFg: "var(--icon-error-bold, #e0322a)" },
      security: { bg: "var(--background-info-subtle)",    fg: "var(--text-info-bold, #3a7dd9)",    iconBg: "var(--background-info-subtle)",    iconFg: "var(--icon-info-bold, #3a7dd9)" },
      success:  { bg: "var(--background-success-subtle)", fg: "var(--text-success-bold, #2a9d6e)", iconBg: "var(--background-success-subtle)", iconFg: "var(--icon-success-bold, #2a9d6e)" },
      neutral:  { bg: "var(--background-primary-subtle)", fg: "var(--text-primary)",               iconBg: "var(--background-neutral-subtle)", iconFg: "var(--icon-neutral, #6e6e73)" },
    };
    const p = palette[e.tone] || palette.neutral;

    const background = isUpcoming
      ? "transparent"
      : isHigh
      ? "var(--color-brand-purple-50, #F8F0FF)"
      : "transparent";
    const titleColor = isUpcoming
      ? "var(--text-neutral-subtle)"
      : "var(--text-neutral-bolder)";
    const titleWeight = isUpcoming ? 600 : (isHigh || isRoutine ? 700 : 600);
    const iconColor = isUpcoming
      ? "var(--icon-neutral-subtle, #b4b4b7)"
      : isHigh
      ? "var(--text-primary, #4b286d)"
      : "var(--icon-neutral-subtle, #b4b4b7)";

    return (
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px",
        background: (hover && !isUpcoming) ? "var(--color-brand-purple-50, #F8F0FF)" : background,
        borderRadius: "var(--radius-medium)",
        border: "none",
        opacity: isUpcoming ? 0.85 : 1,
        cursor: isUpcoming ? "default" : "pointer",
        transition: "background 180ms ease",
      }}>
        <span style={{
          width: 24, height: 24,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <CDSIcon name={iconName} size={20} color={iconColor}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: (isHigh || isRoutine)
              ? "var(--typo-body-medium-bold-family)"
              : "var(--typo-body-medium-regular-family)",
            fontSize: 14,
            fontWeight: titleWeight,
            color: titleColor,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{e.text}</div>
          <div style={{ fontSize: 12, color: "var(--text-neutral-subtle)", marginTop: 2 }}>{e.when} · {e.where}</div>
        </div>
        {!isUpcoming && (
          <CDSIcon name="arrowChevronRightLine" size={16} color="var(--icon-neutral-subtle)"/>
        )}
      </div>
    );
  }

  /* ── MIDI BAR (AI command input) ─────────────────────────────────── */

  function MidiBar() {
    return (
      <div style={{
        margin: "24px 20px 4px",
        padding: "11px 12px 11px 16px",
        background: "var(--color-brand-purple-900, #1e1b4b)",
        border: "none",
        borderRadius: "var(--radius-full)",
        boxShadow: "0 10px 24px rgba(75,40,109,0.22), 0 2px 6px rgba(75,40,109,0.18)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <AiOrb size={20}/>
        <input
          type="text"
          placeholder="Ask your AI Assistant or type a command…"
          style={{
            flex: 1, minWidth: 0,
            background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 14, color: "rgba(255,255,255,0.92)",
          }}
        />
        <button aria-label="Voice" style={{
          width: 30, height: 30,
          background: "rgba(255,255,255,0.10)",
          border: "none", borderRadius: "var(--radius-full)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <CDSIcon name="actionMicrophoneLine" size={14} color="rgba(255,255,255,0.92)"/>
        </button>
      </div>
    );
  }

  /* ── EVENTS PER STATE ────────────────────────────────────────────── */

  /* ── ONBOARDING PANEL (Case 00): pre-install state ──────────────── */

  function OnboardingPanel({ scenario }) {
    const sc = scenario || {};
    const delivery = sc.delivery || {
      badge: "IN TRANSIT · EST. TOMORROW",
      headline: "Your kit is almost here",
      meta: "Arriving Tue, May 19 by end of day.",
      carrier: "Canada Post · 7012 4231 8865 4421",
      action: "Track delivery",
    };
    const steps = sc.setupSteps || [
      { label: "Kit on the way", status: "active" },
      { label: "Connect Hub",    status: "upcoming" },
      { label: "Add devices",    status: "upcoming" },
    ];
    const kit = sc.kit || [
      { name: "SmartHome Hub",          desc: "The brain — connects everything", icon: "homeHubSolid",           tag: "INSTALL FIRST" },
      { name: "Door & window sensor",   desc: "× 2 included",                    icon: "homeContactSensorSolid" },
      { name: "Smart plug",             desc: "Control any plugged-in device",    icon: "homePlugSolid" },
    ];
    const prep = sc.prep || [
      { title: "Place your Hub",          meta: "Near your router, for best signal",          icon: "connectWifiConnectedLine" },
      { title: "Choose sensors location", meta: "Decide which doors and windows first",       icon: "homeContactSensorSolid" },
      { title: "Free up 10 minutes",      meta: "Setup takes about 10 min on arrival day",    icon: "timeClockSolid" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "12px 16px 8px" }}>
        {/* Setup progress stepper */}
        <div>
          <div style={{
            padding: "0 4px 10px",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 10, fontWeight: 800,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--text-neutral-subtle)",
          }}>Setup progress</div>
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 0,
            padding: "0 4px",
          }}>
            {steps.map((s, i, arr) => {
              const isActive = s.status === "active";
              const isDone   = s.status === "done";
              return (
                <React.Fragment key={i}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto", minWidth: 0 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: "var(--radius-full)",
                      background: (isActive || isDone)
                        ? "var(--color-primary-pure, #4b286d)"
                        : "transparent",
                      border: (isActive || isDone)
                        ? "none"
                        : "1.5px solid var(--border-neutral, #b4b4b7)",
                      color: "#fff",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                    }}>{isDone ? "✓" : (i + 1)}</span>
                    <span style={{
                      marginTop: 6,
                      fontSize: 11, fontWeight: isActive ? 700 : 600,
                      color: isActive ? "var(--text-primary, #4b286d)" : "var(--text-neutral-subtle)",
                      textAlign: "center", maxWidth: 92,
                      lineHeight: 1.2,
                    }}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{
                      flex: 1, height: 1.5, marginTop: 13,
                      background: isDone
                        ? "var(--color-primary-pure, #4b286d)"
                        : "var(--border-neutral, #b4b4b7)",
                      opacity: isDone ? 1 : 0.5,
                    }}/>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* What's in your kit */}
        <div>
          <div style={{
            padding: "0 4px 10px",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 10, fontWeight: 800,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--text-neutral-subtle)",
          }}>What's in your kit</div>
          <div style={{
            display: "flex", flexDirection: "column",
            background: "var(--background-app, #fff)",
            border: "1px solid var(--border-neutral-subtle, #ECECEC)",
            borderRadius: "var(--radius-large)",
            overflow: "hidden",
          }}>
            {kit.map((k, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px",
                borderTop: i === 0 ? "none" : "1px solid var(--border-neutral-subtle, #ECECEC)",
              }}>
                <span style={{
                  width: 40, height: 40, borderRadius: "var(--radius-medium)",
                  background: "var(--background-primary-subtle, #f8f0ff)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <CDSIcon name={k.icon} size={22} color="var(--icon-primary, #4b286d)"/>
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--typo-body-medium-bold-family)",
                      fontSize: 14, fontWeight: 700,
                      color: "var(--text-neutral-bolder)",
                    }}>{k.name}</span>
                    {k.tag && (
                      <span style={{
                        padding: "2px 8px",
                        background: "var(--color-global-amber-50, #fff4df)",
                        color: "var(--color-global-amber-800, #372502)",
                        borderRadius: "var(--radius-full)",
                        fontSize: 9, fontWeight: 800,
                        letterSpacing: "0.10em", textTransform: "uppercase",
                      }}>{k.tag}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-neutral-subtle)", marginTop: 2 }}>{k.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* While you wait — prep tips */}
        <div>
          <div style={{
            padding: "0 4px 10px",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 10, fontWeight: 800,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--text-neutral-subtle)",
          }}>While you wait</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {prep.map((step, i) => (
              <div key={i}>
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                  padding: "14px 4px",
                }}>
                  <span style={{
                    fontFamily: "var(--typo-body-medium-bold-family)",
                    fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "var(--text-neutral-subtle)",
                    flexShrink: 0,
                    minWidth: 22,
                    paddingTop: 1,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "var(--typo-body-medium-bold-family)",
                      fontSize: 14, fontWeight: 700,
                      color: "var(--text-neutral-bolder)",
                    }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-neutral-subtle)", marginTop: 2 }}>{step.meta}</div>
                  </div>
                </div>
                {i < prep.length - 1 && (
                  <div style={{
                    height: 1,
                    background: "var(--border-neutral-subtle, #ECECEC)",
                    margin: "0 4px",
                  }}/>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── ALARM PANEL (Case 07): camera feed · monitoring · safe word ·
   *     emergency circle · alarm AI card.
   *     Renders when scenario.alarmMode === true, replacing Favorites /
   *     Cameras / Today at home. */

  function AlarmPanel({ scenario }) {
    const sc = scenario || {};
    const cameraImage = sc.alarmCamera || "assets/cameras/garage.png";
    const cameraName  = sc.alarmCameraName || "Garage";
    const cameraTime  = sc.alarmTime || "4:10 pm";
    const safeWord    = sc.safeWord || "MAPLE";
    const monitoringAgent = sc.monitoringAgent || "Agent reviewing";
    const monitoringTimer = sc.monitoringTimer || "00:30";
    const contacts = sc.emergencyCircle || [
      { id: "c1", name: "Sarah",   role: "Emergency 1",   status: "Calling…",   tone: "active" },
      { id: "c2", name: "Marcus",  role: "Emergency 2",   status: "Notified",   tone: "done"   },
      { id: "c3", name: "Neighbor", role: "Local contact", status: "Connecting", tone: "muted"  },
    ];
    const [deterrentStates, setDeterrentStates] = useState({ siren: false, lights: false, audio: false, lock: false });
    const toggleDeterrent = (id) => setDeterrentStates((s) => ({ ...s, [id]: !s[id] }));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 16px 4px" }}>
        {/* ── Block 1: Camera live feed ────────────────────── */}
        <div style={{
          position: "relative",
          width: "100%", height: 180,
          borderRadius: "var(--radius-large)",
          overflow: "hidden",
          background: `url("${cameraImage}") center / cover no-repeat, #1f1a2c`,
          boxShadow: "var(--elevation-level1)",
          color: "#fff",
        }}>
          <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 9px",
              background: "var(--color-global-red-500, #d80b25)",
              borderRadius: "var(--radius-full)",
              fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "shp-alarm-blink 1s ease-in-out infinite" }}/>
              Live
            </span>
            <span style={{
              padding: "4px 9px",
              background: "rgba(0,0,0,0.5)",
              borderRadius: "var(--radius-full)",
              fontSize: 11, fontWeight: 700,
            }}>HD</span>
          </div>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "20px 14px 12px",
            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{cameraName} · Motion</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Triggered {cameraTime}</div>
          </div>
        </div>

        {/* ── Block 2: TELUS Monitoring status ────────────── */}
        <div style={{
          padding: "14px 14px 12px",
          background: "var(--background-primary-subtle, #f8f0ff)",
          border: "1px solid var(--border-primary-subtle, #dfc9f3)",
          borderRadius: "var(--radius-medium)",
        }}>
          {/* header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              width: 36, height: 36,
              borderRadius: "var(--radius-full)",
              background: "var(--color-brand-purple-700, #4b286d)",
              color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--brand-font-primary)",
              fontWeight: 800, fontSize: 13, letterSpacing: "0.02em",
              flexShrink: 0,
            }}>T</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--typo-body-medium-bold-family)",
                fontSize: 13, fontWeight: 700,
                color: "var(--text-primary-bold, #4b286d)",
              }}>TELUS Monitoring</div>
              <div style={{
                fontSize: 12, color: "var(--text-primary, #4b286d)",
                marginTop: 2,
              }}>{monitoringAgent} · {monitoringTimer}</div>
            </div>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "var(--color-global-green-500, #00ab0b)",
              boxShadow: "0 0 0 4px rgba(0,171,11,0.18)",
              animation: "shp-alarm-blink 1.4s ease-in-out infinite",
              flexShrink: 0,
            }}/>
          </div>

          {/* divider between header and timeline */}
          <div style={{
            height: 1,
            margin: "12px 0 4px",
            background: "var(--color-brand-purple-200, #c9a4ea)",
            opacity: 0.5,
          }}/>

          {/* timeline */}
          <div style={{ marginTop: 12, paddingLeft: 4 }}>
            {[
              { status: "done",    title: "Motion detected",  meta: "2:33 AM · Front door sensor" },
              { status: "done",    title: "Alarm triggered",  meta: "2:33 AM · Panel armed" },
              { status: "active",  title: "Agent reviewing",  meta: "Verifying via camera · 00:30" },
              { status: "pending", title: "What's next",      meta: "Contact you · dispatch if needed" },
            ].map((step, i, arr) => {
              const isLast = i === arr.length - 1;
              const isDone = step.status === "done";
              const isActive = step.status === "active";
              const dotBg =
                isDone   ? "var(--color-brand-purple-700, #4b286d)" :
                isActive ? "var(--color-brand-purple-500, #7c53a5)" :
                           "transparent";
              const dotBorder =
                isDone || isActive
                  ? "none"
                  : "1.5px solid var(--color-brand-purple-300, #b287d8)";
              const titleColor =
                isActive ? "var(--text-primary-bold, #4b286d)" :
                isDone   ? "var(--text-primary-bold, #4b286d)" :
                           "var(--text-primary, #4b286d)";
              const metaColor = "var(--text-primary, #4b286d)";
              const opacity = step.status === "pending" ? 0.65 : 1;

              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "16px 1fr",
                  gap: 12,
                  paddingBottom: isLast ? 0 : 16,
                  opacity,
                }}>
                  <div style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center",
                  }}>
                    <span style={{
                      width: 12, height: 12, borderRadius: "50%",
                      background: dotBg,
                      border: dotBorder,
                      boxShadow: isActive ? "0 0 0 4px rgba(124, 83, 165, 0.22)" : "none",
                      animation: isActive ? "shp-alarm-blink 1.4s ease-in-out infinite" : "none",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1,
                    }}>
                      {isDone && (
                        <svg viewBox="0 0 12 12" width="8" height="8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2.5 6.5 L5 9 L9.5 3.5"/>
                        </svg>
                      )}
                    </span>
                    {!isLast && (
                      <span style={{
                        flex: 1,
                        width: 1.5,
                        background: "var(--color-brand-purple-300, #b287d8)",
                        marginTop: 3,
                        marginBottom: -16,
                      }}/>
                    )}
                  </div>
                  <div style={{ paddingTop: -1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: isActive
                        ? "var(--typo-body-small-bold-family)"
                        : "var(--typo-body-small-regular-family)",
                      fontSize: 13, fontWeight: isActive || isDone ? 700 : 600,
                      color: titleColor,
                      lineHeight: 1.2,
                    }}>{step.title}</div>
                    <div style={{
                      fontSize: 11.5, marginTop: 3,
                      color: metaColor,
                      opacity: 0.75,
                    }}>{step.meta}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 3: Safe word ─────────────────────────── */}
        <div style={{
          padding: "16px 14px",
          background: "var(--background-app, #fff)",
          border: "1.5px dashed var(--border-primary, #4b286d)",
          borderRadius: "var(--radius-medium)",
          textAlign: "center",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            justifyContent: "center",
            fontSize: 10, fontWeight: 800,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--text-neutral-subtle)",
          }}>
            <CDSIcon name="actionMicrophoneSolid" size={14} color="var(--icon-neutral, #6e6e73)"/>
            Say to cancel
          </div>
          <div style={{
            marginTop: 6,
            fontFamily: "var(--typo-heading-large-bold-family)",
            fontSize: 30, fontWeight: 700, letterSpacing: "0.06em",
            color: "var(--text-primary, #4b286d)",
          }}>{safeWord}</div>
        </div>

        {/* ── Block 4: Emergency circle ──────────────────── */}
        <div>
          <div style={{
            padding: "0 4px 8px",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 10, fontWeight: 800,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--text-neutral-subtle)",
          }}>Emergency circle</div>
          <div style={{
            display: "flex", flexDirection: "column",
            background: "var(--background-app, #fff)",
            border: "1px solid var(--border-neutral-subtle, #ECECEC)",
            borderRadius: "var(--radius-medium)",
            overflow: "hidden",
          }}>
            {contacts.map((c, i) => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px",
                borderTop: i === 0 ? "none" : "1px solid var(--border-neutral-subtle, #ECECEC)",
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: "var(--radius-full)",
                  background:
                    c.tone === "active" ? "var(--background-error-subtle, #ffeff1)" :
                    c.tone === "done"   ? "var(--background-success-subtle, #e7f9e7)" :
                                          "var(--background-neutral-subtle, #f3f3f3)",
                  color:
                    c.tone === "active" ? "var(--text-error, #d80b25)" :
                    c.tone === "done"   ? "var(--text-success, #00ab0b)" :
                                          "var(--text-neutral, #6e6e73)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--typo-body-medium-bold-family)",
                  fontSize: 12, fontWeight: 700,
                  flexShrink: 0,
                }}>{c.name.charAt(0)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: "var(--text-neutral-bolder)",
                  }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-neutral-subtle)", marginTop: 1 }}>{c.role}</div>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600,
                  color:
                    c.tone === "active" ? "var(--text-error, #d80b25)" :
                    c.tone === "done"   ? "var(--text-success, #00ab0b)" :
                                          "var(--text-neutral-subtle)",
                }}>
                  {c.tone === "active" && (
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--color-global-red-500, #d80b25)",
                      animation: "shp-alarm-blink 1s ease-in-out infinite",
                    }}/>
                  )}
                  {c.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Block 5: Deterrents (scare them off) ──────── */}
        <div>
          <div style={{
            padding: "0 4px 8px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{
              fontFamily: "var(--platform-font-default, var(--platform-font))",
              fontSize: 10, fontWeight: 800,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--text-neutral-subtle)",
            }}>Scare them off</div>
            <div style={{
              fontSize: 11, color: "var(--text-neutral-subtle)",
            }}>Tap to activate</div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            padding: "2px 4px 4px",
          }}>
            {[
              { id: "siren",  name: "Siren",       onText: "Sound on",     offText: "Alarm sound",    icon: "homeSecurityArmSolid" },
              { id: "lights", name: "All lights",  onText: "Strobing",     offText: "Strobe on",      icon: "homeBulbSolid" },
              { id: "audio",  name: "Speak live",  onText: "Connected",    offText: "Two-way audio",  icon: "actionMicrophoneSolid" },
              { id: "lock",   name: "Lock all",    onText: "All locked",   offText: "Doors + garage", icon: "homeDoorLockSolid" },
            ].map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: 165 }}>
                  <DeviceTile
                    state={deterrentStates[d.id] ? "on" : "off"}
                    name={d.name}
                    statusText={deterrentStates[d.id] ? d.onText : d.offText}
                    deviceIcon={d.icon}
                    layout="vertical"
                    onToggle={() => toggleDeterrent(d.id)}
                    onPress={() => toggleDeterrent(d.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const EVENTS_BY_STATE = {
    "disarmed": [
      { id: "e1", tone: "success",  text: "Front door unlocked by Alex",   when: "3 min ago",   where: "Front door" },
      { id: "e2", tone: "neutral",  kind: "routine", text: "Morning mode",   when: "Triggered", where: "7:30am" },
      { id: "e3", tone: "neutral",  text: "Living room scene · Warm",      when: "12 min ago",  where: "Living room" },
      { id: "e4", tone: "neutral",  kind: "upcoming", text: "Good Night routine", when: "Scheduled", where: "10:30pm" },
    ],
    "armed-away": [
      { id: "e1", tone: "security", text: "Armed Away by Lucas",           when: "8:30 am",     where: "All zones" },
      { id: "e2", tone: "security", text: "Front door auto-locked",        when: "8:31 am",     where: "Front door" },
      { id: "e3", tone: "security", text: "CMS · Standby monitoring",      when: "8:31 am",     where: "Central station" },
    ],
    "alarm": [
      { id: "e1", tone: "alarm",    text: "Motion — Garage triggered",     when: "4:10 pm",     where: "Garage" },
      { id: "e2", tone: "alarm",    text: "CMS dispatched · response",     when: "4:11 pm",     where: "Central station" },
      { id: "e3", tone: "security", text: "Calling Sarah · emergency 1",   when: "4:11 pm",     where: "Phone tree" },
    ],
  };

  /* ── LISTENING BAR (floating AI assistant pill above the tab bar) ───
   *
   * Spec: 72px tall, radius 16, full-width minus 12px sides, bottom: 92,
   * canvas wave bg, state pill on left, mic + close on right. Tapping the
   * body expands to voice mode (onTap); mic toggles muted; close fires
   * onClose. If muted, the label collapses to "Waiting" and the wave runs
   * the "speaking" mode regardless of barMode. */

  const BAR_LABELS = {
    thinking:  "Thinking",
    waiting:   "Waiting",
    speaking:  "Listening",
    listening: "Responding",
  };

  function ListeningBar({ open, onTap, onClose, muted, setMuted, barMode }) {
    if (!open) return null;
    const effectiveMuted = !!muted;
    const effectiveMode = effectiveMuted ? "speaking" : (barMode || "thinking");
    const label = effectiveMuted ? "Waiting" : (BAR_LABELS[barMode] || BAR_LABELS.thinking);

    return (
      <div
        onClick={onTap}
        style={{
          position: "absolute",
          left: "50%", bottom: 92,
          transform: "translateX(-50%)",
          width: 264,
          zIndex: 30,
          height: 56,
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          background: "var(--background-app, #fff)",
          boxShadow: "0 10px 24px rgba(75, 40, 109, 0.22), 0 2px 6px rgba(75, 40, 109, 0.10), inset 0 1px 0 rgba(255,255,255,0.45)",
          cursor: "pointer",
        }}
      >
        {/* Canvas wave background (layer 0) */}
        {window.ListeningWaveCanvas && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
            <window.ListeningWaveCanvas width={264} height={56} mode={effectiveMode} radius={9999}/>
          </div>
        )}

        {/* Content row — Copilot-style icon cluster */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 14px",
          gap: 6,
        }}>

          {/* State label pill */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 9px",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.28)",
            color: "#fff",
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--typo-body-small-bold-family)",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.02em",
            textShadow: "0 1px 1px rgba(0,0,0,0.10)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30)",
            whiteSpace: "nowrap",
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#fff",
              animation: "shp-status-blink 1.2s ease-in-out infinite",
              flexShrink: 0,
            }}/>
            {label}
          </span>

          {/* Center cluster — camera, upload, mic (focal) */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Camera */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onTap && onTap("camera"); }}
              aria-label="Take photo"
              style={{
                width: 32, height: 32, padding: 0,
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.36)",
                borderRadius: "var(--radius-full)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.42), 0 1px 4px rgba(75,40,109,0.10)",
                flexShrink: 0,
                transition: "background 200ms ease, transform 160ms ease",
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="6" width="14" height="12" rx="2.5" fill="#fff"/>
                <path d="M16 9.5 L22 6.5 V17.5 L16 14.5 Z" fill="#fff"/>
              </svg>
            </button>

            {/* Mic — focal, larger, premium white glass */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setMuted && setMuted(!effectiveMuted); }}
              aria-label={effectiveMuted ? "Unmute microphone" : "Mute microphone"}
              style={{
                width: 40, height: 40, padding: 0,
                borderRadius: "var(--radius-full)",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.75)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(75,40,109,0.06), 0 4px 14px rgba(75, 40, 109, 0.32)",
                flexShrink: 0,
                marginLeft: 4,
                transition: "background 200ms ease, transform 160ms ease",
              }}>
              <CDSIcon
                name={effectiveMuted ? "actionMicrophoneOffSolid" : "actionMicrophoneSolid"}
                size={18}
                color="var(--color-primary-pure, #4b286d)"
              />
            </button>

            {/* Close — moved to after mic */}
            <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose && onClose(); }}
            aria-label="Close"
            style={{
              width: 36, height: 36, padding: 0,
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.36)",
              borderRadius: "var(--radius-full)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.42), 0 1px 4px rgba(75,40,109,0.10)",
              flexShrink: 0,
              transition: "background 200ms ease, transform 160ms ease",
            }}>
            <CDSIcon name="actionCloseLine" size={18} color="#fff"/>
          </button>
          </div>
        </div>
      </div>
    );
  }

  function TextPromptBar({ open, onSwitchToVoice, onSubmit, onClose }) {
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef(null);
    React.useEffect(() => {
      if (open && inputRef.current) {
        const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 80);
        return () => clearTimeout(t);
      }
    }, [open]);
    if (!open) return null;

    function submit() {
      if (!value.trim()) return;
      onSubmit && onSubmit(value.trim());
      setValue("");
    }

    return (
      <div
        style={{
          position: "absolute",
          left: "50%", bottom: 92,
          transform: "translateX(-50%)",
          width: 360,
          zIndex: 30,
          height: 56,
          borderRadius: "var(--radius-full)",
          background: "#1B1612",
          boxShadow: "0 8px 22px rgba(0, 0, 0, 0.32), 0 2px 6px rgba(0, 0, 0, 0.18)",
          display: "flex", alignItems: "center",
          padding: "0 14px",
          gap: 10,
        }}
      >
        {/* Left — "+" in thin-outline circle */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); /* future: open attachment menu */ }}
          aria-label="Add"
          style={{
            width: 36, height: 36, padding: 0,
            borderRadius: "var(--radius-full)",
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.28)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5 V19 M5 12 H19" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Middle — input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="Ask anything…"
          style={{
            flex: 1, minWidth: 0,
            background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 15, fontWeight: 500,
            color: "#FFFFFF",
            caretColor: "#FFFFFF",
            letterSpacing: "0.005em",
          }}
        />

        {/* Right — audio-bars icon to switch back to voice */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (value.trim()) { submit(); }
            else { onSwitchToVoice && onSwitchToVoice(); }
          }}
          aria-label={value.trim() ? "Send" : "Switch to voice input"}
          style={{
            width: 36, height: 36, padding: 0,
            background: "transparent",
            border: "none",
            borderRadius: "var(--radius-full)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}>
          {value.trim() ? (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19 V5 M5 12 L12 5 L19 12" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <g stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round">
                <line x1="5"  y1="10" x2="5"  y2="14"/>
                <line x1="9"  y1="7"  x2="9"  y2="17"/>
                <line x1="13" y1="4"  x2="13" y2="20"/>
                <line x1="17" y1="7"  x2="17" y2="17"/>
                <line x1="21" y1="10" x2="21" y2="14"/>
              </g>
            </svg>
          )}
        </button>
      </div>
    );
  }

  function Dot({ delay }) {
    return (
      <span style={{
        width: 4, height: 4, borderRadius: "50%",
        background: "#fff",
        animation: "shp-typing 1.2s ease-in-out infinite",
        animationDelay: delay,
        display: "inline-block",
      }}/>
    );
  }

  /* ── ROOT ────────────────────────────────────────────────────────── */

  function HomeScreen({ tweaks, onSignOut, scenario }) {
    const sc = scenario || {};
    const securityState = sc.state || tweaks.securityState || "disarmed";
    const showAi  = sc.ai !== undefined ? !!sc.ai : (tweaks.showAi  !== false);
    const showFavorites = sc.showFavorites !== false;
    const showChips = sc.showChips !== false;
    const showCameras = sc.showCameras !== false;
    const showToday  = sc.showToday  !== false;
    const softLabel  = sc.softLabel === undefined
      ? (showAi ? "or start a routine" : null)
      : sc.softLabel;

    const [activeTab, setActiveTab] = useState("home");
    const [aiCardVisible, setAiCardVisible] = useState(true);
    const [isBuilding, setIsBuilding] = useState(true);
    React.useEffect(() => {
      setIsBuilding(true);
      const t = setTimeout(() => setIsBuilding(false), 1200);
      return () => clearTimeout(t);
    }, []);
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const [textPromptOpen, setTextPromptOpen] = useState(false);
    const [barMode, setBarMode] = useState("waiting");
    const [barMuted, setBarMuted] = useState(false);
    React.useEffect(() => {
      if (!aiChatOpen) return;
      setBarMode("waiting");
      const t1 = setTimeout(() => setBarMode("speaking"),  4000);
      const t2 = setTimeout(() => setBarMode("listening"), 8000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [aiChatOpen]);
    const scrollRef = React.useRef(null);
    React.useEffect(() => {
      if (scrollRef.current && typeof sc.initialScroll === "number") {
        scrollRef.current.scrollTop = sc.initialScroll;
      } else if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }, [sc.initialScroll]);
    const property = sc.property || (tweaks.brand === "homi" ? "47 Maple Ave" : "Riverside home");
    const name     = sc.name     || (tweaks.brand === "homi" ? "Sam" : "Alex");

    const [devices, setDevices] = useState([
      { id: "lock",  name: "Front door",     state: "on",  statusText: "Locked",       icon: "homeDoorLockSolid",   statusIcon: "homeDoorLockSolid" },
      { id: "lights",name: "Living room",    state: "on",  statusText: "55% · Warm",   icon: "homeBulbSolid" },
      { id: "thermo",name: "Hall thermostat",state: "on-thermostat", statusText: "Heat to 21°", icon: "homeThermostatLine", temperature: "21.5°" },
      { id: "plug",  name: "Kitchen plug",   state: "off", statusText: "Idle",         icon: "homePlugLine" },
    ]);

    const cams = [
      { id: "drive",  name: "Front door",    event: "Motion · 3 min ago",   live: true,  tone: "outdoor", image: "assets/cameras/front-door.png" },
      { id: "back",   name: "Back garden",   event: "Person · 22 min ago",  live: true,  tone: "outdoor", image: "assets/cameras/back-garden.png" },
      { id: "garage", name: "Garage",        event: "Door closed · 1 h",    live: false, tone: "indoor", image: "assets/cameras/garage.png" },
    ];

    const events = sc.events || EVENTS_BY_STATE[securityState] || EVENTS_BY_STATE.disarmed;
    const unread = sc.unread !== undefined
      ? sc.unread
      : (securityState === "alarm" ? 5 : (securityState === "armed-away" ? 3 : 2));

    function toggleDevice(id) {
      setDevices((ds) => ds.map((d) => {
        if (d.id !== id) return d;
        if (d.state === "on") return { ...d, state: "off", statusText: "Off" };
        if (d.state === "off") return { ...d, state: "on", statusText: "On" };
        if (d.state === "on-thermostat") return { ...d, state: "off-thermostat" };
        if (d.state === "off-thermostat") return { ...d, state: "on-thermostat" };
        return d;
      }));
    }

    return (
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        background: "var(--background-app, #fff)",
        color: "var(--text-neutral-bolder)",
      }}>
        {/* scrollable content */}
        <div ref={scrollRef} className={isBuilding ? "shp-build is-building" : "shp-build"} style={{
          flex: 1, overflowY: "auto", overscrollBehavior: "contain",
          paddingBottom: 100,
        }}>
          {/* iOS status bar spacer */}
          <div style={{ height: 70 }}/>

          {/* flat header (v10): merged top nav + state + headline + metrics */}
          <FlatHeader property={property} name={name} unread={unread} scenario={sc} onAiClick={() => setAiChatOpen((v) => !v)} />

          {showAi && aiCardVisible && (
            <AiAssistantCard onDismiss={() => setAiCardVisible(false)} scenario={sc}/>
          )}

          {softLabel && (
            <div style={{
              padding: "12px 20px 0",
              fontFamily: "var(--typo-body-small-regular-family)",
              fontSize: "var(--typo-body-small-regular-size, 12px)",
              fontWeight: "var(--typo-body-small-regular-weight, 400)",
              color: "var(--text-neutral-subtle)",
            }}>{softLabel}</div>
          )}

          {showChips && securityState !== "alarm" && <RoutineChips chips={sc.chips}/>}

          {showFavorites && !sc.alarmMode && !sc.onboardingMode && <FavoritesGrid devices={devices} onToggle={toggleDevice} onPress={() => {}}/>}
          {showCameras  && !sc.alarmMode && !sc.onboardingMode && <CamerasStrip cams={cams}/>}
          {showToday    && !sc.alarmMode && !sc.onboardingMode && <TodayAtHome events={events}/>}

          {sc.onboardingMode && <OnboardingPanel scenario={sc}/>}
          {sc.alarmMode && <AlarmPanel scenario={sc}/>}

          {onSignOut && (
            <div style={{ display: "flex", justifyContent: "center", padding: "0 0 8px" }}>
              <button onClick={onSignOut} style={{
                background: "transparent", border: "none", padding: "10px 14px", cursor: "pointer",
                color: "var(--text-primary)",
                fontFamily: "var(--typo-body-medium-regular-family)",
                fontSize: 13, fontWeight: 600,
              }}>Sign out</button>
            </div>
          )}
        </div>

        <ListeningBar
            open={aiChatOpen && !textPromptOpen}
            onTap={(target) => { if (target === "text") { setTextPromptOpen(true); } }}
            onClose={() => { setTextPromptOpen(true); }}
            muted={barMuted}
            setMuted={setBarMuted}
            barMode={barMode}
          />
          <TextPromptBar
            open={aiChatOpen && textPromptOpen}
            onSwitchToVoice={() => { setTextPromptOpen(false); setBarMode("waiting"); }}
            onSubmit={(v) => { setTextPromptOpen(false); setBarMode("waiting"); }}
            onClose={() => { setAiChatOpen(false); setTextPromptOpen(false); }}
          />

        {/* bottom AppNav */}
        <div style={{ flexShrink: 0 }}>
          <AppNav
            variant="standard"
            platform={tweaks.platform === "android" ? "android" : "ios"}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            width={390}
          />
        </div>
      </div>
    );
  }

  /* ── Inject one-off CSS ──────────────────────────────────────────── */
  if (!document.getElementById("shp-home-styles")) {
    const s = document.createElement("style");
    s.id = "shp-home-styles";
    s.textContent = `
      @keyframes shp-orb-pulse {
        0%   { transform: scale(1);   opacity: 0.7; }
        100% { transform: scale(1.35); opacity: 0; }
      }
      @keyframes shp-alarm-blink {
        0%, 100% { opacity: 1; transform: scale(1);   }
        50%      { opacity: 0.55; transform: scale(0.85); }
      }
      /* hide horizontal scrollbars on the chip / camera rows */
      .      @keyframes shp-status-blink {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.35; }
      }
      @keyframes shp-live-glow {
        0%, 100% { box-shadow: 0 12px 28px rgba(75, 40, 109, 0.22), 0 2px 6px rgba(75, 40, 109, 0.18), 0 0 0 0 rgba(196, 142, 234, 0.55); }
        50%      { box-shadow: 0 12px 28px rgba(75, 40, 109, 0.22), 0 2px 6px rgba(75, 40, 109, 0.18), 0 0 28px 6px rgba(196, 142, 234, 0.65); }
      }
      @keyframes shp-mic-pulse {
        0%, 100% { transform: scale(0.9); opacity: 0.55; }
        50%      { transform: scale(1.25); opacity: 1; }
      }
      @keyframes shp-typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
        30% { transform: translateY(-3px); opacity: 1; }
      }
      @keyframes shp-wave {
        0%, 100% { transform: scaleY(0.55); }
        50% { transform: scaleY(1); }
      }
      @keyframes shp-build-in {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: no-preference) {
        .shp-build.is-building > * {
          animation: shp-build-in 480ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .shp-build.is-building > *:nth-child(1) { animation-delay: 0ms; }
        .shp-build.is-building > *:nth-child(2) { animation-delay: 60ms; }
        .shp-build.is-building > *:nth-child(3) { animation-delay: 130ms; }
        .shp-build.is-building > *:nth-child(4) { animation-delay: 200ms; }
        .shp-build.is-building > *:nth-child(5) { animation-delay: 270ms; }
        .shp-build.is-building > *:nth-child(6) { animation-delay: 340ms; }
        .shp-build.is-building > *:nth-child(7) { animation-delay: 410ms; }
        .shp-build.is-building > *:nth-child(8) { animation-delay: 480ms; }
        .shp-build.is-building > *:nth-child(9) { animation-delay: 550ms; }
      }
      .shp-noscroll::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(s);
  }

  Object.assign(window, { HomeScreen });
})();
