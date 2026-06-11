/* SmartHome+ home screen — composes CDS DeviceTile, ToggleButton, Pill,
 * Tag, AppNav and AiAssistantButton into a competitor-grade home dashboard.
 *
 * Sections (top to bottom, scrollable):
 *   1. Top app bar          — greeting, location chip, bell
 *   2. Status hero          — "Home is secure" + 4 vitals (locks / cameras / sensors / temp)
 *   3. Scenes row           — Pill group (horizontal scroll)
 *   4. Favorites grid       — 4 DeviceTiles (lock, lights, thermostat, plug)
 *   5. Cameras              — 2 live thumbnails with last-event timestamps
 *   6. Rooms                — compact list
 *   7. Recent activity      — last 3 events
 *   8. Bottom AppNav (ai)   — sticky inside the phone
 */
(function () {
  const { useState, useMemo } = React;
  const { Icon, DeviceTile, Pill, Tag, AppNav, IOSStatusBar } = window;

  /* ── Tokens helpers ─────────────────────────────────────────────── */

  function CDSIcon({ name, size = 20, color = "currentColor" }) {
    if (!Icon) return null;
    return <Icon name={name} size={size} color={color}/>;
  }

  /* ── 1 · Top bar ────────────────────────────────────────────────── */

  function TopBar({ name = "Alex", location, onLocation, unread = 2 }) {
    const greeting = useMemo(() => {
      const h = new Date().getHours();
      if (h < 5) return "Up late";
      if (h < 12) return "Good morning";
      if (h < 18) return "Good afternoon";
      return "Good evening";
    }, []);
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 20px 4px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--platform-font-default, var(--platform-font))",
            fontSize: 12, fontWeight: 600, color: "var(--text-neutral-subtle)",
            letterSpacing: "0.04em",
          }}>{greeting}, {name}.</div>
          <button
            onClick={onLocation}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: 0, background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "var(--typo-heading-medium-bold-family)",
              fontSize: 22, fontWeight: 700, color: "var(--text-neutral-bolder)",
              letterSpacing: "-0.01em",
            }}>
            <span>{location}</span>
            <CDSIcon name="arrowChevronDownLine" size={20} color="var(--icon-neutral)"/>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconBtn icon="actionPlusLine" label="Add device"/>
          <IconBtn icon="objectBellLine" label="Notifications" badge={unread}/>
        </div>
      </div>
    );
  }

  function IconBtn({ icon, label, badge }) {
    return (
      <button aria-label={label} style={{
        position: "relative", width: 44, height: 44, padding: 0,
        background: "var(--background-neutral-subtle)",
        border: "none", borderRadius: "var(--radius-full)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "var(--text-neutral-bolder)",
      }}>
        <CDSIcon name={icon} size={20} color="var(--icon-neutral-bold)"/>
        {badge ? (
          <span style={{
            position: "absolute", top: 4, right: 4,
            minWidth: 16, height: 16, padding: "0 4px",
            borderRadius: "var(--radius-full)",
            background: "var(--background-error)",
            color: "var(--background-error-inverse, #fff)",
            fontSize: 10, fontWeight: 700,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--background-app)",
            boxSizing: "content-box",
          }}>{badge}</span>
        ) : null}
      </button>
    );
  }

  /* ── 2 · Status hero ────────────────────────────────────────────── */

  function StatusHero({ alert, vitals }) {
    return (
      <div style={{
        margin: "12px 20px 8px",
        borderRadius: "var(--radius-xlarge)",
        padding: 20,
        background:
          alert
            ? "linear-gradient(160deg, var(--color-alert-dark) 0%, var(--color-primary-dark) 100%)"
            : "linear-gradient(160deg, var(--color-primary-pure) 0%, var(--color-primary-dark) 100%)",
        color: "#fff",
        boxShadow: "var(--elevation-level2)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* subtle radial wash */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(120% 90% at 110% -10%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%)",
        }}/>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 36, height: 36, borderRadius: "var(--radius-full)",
              background: alert ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.18)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <CDSIcon name={alert ? "abstractWarningSolid" : "homeAtHomeLeftSolid"} size={20} color="#fff"/>
            </span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.78 }}>
                {alert ? "Needs attention" : "All clear"}
              </div>
              <div style={{
                fontFamily: "var(--typo-heading-large-bold-family)",
                fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginTop: 2,
              }}>{alert ? "Garage door is open" : "Home is secure"}</div>
            </div>
          </div>
          <button style={{
            background: "rgba(255,255,255,0.16)", border: "none", color: "#fff",
            borderRadius: "var(--radius-full)",
            padding: "8px 14px",
            fontFamily: "var(--typo-component-button-small-family)",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          }}>{alert ? "Review" : "Details"}</button>
        </div>

        {/* vitals row */}
        <div style={{
          position: "relative",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12, paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.18)",
        }}>
          {vitals.map((v) => (
            <div key={v.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.82)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <CDSIcon name={v.icon} size={14} color="rgba(255,255,255,0.82)"/>
                {v.label}
              </span>
              <span style={{
                fontFamily: "var(--typo-heading-medium-bold-family)",
                fontSize: 18, fontWeight: 700, lineHeight: 1.1, color: "#fff",
              }}>{v.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── 3 · Scenes row ─────────────────────────────────────────────── */

  function ScenesRow({ scenes, active, setActive }) {
    return (
      <div style={{ padding: "12px 0 8px" }}>
        <SectionHeader title="Scenes" hint={`${scenes.length} ready`} action="Edit"/>
        <div style={{
          display: "flex", gap: 8,
          padding: "8px 20px 4px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {scenes.map((s) => (
            <Pill
              key={s.id}
              label={s.label}
              state={active === s.id ? "selected-high" : "unselected"}
              leadingIcon={<CDSIcon name={s.icon} size={18} color={active === s.id ? "var(--background-primary-inverse, #fff)" : "var(--text-neutral-bold)"}/>}
              onClick={() => setActive(s.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  function SectionHeader({ title, hint, action, onAction }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h2 style={{
            margin: 0,
            fontFamily: "var(--typo-heading-medium-bold-family)",
            fontSize: 18, fontWeight: 700, color: "var(--text-neutral-bolder)",
            letterSpacing: "-0.01em",
          }}>{title}</h2>
          {hint && (
            <span style={{ fontSize: 12, color: "var(--text-neutral-subtle)" }}>{hint}</span>
          )}
        </div>
        {action && (
          <button onClick={onAction} style={{
            background: "transparent", border: "none", padding: 4, cursor: "pointer",
            color: "var(--text-primary)", fontFamily: "var(--typo-body-medium-regular-family)",
            fontSize: 13, fontWeight: 600,
          }}>{action}</button>
        )}
      </div>
    );
  }

  /* ── 4 · Favorites grid (DeviceTile composition) ────────────────── */

  function FavoritesGrid({ devices, onToggle, onPress }) {
    return (
      <div>
        <SectionHeader title="Favorites" hint={`${devices.length} devices`} action="See all"/>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12, padding: "12px 20px 4px",
        }}>
          {devices.map((d, i) => (
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

  /* ── 5 · Cameras strip ──────────────────────────────────────────── */

  function CamerasStrip({ cams }) {
    return (
      <div>
        <SectionHeader title="Cameras" hint={`${cams.filter(c => c.live).length} live`} action="View all"/>
        <div style={{
          display: "flex", gap: 12,
          padding: "12px 20px 4px",
          overflowX: "auto",
        }}>
          {cams.map((c) => <CameraCard key={c.id} cam={c}/>)}
        </div>
      </div>
    );
  }

  function CameraCard({ cam }) {
    // SVG placeholder background — abstract scene gradient + camera glyph
    const bg = cam.tone === "outdoor"
      ? "linear-gradient(140deg, #0e2f4c 0%, #1a4d7a 40%, #2e6fa3 100%)"
      : "linear-gradient(140deg, #1f1a2c 0%, #3a2e54 50%, #6b4d8a 100%)";
    return (
      <div style={{
        flexShrink: 0,
        width: 220, height: 138,
        borderRadius: "var(--radius-large)",
        overflow: "hidden",
        position: "relative",
        background: bg,
        boxShadow: "var(--elevation-level1)",
        color: "#fff",
      }}>
        {/* abstract scene */}
        <svg viewBox="0 0 220 138" width="220" height="138" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
          {cam.tone === "outdoor" ? (
            <>
              <rect width="220" height="80" fill="rgba(255,255,255,0.06)"/>
              <path d="M0 90 L40 80 L80 95 L130 78 L180 95 L220 84 L220 138 L0 138 Z" fill="rgba(0,0,0,0.35)"/>
              <circle cx="180" cy="30" r="14" fill="rgba(255,255,255,0.18)"/>
            </>
          ) : (
            <>
              <rect width="220" height="138" fill="rgba(0,0,0,0.25)"/>
              <rect x="40" y="50" width="60" height="55" rx="6" fill="rgba(255,255,255,0.1)"/>
              <rect x="115" y="65" width="70" height="40" rx="6" fill="rgba(255,255,255,0.08)"/>
            </>
          )}
        </svg>
        {/* top row */}
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
          }}>
            <CDSIcon name="actionMicrophoneLine" size={12} color="#fff"/>
            HD
          </span>
        </div>
        {/* bottom row */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px 12px 10px",
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{cam.name}</div>
          <div style={{ fontSize: 11, opacity: 0.82, marginTop: 2 }}>{cam.event}</div>
        </div>
      </div>
    );
  }

  /* ── 6 · Rooms list ─────────────────────────────────────────────── */

  function RoomsList({ rooms }) {
    return (
      <div>
        <SectionHeader title="Rooms" action="Manage"/>
        <div style={{
          margin: "12px 20px 4px",
          background: "var(--background-app)",
          borderRadius: "var(--radius-large)",
          border: "var(--border-width-thin) solid var(--border-neutral-subtle)",
          overflow: "hidden",
        }}>
          {rooms.map((r, i) => (
            <button key={r.id} style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 16px",
              background: "transparent", border: "none",
              borderTop: i === 0 ? "none" : "1px solid var(--border-neutral-subtle)",
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: "var(--radius-medium)",
                background: "var(--background-primary-subtle)",
                color: "var(--text-primary)",
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <CDSIcon name={r.icon} size={20} color="var(--icon-primary)"/>
              </span>
              <span style={{
                flex: 1, minWidth: 0,
                fontFamily: "var(--typo-body-large-bold-family)",
                fontSize: 15, fontWeight: 600, color: "var(--text-neutral-bolder)",
              }}>{r.name}</span>
              <span style={{ fontSize: 12, color: "var(--text-neutral-subtle)" }}>
                {r.on} on · {r.total} devices
              </span>
              <CDSIcon name="arrowChevronRightLine" size={18} color="var(--icon-neutral-subtle)"/>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── 7 · Activity ───────────────────────────────────────────────── */

  function ActivityFeed({ events }) {
    return (
      <div>
        <SectionHeader title="Recent activity" action="See all"/>
        <div style={{
          margin: "12px 20px 4px",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {events.map((e) => <ActivityRow key={e.id} e={e}/>)}
        </div>
      </div>
    );
  }

  function ActivityRow({ e }) {
    const dotBg = {
      info: "var(--background-info-subtle)",
      success: "var(--background-success-subtle)",
      alert: "var(--background-alert-subtle)",
    }[e.tone] || "var(--background-neutral-subtle)";
    const dotColor = {
      info: "var(--icon-info)",
      success: "var(--text-success-bold)",
      alert: "var(--text-alert-bold)",
    }[e.tone] || "var(--icon-neutral)";
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px",
        background: "var(--background-app)",
        borderRadius: "var(--radius-medium)",
        border: "var(--border-width-thin) solid var(--border-neutral-subtle)",
      }}>
        <span style={{
          width: 36, height: 36, borderRadius: "var(--radius-full)",
          background: dotBg, color: dotColor,
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <CDSIcon name={e.icon} size={18} color={dotColor}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--typo-body-medium-bold-family)",
            fontSize: 14, fontWeight: 600, color: "var(--text-neutral-bolder)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{e.text}</div>
          <div style={{ fontSize: 12, color: "var(--text-neutral-subtle)", marginTop: 2 }}>{e.when} · {e.where}</div>
        </div>
        {e.tagText && (
          <Tag style={e.tagStatus || "neutral"} size="small">{e.tagText}</Tag>
        )}
      </div>
    );
  }

  /* ── HOME SCREEN ────────────────────────────────────────────────── */

  const DEFAULT_SCENES = [
    { id: "home", label: "I'm home",   icon: "homeAtHomeLeftSolid" },
    { id: "away", label: "Away",       icon: "homeAwaySolid" },
    { id: "night",label: "Good night", icon: "homeBedSolid" },
    { id: "movie",label: "Movie time", icon: "homeComfortDevicesSolid" },
    { id: "wake", label: "Wake up",    icon: "homeBulbSolid" },
  ];

  function HomeScreen({ tweaks, onSignOut }) {
    const [activeScene, setActiveScene] = useState("home");
    const [activeTab, setActiveTab] = useState("home");
    const [aiState, setAiState] = useState("default");
    const [location, setLocation] = useState(tweaks.brand === "homi" ? "47 Maple Ave" : "Riverside home");

    const [devices, setDevices] = useState([
      { id: "lock",  name: "Front door",     state: "on",  statusText: "Locked",       icon: "homeDoorLockSolid",   statusIcon: "homeDoorLockSolid" },
      { id: "lights",name: "Living room",    state: "on",  statusText: "55% · Warm",   icon: "homeBulbSolid" },
      { id: "thermo",name: "Hall thermostat",state: "on-thermostat", statusText: "Heat to 21°", icon: "homeThermostatLine", temperature: "21.5°" },
      { id: "plug",  name: "Kitchen plug",   state: "off", statusText: "Idle",         icon: "homePlugLine" },
    ]);

    const cams = [
      { id: "drive",  name: "Driveway",      event: "Motion · 3 min ago", live: true, tone: "outdoor" },
      { id: "back",   name: "Back garden",   event: "Person · 22 min ago", live: true, tone: "outdoor" },
      { id: "garage", name: "Garage",        event: "Door closed · 1 h",  live: false, tone: "indoor" },
    ];

    const rooms = [
      { id: "lr",  name: "Living room", icon: "homeComfortDevicesSolid", on: 3, total: 7 },
      { id: "kit", name: "Kitchen",      icon: "homePlugLine",            on: 1, total: 4 },
      { id: "br1", name: "Primary bedroom", icon: "homeBedSolid",          on: 0, total: 5 },
      { id: "out", name: "Outdoors",     icon: "homeFenceSolid",          on: 2, total: 6 },
    ];

    const events = [
      { id: "e1", icon: "homeDoorLockSolid",      tone: "success", text: "Front door unlocked by Alex", when: "3 min ago", where: "Front door",      tagText: "Live", tagStatus: "success" },
      { id: "e2", icon: "abstractMotionSolid",    tone: "info",    text: "Motion detected — Driveway",   when: "12 min ago", where: "Driveway",       tagText: "Clip", tagStatus: "primary" },
      { id: "e3", icon: "abstractWarningSolid",   tone: "alert",   text: "Garage door left open 18 min", when: "18 min ago", where: "Garage",          tagText: "Open", tagStatus: "alert" },
    ];

    const vitals = [
      { label: "Locked", value: "2 / 2", icon: "homeDoorLockSolid" },
      { label: "Cameras", value: "3 live", icon: "homeVideoCameraSolid" },
      { label: "Sensors", value: "All armed", icon: "homeContactSensorSolid" },
      { label: "Indoor",  value: "21°", icon: "homeThermostatLine" },
    ];

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

    const showAlert = tweaks.alert;
    const useAi = tweaks.ai;

    return (
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        background: "var(--background-app)",
        color: "var(--text-neutral-bolder)",
      }}>
        {/* status bar spacer (matches iOS status bar height ~54px) */}
        <div style={{ height: 54, flexShrink: 0 }}/>

        {/* scrollable content */}
        <div style={{
          flex: 1, overflowY: "auto", overscrollBehavior: "contain",
          paddingBottom: 100,
        }}>
          <TopBar name={tweaks.brand === "homi" ? "Sam" : "Alex"} location={location} unread={showAlert ? 3 : 1}/>
          <StatusHero alert={showAlert} vitals={vitals}/>
          <ScenesRow scenes={DEFAULT_SCENES} active={activeScene} setActive={setActiveScene}/>
          <FavoritesGrid devices={devices} onToggle={toggleDevice} onPress={() => {}}/>
          <CamerasStrip cams={cams}/>
          <RoomsList rooms={rooms}/>
          <ActivityFeed events={events}/>
          <div style={{ padding: "16px 20px 4px", color: "var(--text-neutral-subtle)", fontSize: 11, letterSpacing: "0.04em", textAlign: "center" }}>
            Hub last synced 2 minutes ago
          </div>
          {onSignOut && (
            <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 8px" }}>
              <button onClick={onSignOut} style={{
                background: "transparent", border: "none", padding: "10px 14px", cursor: "pointer",
                color: "var(--text-primary)",
                fontFamily: "var(--typo-body-medium-regular-family)",
                fontSize: 13, fontWeight: 600,
              }}>Sign out</button>
            </div>
          )}
        </div>

        {/* bottom AppNav (sticks to phone bottom) */}
        <div style={{ flexShrink: 0 }}>
          <AppNav
            variant={useAi ? "ai" : "standard"}
            platform={tweaks.platform === "android" ? "android" : "ios"}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAiClick={() => setAiState((s) => s === "listening" ? "default" : "listening")}
            aiState={aiState}
            width={390}
          />
        </div>
      </div>
    );
  }

  Object.assign(window, { HomeScreen });
})();
