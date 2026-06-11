// CDS token data — primitives, brand, platform, theme aliases, semantic.
// Values lifted verbatim from the CDS JSON token files. The resolver at the
// bottom walks the alias chain per active brand + platform.

const PRIMITIVE = {
  space: {
    none: 0, xxsmall: 2, xsmall: 4, small: 8, medium: 12,
    large: 16, xlarge: 24, xxlarge: 32, xxxlarge: 48,
  },
  border: {
    radius: { none: 0, xsmall: 4, small: 8, medium: 12, large: 16, xlarge: 24, full: 999 },
    width:  { none: 0, hairline: 0.5, thin: 1, thick: 2, heavy: 4 },
  },
  opacity: { transparent: 0, semiTransparent: 0.2, light: 0.4, medium: 0.6, semiSolid: 0.8, solid: 1 },
  text: {
    fontSize:  { 1:11, 2:12, 3:13, 4:14, 5:15, 6:17, 7:20, 8:22, 9:28, 10:34, 11:40, 12:64, 13:128 },
    lineHeight:{ 1:13, 2:16, 3:18, 4:20, 5:21, 6:22, 7:25, 8:28, 9:34, 10:41, 11:48, 12:76, 13:132 },
    letterSpace: { dense:-0.6, tight:-0.4, snug:-0.2, default:0, relaxed:0.2, loose:0.4, editorial:0.6 },
    paragraphSpace: { none:0, tight:4, snug:8, default:16, relaxed:24, loose:32 },
  },
  global: {
    color: {
      green: { 50:"#cfffcf",100:"#acffac",200:"#8aff8a",300:"#06ff2d",400:"#00d51a",500:"#00ab0b",600:"#008101",700:"#005700",800:"#002d00",900:"#000300" },
      amber: { 50:"#fff4df",100:"#faca69",200:"#e7a727",300:"#c98a0a",400:"#aa750b",500:"#906308",600:"#755006",700:"#563b03",800:"#372502",900:"#150e00" },
      red:   { 50:"#ffeff1",100:"#ffc1c9",200:"#ff93a0",300:"#f36b7c",400:"#f4213c",500:"#d80b25",600:"#ab1326",700:"#810414",800:"#53030d",900:"#280005" },
      grey:  { 0:"#ffffff",50:"#fafafa",100:"#f4f4f7",200:"#d0d0d2",300:"#b4b4b7",400:"#9a9a9d",500:"#818186",600:"#6e6e73",700:"#57575b",800:"#28282a",900:"#151515",1000:"#000000" },
      blue:  { 50:"#e9f5ff",100:"#b1d7fe",200:"#7cbbff",300:"#409dfe",400:"#0780ff",500:"#006cde",600:"#0057b1",700:"#003f81",800:"#002852",900:"#000f1f" },
    },
  },
};

const BRAND = {
  telus: {
    label: "TELUS",
    color: {
      purple:{50:"#f8f0ff",100:"#dfc9f3",200:"#c9a4ea",300:"#b287d8",400:"#a069d2",500:"#7c53a5",600:"#613889",700:"#4b286d",800:"#361a4f",900:"#0e001e"},
      green: {50:"#f4f9f2",100:"#e3f6d1",200:"#bfe797",300:"#66cc00",400:"#39940b",500:"#2a7c00",600:"#2b5e00",700:"#163e06",800:"#0f2d00",900:"#061300"},
      grey:  {50:"#fafafa",100:"#f4f4f7",200:"#d0d0d2",300:"#b4b4b7",400:"#9a9a9d",500:"#818186",600:"#6e6e73",700:"#54595f",800:"#414547",900:"#2c2e30"},
    },
    font: {
      primary: '"HN for TELUS", "Helvetica Neue", Helvetica, Arial, sans-serif',
      primaryCSS: '"HN for TELUS", "Helvetica Neue", Helvetica, Arial, sans-serif',
      primaryLabel: 'HN for TELUS',
    },
    weightRemap: { light:"Regular", regular:"Regular", medium:"Md", semibold:"Md", bold:"Bold" },
    scales: ["purple","green","grey"],
    tagline: "Let's make the future friendly",
  },
  homi: {
    label: "Homi",
    color: {
      teal:  {50:"#EBFBF8",100:"#D8F8F2",200:"#B1F1E5",300:"#8BEAD7",400:"#64E3CA",500:"#3DDCBD",600:"#31B097",700:"#258471",800:"#18584C",900:"#0C2C26"},
      blue:  {50:"#E6F1FF",100:"#CEE3FF",200:"#9DC6FF",300:"#6BAAFF",400:"#3A8DFF",500:"#0971FF",600:"#075ACC",700:"#054499",800:"#042D66",900:"#021733"},
      yellow:{50:"#FFFDEB",100:"#FFFBD8",200:"#FFF9C4",300:"#FFF59D",400:"#FFF389",500:"#FFEB3B",600:"#E5D335",700:"#CCBC2F",800:"#B2A429",900:"#998D23"},
    },
    font: {
      primary: 'Merriweather, Georgia, "Times New Roman", serif',
      primaryCSS: 'Merriweather, Georgia, "Times New Roman", serif',
      primaryLabel: 'Merriweather',
    },
    weightRemap: { light:"Light", regular:"Regular", medium:"SemiBold", semibold:"SemiBold", bold:"Bold" },
    scales: ["teal","blue","yellow"],
    tagline: "A home that listens back",
  },
};

// Theme alias definitions — the mapping of theme roles to primitive stops.
// Mirrors the role aliases declared in src/tokens/brand-{brand}.css.
const THEME = {
  telus: {
    primary:  { lighter:["brand","purple","50"], light:["brand","purple","300"], pure:["brand","purple","700"], dark:["brand","purple","800"], darker:["brand","purple","900"] },
    secondary:{ lighter:["brand","green","100"], light:["brand","green","200"], pure:["brand","green","600"], dark:["brand","green","800"], darker:["brand","green","900"] },
    tertiary: { lighter:["brand","green","100"], light:["brand","green","200"], pure:["brand","green","300"], dark:["brand","green","600"], darker:["brand","green","800"] },
    neutral:  { lightest:["brand","grey","50"], lighter:["brand","grey","100"], light:["brand","grey","200"], pure:["brand","grey","500"], dark:["brand","grey","700"], darker:["brand","grey","800"], darkest:["brand","grey","900"] },
    info:     { lighter:["global","blue","50"], light:["global","blue","200"], pure:["global","blue","500"], dark:["global","blue","700"], darker:["global","blue","800"] },
    success:  { lighter:["global","green","50"], light:["global","green","200"], pure:["global","green","500"], dark:["global","green","700"], darker:["global","green","800"] },
    alert:    { lighter:["global","amber","50"], light:["global","amber","200"], pure:["global","amber","500"], dark:["global","amber","700"], darker:["global","amber","800"] },
    error:    { lighter:["global","red","50"], light:["global","red","200"], pure:["global","red","500"], dark:["global","red","700"], darker:["global","red","800"] },
  },
  homi: {
    primary:  { lighter:["brand","teal","300"], light:["brand","teal","500"], pure:["brand","teal","700"], dark:["brand","teal","800"], darker:["brand","teal","900"] },
    secondary:{ lighter:["brand","blue","100"], light:["brand","blue","200"], pure:["brand","blue","600"], dark:["brand","blue","800"], darker:["brand","blue","900"] },
    tertiary: { lighter:["brand","yellow","100"], light:["brand","yellow","300"], pure:["brand","yellow","500"], dark:["brand","yellow","700"], darker:["brand","yellow","900"] },
    neutral:  { lightest:["global","grey","50"], lighter:["global","grey","100"], light:["global","grey","200"], pure:["global","grey","500"], dark:["global","grey","700"], darker:["global","grey","800"], darkest:["global","grey","900"] },
    info:     { lighter:["global","blue","50"], light:["global","blue","200"], pure:["global","blue","500"], dark:["global","blue","700"], darker:["global","blue","800"] },
    success:  { lighter:["global","green","50"], light:["global","green","200"], pure:["global","green","500"], dark:["global","green","700"], darker:["global","green","800"] },
    alert:    { lighter:["global","amber","50"], light:["global","amber","200"], pure:["global","amber","500"], dark:["global","amber","700"], darker:["global","amber","800"] },
    error:    { lighter:["global","red","50"], light:["global","red","200"], pure:["global","red","500"], dark:["global","red","700"], darker:["global","red","800"] },
  },
};

const PLATFORM = {
  ios:     { label:"iOS",     font: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif', fontLabel:"SF Pro" },
  android: { label:"Android", font: 'Roboto, "Noto Sans", system-ui, sans-serif',                   fontLabel:"Roboto" },
  web:     { label:"Web",     font: '"Noto Sans", system-ui, sans-serif',                           fontLabel:"Noto Sans" },
};

// ---- Resolver ----------------------------------------------------------
function lookupScale(brand, ref) {
  const [space, scale, stop] = ref;
  if (space === "brand") return BRAND[brand].color[scale]?.[stop];
  if (space === "global") return PRIMITIVE.global.color[scale]?.[stop];
}

function resolveTheme(brand) {
  const theme = THEME[brand];
  const out = {};
  for (const role of Object.keys(theme)) {
    out[role] = {};
    for (const stop of Object.keys(theme[role])) {
      out[role][stop] = lookupScale(brand, theme[role][stop]);
    }
  }
  return out;
}

// Semantic colour mapping, encoded as theme lookups.
// Mirrors the role assignments in src/tokens/semantic.css.
// Format: [category, name, [role, stop]] OR [..., "#hex"] OR [..., "base","white"|"black"]
const SEMANTIC_COLOR = {
  background: {
    primary:         ["primary","pure"],
    primarySubtle:   ["primary","lighter"],
    primaryBold:     ["primary","dark"],
    primaryInverse:  ["base","white"],
    secondary:       ["secondary","pure"],
    secondarySubtle: ["secondary","lighter"],
    secondaryBold:   ["secondary","dark"],
    secondaryInverse:["base","white"],
    tertiary:        ["tertiary","pure"],
    tertiarySubtle:  ["tertiary","light"],
    tertiaryBold:    ["tertiary","dark"],
    tertiaryInverse: ["base","white"],
    neutral:         ["neutral","pure"],
    neutralSubtle:   ["neutral","lighter"],
    neutralBold:     ["neutral","darker"],
    neutralInverse:  ["base","white"],
    app:             ["base","white"],
    appNeutral:      ["neutral","lighter"],
    modal:           ["neutral","lighter"],
    disabled:        ["neutral","lighter"],
    disabledBold:    ["neutral","light"],
    disabledSubtle:  ["neutral","lightest"],
    video:           ["base","black"],
    overlay:         ["raw","#00000099"],
    tabbar:          ["neutral","lighter"],
    success:         ["success","pure"],
    successSubtle:   ["success","lighter"],
    successBold:     ["success","dark"],
    successInverse:  ["base","white"],
    alert:           ["alert","light"],
    alertSubtle:     ["alert","lighter"],
    alertBold:       ["alert","pure"],
    alertInverse:    ["base","white"],
    error:           ["error","pure"],
    errorSubtle:     ["error","lighter"],
    errorBold:       ["error","dark"],
    errorInverse:    ["base","white"],
    info:            ["info","pure"],
    infoSubtle:      ["info","lighter"],
    infoBold:        ["info","dark"],
    infoInverse:     ["base","white"],
  },
  text: {
    primary:        ["primary","pure"],
    primaryInverse: ["base","white"],
    primarySubtle:  ["primary","light"],
    primaryBold:    ["primary","dark"],
    secondary:      ["secondary","pure"],
    secondaryInverse:["base","white"],
    secondarySubtle:["secondary","light"],
    secondaryBold:  ["secondary","dark"],
    tertiary:       ["tertiary","pure"],
    tertiaryInverse:["base","white"],
    tertiarySubtle: ["tertiary","light"],
    tertiaryBold:   ["tertiary","dark"],
    neutral:        ["neutral","dark"],
    neutralInverse: ["base","white"],
    neutralSubtle:  ["neutral","pure"],
    neutralBold:    ["neutral","darker"],
    neutralBolder:  ["base","black"],
    success:        ["success","pure"],
    successBold:    ["success","dark"],
    alert:          ["alert","pure"],
    alertBold:      ["alert","dark"],
    error:          ["error","pure"],
    errorBold:      ["error","dark"],
    info:           ["info","pure"],
    infoBold:       ["info","dark"],
  },
  border: {
    primary:       ["primary","light"],
    primarySubtle: ["primary","lighter"],
    primaryBold:   ["primary","dark"],
    secondary:     ["secondary","pure"],
    neutral:       ["neutral","light"],
    neutralSubtle: ["neutral","lighter"],
    neutralBold:   ["neutral","dark"],
    success:       ["success","pure"],
    alert:         ["alert","light"],
    alertBold:     ["alert","pure"],
    error:         ["error","pure"],
    info:          ["info","pure"],
  },
  icon: {
    primary:       ["primary","pure"],
    primaryBold:   ["primary","dark"],
    neutral:       ["neutral","dark"],
    neutralSubtle: ["neutral","pure"],
    neutralBold:   ["neutral","darker"],
    success:       ["success","pure"],
    alert:         ["alert","pure"],
    error:         ["error","pure"],
    info:          ["info","pure"],
  },
};

function resolveSemanticColor(brand) {
  const theme = resolveTheme(brand);
  const base = { white: PRIMITIVE.global.color.grey[0], black: PRIMITIVE.global.color.grey[1000] };
  const out = {};
  for (const [cat, roles] of Object.entries(SEMANTIC_COLOR)) {
    out[cat] = {};
    for (const [tok, [ns, stop]] of Object.entries(roles)) {
      if (ns === "raw") out[cat][tok] = stop;
      else if (ns === "base") out[cat][tok] = base[stop];
      else out[cat][tok] = theme[ns]?.[stop];
    }
  }
  return { theme, base, semantic: out };
}

// Typography — semantic text tokens expressed with the sizes/weights
// each one resolves to. Weight refers to a logical bucket that the brand's
// weightRemap may collapse.
const TYPO = [
  { path: "display.xlarge",            source: "brand",    size: 13, weight: "regular",  lh: 13, ls: "dense" },
  { path: "display.large",             source: "brand",    size: 12, weight: "regular",  lh: 12, ls: "tight" },
  { path: "display.medium",            source: "brand",    size: 11, weight: "regular",  lh: 11, ls: "tight" },
  { path: "display.small",             source: "brand",    size: 9,  weight: "regular",  lh: 9,  ls: "tight" },
  { path: "heading.xxlarge.bold",      source: "brand",    size: 10, weight: "bold",     lh: 10, ls: "tight" },
  { path: "heading.xxlarge.regular",   source: "brand",    size: 10, weight: "medium",   lh: 10, ls: "tight" },
  { path: "heading.xlarge.bold",       source: "brand",    size: 9,  weight: "bold",     lh: 9,  ls: "tight" },
  { path: "heading.xlarge.regular",    source: "brand",    size: 9,  weight: "medium",   lh: 9,  ls: "tight" },
  { path: "heading.large.bold",        source: "platform", size: 8,  weight: "bold",     lh: 8,  ls: "tight" },
  { path: "heading.large.regular",     source: "platform", size: 8,  weight: "medium",   lh: 8,  ls: "tight" },
  { path: "heading.large.light",       source: "platform", size: 8,  weight: "regular",  lh: 8,  ls: "tight" },
  { path: "heading.medium.bold",       source: "platform", size: 7,  weight: "bold",     lh: 7,  ls: "tight" },
  { path: "heading.medium.regular",    source: "platform", size: 7,  weight: "medium",   lh: 7,  ls: "tight" },
  { path: "heading.medium.light",      source: "platform", size: 7,  weight: "regular",  lh: 7,  ls: "tight" },
  { path: "heading.small.bold",        source: "platform", size: 6,  weight: "semibold", lh: 6,  ls: "tight" },
  { path: "body.large.regular",        source: "platform", size: 5,  weight: "regular",  lh: 4,  ls: "tight" },
  { path: "body.large.bold",           source: "platform", size: 5,  weight: "semibold", lh: 4,  ls: "tight" },
  { path: "body.medium.regular",       source: "platform", size: 3,  weight: "regular",  lh: 3,  ls: "tight" },
  { path: "body.medium.bold",          source: "platform", size: 3,  weight: "semibold", lh: 3,  ls: "tight" },
  { path: "body.small.regular",        source: "platform", size: 2,  weight: "regular",  lh: 2,  ls: "default" },
  { path: "body.small.bold",           source: "platform", size: 2,  weight: "semibold", lh: 2,  ls: "default" },
  { path: "interface.label.large",     source: "platform", size: 4,  weight: "medium",   lh: 2,  ls: "default" },
  { path: "interface.label.small",     source: "platform", size: 1,  weight: "semibold", lh: 1,  ls: "default" },
  { path: "interface.caption.regular", source: "platform", size: 5,  weight: "regular",  lh: 5,  ls: "default" },
  { path: "interface.caption.bold",    source: "platform", size: 5,  weight: "semibold", lh: 5,  ls: "default" },
  { path: "interface.footnote.regular",source: "platform", size: 3,  weight: "regular",  lh: 3,  ls: "default" },
  // Component semantic typography — purpose-built for specific UI components.
  // Per CDS typography spec: these exist where a component has a distinct
  // typographic need that doesn't map cleanly to an interface/body token.
  { path: "component.button.large",    source: "platform", size: 5,  weight: "medium",   lh: 4,  ls: "dense" },
  { path: "component.button.small",    source: "platform", size: 4,  weight: "semibold", lh: 4,  ls: "dense" },
  { path: "component.card.heading.large",     source: "platform", size: 5,  weight: "medium",   lh: 4,  ls: "tight" },
  { path: "component.card.heading.largeBold", source: "platform", size: 5,  weight: "semibold", lh: 4,  ls: "tight" },
  { path: "component.card.heading.small",     source: "platform", size: 4,  weight: "semibold", lh: 3,  ls: "tight" },
  { path: "component.pill",            source: "platform", size: 4,  weight: "medium",   lh: 4,  ls: "default" },
  { path: "component.tag.large",       source: "platform", size: 4,  weight: "bold",     lh: 2,  ls: "default" },
  { path: "component.tag.small",       source: "platform", size: 1,  weight: "semibold", lh: 1,  ls: "default" },
];

// Which CSS font-weight numeric corresponds to each named weight
const WEIGHT_TO_CSS = { Light:300, Regular:400, Medium:500, Md:500, SemiBold:600, Semibold:600, Bold:700 };

function resolveTypographyRow(brand, platform, row) {
  const brandDef = BRAND[brand];
  const platDef  = PLATFORM[platform];
  const fontFamily = row.source === "brand" ? brandDef.font.primary : platDef.font;
  const fontLabel  = row.source === "brand" ? brandDef.font.primaryLabel : platDef.fontLabel;
  // Weight resolution: brand fonts use the brand's remap for brand-sourced
  // typography; platform fonts use the literal weight name.
  const brandWeight    = brandDef.weightRemap[row.weight] ?? row.weight;
  const platformWeight = row.weight.charAt(0).toUpperCase() + row.weight.slice(1);
  const weightName = row.source === "brand" ? brandWeight : platformWeight;
  const cssWeight  = WEIGHT_TO_CSS[weightName] ?? 400;
  return {
    ...row,
    fontFamily, fontLabel,
    weightName, cssWeight,
    fontSize: PRIMITIVE.text.fontSize[row.size],
    lineHeight: PRIMITIVE.text.lineHeight[row.lh],
    letterSpacing: PRIMITIVE.text.letterSpace[row.ls],
  };
}

window.CDS = {
  PRIMITIVE, BRAND, THEME, PLATFORM, SEMANTIC_COLOR, TYPO,
  resolveTheme, resolveSemanticColor, resolveTypographyRow,
  readVar, semanticVar, themeVar,
};

// ---- CSS variable helpers (the site consumes the split files in src/tokens/ directly) --
function readVar(name) {
  // name like "--background-primary"; returns resolved computed value.
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || undefined;
}
// camelCase token -> kebab-case CSS var. "primarySubtle" -> "primary-subtle".
function kebab(s) { return s.replace(/([A-Z])/g, "-$1").toLowerCase(); }
function semanticVar(cat, tok) { return `var(--${cat}-${kebab(tok)})`; }
function themeVar(role, stop)  { return `var(--color-${role}-${stop})`; }
// Re-assign window.CDS so the helpers are actually exported (order matters
// because functions declared below the assignment above would be undefined).
Object.assign(window.CDS, { readVar, semanticVar, themeVar });
