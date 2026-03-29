require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !GUILD_ID) {
  console.error("Hiányzik a DISCORD_TOKEN vagy a GUILD_ID a .env fájlból.");
  process.exit(1);
}

const P = PermissionsBitField.Flags;

/* =========================================================
   ALAP SZÍNPALETTA
========================================================= */
const COLORS = {
  SHERIFF: "#7CFC00",
  EXECUTIVE: "#63D471",
  COMMAND: "#FF6A00",
  SUPERVISOR: "#B7FF00",
  PATROL: "#FFD24A",
  CADET: "#FF4D4D",
  DIVISION: "#E8D2B0",
  SWAT: "#B59B53",
  K9: "#F2EBCB",
  TEU: "#F5C400",
  AMD: "#2D9CFF",
  IA: "#D38B1F",
  GOVERNMENT: "#32C86E",
  SPECIAL: "#5EA8FF",
  BOT: "#C327FF",
  OFFICE: "#6C8EA5",
  SEPARATOR: "#9AA4AE",
};

/* =========================================================
   RANGOK
========================================================= */
const ROLE_DEFINITIONS = [
  // Executive command
  {
    name: "Sheriff",
    color: COLORS.SHERIFF,
    hoist: true,
    permissions: [P.Administrator],
  },
  {
    name: "Assistant Sheriff",
    color: COLORS.EXECUTIVE,
    hoist: true,
    permissions: [
      P.ManageGuild,
      P.ViewAuditLog,
      P.ManageRoles,
      P.ManageChannels,
      P.ManageMessages,
      P.KickMembers,
      P.BanMembers,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageNicknames,
      P.ManageEvents,
      P.MentionEveryone,
    ],
  },
  {
    name: "Undersheriff",
    color: COLORS.EXECUTIVE,
    hoist: true,
    permissions: [
      P.ManageGuild,
      P.ViewAuditLog,
      P.ManageRoles,
      P.ManageChannels,
      P.ManageMessages,
      P.KickMembers,
      P.BanMembers,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageNicknames,
      P.ManageEvents,
      P.MentionEveryone,
    ],
  },
  {
    name: "Chief Deputy",
    color: COLORS.EXECUTIVE,
    hoist: true,
    permissions: [
      P.ManageGuild,
      P.ViewAuditLog,
      P.ManageRoles,
      P.ManageChannels,
      P.ManageMessages,
      P.KickMembers,
      P.BanMembers,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageNicknames,
      P.MentionEveryone,
    ],
  },
  {
    name: "Assistant Chief Deputy",
    color: COLORS.EXECUTIVE,
    hoist: true,
    permissions: [
      P.ViewAuditLog,
      P.ManageRoles,
      P.ManageChannels,
      P.ManageMessages,
      P.KickMembers,
      P.BanMembers,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageNicknames,
    ],
  },
  {
    name: "Field Training Officer",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [P.ManageMessages, P.MoveMembers],
  },
  {
    name: "BCSO | Office Communications",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [P.ManageMessages],
  },

  { name: "────────────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // Utility / special
  {
    name: "Local Deputies (Bots)",
    color: COLORS.BOT,
    hoist: true,
    permissions: [],
  },
  {
    name: "Deputy On Duty",
    color: COLORS.SPECIAL,
    hoist: false,
    permissions: [],
  },
  {
    name: "Police Commissioner",
    color: COLORS.SPECIAL,
    hoist: false,
    permissions: [],
  },
  {
    name: "Government Official",
    color: COLORS.GOVERNMENT,
    hoist: false,
    permissions: [],
  },
  {
    name: "Server Staff Member",
    color: COLORS.GOVERNMENT,
    hoist: false,
    permissions: [
      P.ViewAuditLog,
      P.ManageMessages,
      P.ModerateMembers,
      P.MoveMembers,
      P.ManageThreads,
    ],
  },

  { name: "───────────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // Command staff
  {
    name: "Colonel",
    color: COLORS.COMMAND,
    hoist: true,
    permissions: [
      P.ViewAuditLog,
      P.ManageChannels,
      P.ManageRoles,
      P.ManageMessages,
      P.KickMembers,
      P.BanMembers,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageNicknames,
      P.MentionEveryone,
    ],
  },
  {
    name: "Major",
    color: COLORS.COMMAND,
    hoist: true,
    permissions: [
      P.ViewAuditLog,
      P.ManageChannels,
      P.ManageMessages,
      P.KickMembers,
      P.BanMembers,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageNicknames,
    ],
  },
  {
    name: "Captain",
    color: COLORS.COMMAND,
    hoist: true,
    permissions: [
      P.ViewAuditLog,
      P.ManageChannels,
      P.ManageMessages,
      P.KickMembers,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageNicknames,
    ],
  },
  {
    name: "BCSO | Command Staff",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [P.ManageMessages, P.MoveMembers],
  },

  { name: "───────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // Supervisors
  {
    name: "Lieutenant",
    color: COLORS.SUPERVISOR,
    hoist: true,
    permissions: [
      P.ManageMessages,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageThreads,
      P.ManageNicknames,
    ],
  },
  {
    name: "Command Sergeant",
    color: COLORS.SUPERVISOR,
    hoist: true,
    permissions: [
      P.ManageMessages,
      P.ModerateMembers,
      P.MoveMembers,
      P.MuteMembers,
      P.DeafenMembers,
      P.ManageThreads,
    ],
  },
  {
    name: "Sergeant First Class",
    color: COLORS.SUPERVISOR,
    hoist: true,
    permissions: [
      P.ManageMessages,
      P.ModerateMembers,
      P.MoveMembers,
      P.ManageThreads,
    ],
  },
  {
    name: "First Sergeant",
    color: COLORS.SUPERVISOR,
    hoist: true,
    permissions: [
      P.ManageMessages,
      P.ModerateMembers,
      P.MoveMembers,
      P.ManageThreads,
    ],
  },
  {
    name: "Staff Sergeant",
    color: COLORS.SUPERVISOR,
    hoist: true,
    permissions: [
      P.ManageMessages,
      P.ModerateMembers,
      P.MoveMembers,
      P.ManageThreads,
    ],
  },
  {
    name: "Sergeant",
    color: COLORS.SUPERVISOR,
    hoist: true,
    permissions: [
      P.ManageMessages,
      P.ModerateMembers,
      P.MoveMembers,
      P.ManageThreads,
    ],
  },
  {
    name: "BCSO | Supervisor Staff",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [P.ManageMessages],
  },

  {
    name: "Senior Corporal",
    color: COLORS.SUPERVISOR,
    hoist: true,
    permissions: [P.ManageMessages, P.MoveMembers],
  },
  {
    name: "BCSO | Supervisor Instructor",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [P.ManageMessages],
  },
  {
    name: "Field Training Assistant",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [P.ManageMessages],
  },

  { name: "────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // Patrol
  {
    name: "Corporal",
    color: COLORS.PATROL,
    hoist: true,
    permissions: [P.ManageMessages],
  },
  {
    name: "Senior Deputy",
    color: COLORS.PATROL,
    hoist: true,
    permissions: [],
  },
  {
    name: "Deputy I",
    color: COLORS.PATROL,
    hoist: true,
    permissions: [],
  },
  {
    name: "BCSO | Senior Patrol",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [],
  },
  {
    name: "Deputy II",
    color: COLORS.PATROL,
    hoist: true,
    permissions: [],
  },
  {
    name: "Deputy III",
    color: COLORS.PATROL,
    hoist: true,
    permissions: [],
  },
  {
    name: "BCSO | Patrol",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [],
  },

  { name: "──────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // Cadets
  {
    name: "Probationary Deputy",
    color: COLORS.CADET,
    hoist: true,
    permissions: [],
  },
  {
    name: "Cadet",
    color: COLORS.CADET,
    hoist: true,
    permissions: [],
  },
  {
    name: "BCSO | Cadet",
    color: COLORS.OFFICE,
    hoist: false,
    permissions: [],
  },
  {
    name: "Requires Ride-Along",
    color: COLORS.CADET,
    hoist: false,
    permissions: [],
  },
  {
    name: "Awaiting Interview",
    color: COLORS.CADET,
    hoist: false,
    permissions: [],
  },
  {
    name: "Awaiting Training",
    color: COLORS.CADET,
    hoist: false,
    permissions: [],
  },

  { name: "BCSO - Divisions", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // SWAT
  { name: "Special Weapons & Tactics", color: COLORS.DIVISION, hoist: true, permissions: [] },
  { name: "SWAT Lead Command", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Command", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Supervisor", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Member", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Trainee", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Medic", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT (K-9) Canine Unit", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Unit - High-Value Target", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Unit - Warrant Division", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Unit - Bomb Disposal", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Unit - Riot Division", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Unit - Counter-Terror", color: COLORS.SWAT, hoist: false, permissions: [] },
  { name: "SWAT Unit - Tactical Operations", color: COLORS.SWAT, hoist: false, permissions: [] },

  { name: "────────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // CIU
  { name: "Criminal Investigations Unit", color: COLORS.DIVISION, hoist: true, permissions: [] },
  { name: "CIU Lead Command", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Command", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Supervisor", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Detective", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Detective Trainee", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Unit - Criminal Intelligence", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Unit - Gang and Narcotics", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Unit - Counter Terror", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Unit - Major Crimes", color: COLORS.DIVISION, hoist: false, permissions: [] },
  { name: "CIU Unit - Bureau Of Investigations", color: COLORS.DIVISION, hoist: false, permissions: [] },

  { name: "─────────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // K9
  { name: "Canine Unit (K9)", color: COLORS.DIVISION, hoist: true, permissions: [] },
  { name: "K9 Lead Handler", color: COLORS.K9, hoist: false, permissions: [] },
  { name: "K9 Command", color: COLORS.K9, hoist: false, permissions: [] },
  { name: "K9 Supervisor", color: COLORS.K9, hoist: false, permissions: [] },
  { name: "K9 Handler", color: COLORS.K9, hoist: false, permissions: [] },
  { name: "K9 Trainee Handler", color: COLORS.K9, hoist: false, permissions: [] },
  { name: "K9 Dog", color: COLORS.K9, hoist: false, permissions: [] },

  { name: "──────────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // TEU
  { name: "Traffic Enforcement Unit", color: COLORS.DIVISION, hoist: true, permissions: [] },
  { name: "TEU Lead", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Command", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Supervisor", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Member", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Trainee", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Unit - Super Sports", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Unit - Speed Enforcement", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Unit - Motor Bike Patrol", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Unit - Bicycle Patrol", color: COLORS.TEU, hoist: false, permissions: [] },
  { name: "TEU Unit - Offroad Division", color: COLORS.TEU, hoist: false, permissions: [] },

  { name: "───────────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // AMD / MU
  { name: "Aerial and Maritime Division", color: COLORS.DIVISION, hoist: true, permissions: [] },
  { name: "AMD Lead", color: COLORS.AMD, hoist: false, permissions: [] },
  { name: "MU Lead", color: COLORS.AMD, hoist: false, permissions: [] },
  { name: "AMD Deputy", color: COLORS.AMD, hoist: false, permissions: [] },
  { name: "Air Support Unit", color: COLORS.AMD, hoist: false, permissions: [] },
  { name: "Marine Unit", color: COLORS.AMD, hoist: false, permissions: [] },

  { name: "─────────────────", color: COLORS.SEPARATOR, hoist: false, permissions: [] },

  // IA
  { name: "Internal Affairs", color: COLORS.IA, hoist: true, permissions: [] },
  { name: "IA Lead", color: COLORS.SUPERVISOR, hoist: false, permissions: [] },
  { name: "IA Command", color: COLORS.SUPERVISOR, hoist: false, permissions: [] },
  { name: "IA Supervisor", color: COLORS.SUPERVISOR, hoist: false, permissions: [] },
];

/* =========================================================
   HOZZÁFÉRÉSI CSOPORTOK
========================================================= */
const ACCESS = {
  BOT_ACCESS: ["Local Deputies (Bots)"],

  TOP_COMMAND_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
  ],

  COMMAND_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "BCSO | Command Staff",
  ],

  SUPERVISOR_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "BCSO | Command Staff",
    "Lieutenant",
    "Command Sergeant",
    "Sergeant First Class",
    "First Sergeant",
    "Staff Sergeant",
    "Sergeant",
    "Senior Corporal",
    "BCSO | Supervisor Staff",
    "BCSO | Supervisor Instructor",
    "Field Training Officer",
    "Field Training Assistant",
  ],

  PATROL_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "BCSO | Command Staff",
    "Lieutenant",
    "Command Sergeant",
    "Sergeant First Class",
    "First Sergeant",
    "Staff Sergeant",
    "Sergeant",
    "Senior Corporal",
    "BCSO | Supervisor Staff",
    "BCSO | Supervisor Instructor",
    "Field Training Officer",
    "Field Training Assistant",
    "Corporal",
    "Senior Deputy",
    "Deputy I",
    "Deputy II",
    "Deputy III",
    "BCSO | Patrol",
    "BCSO | Senior Patrol",
  ],

  CADET_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "BCSO | Command Staff",
    "Lieutenant",
    "Command Sergeant",
    "Sergeant First Class",
    "First Sergeant",
    "Staff Sergeant",
    "Sergeant",
    "Senior Corporal",
    "BCSO | Supervisor Staff",
    "BCSO | Supervisor Instructor",
    "Field Training Officer",
    "Field Training Assistant",
    "Corporal",
    "Senior Deputy",
    "Deputy I",
    "Deputy II",
    "Deputy III",
    "BCSO | Patrol",
    "BCSO | Senior Patrol",
    "Probationary Deputy",
    "Cadet",
    "BCSO | Cadet",
    "Requires Ride-Along",
    "Awaiting Interview",
    "Awaiting Training",
  ],

  TRAINING_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "BCSO | Command Staff",
    "Lieutenant",
    "Command Sergeant",
    "Sergeant First Class",
    "First Sergeant",
    "Staff Sergeant",
    "Sergeant",
    "Field Training Officer",
    "Field Training Assistant",
    "BCSO | Supervisor Instructor",
    "Probationary Deputy",
    "Cadet",
    "BCSO | Cadet",
    "Requires Ride-Along",
    "Awaiting Interview",
    "Awaiting Training",
  ],

  OFFICE_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "BCSO | Command Staff",
    "BCSO | Office Communications",
  ],

  GOV_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Police Commissioner",
    "Government Official",
  ],

  IA_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Internal Affairs",
    "IA Lead",
    "IA Command",
    "IA Supervisor",
  ],

  SWAT_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "Special Weapons & Tactics",
    "SWAT Lead Command",
    "SWAT Command",
    "SWAT Supervisor",
    "SWAT Member",
    "SWAT Trainee",
    "SWAT Medic",
    "SWAT (K-9) Canine Unit",
    "SWAT Unit - High-Value Target",
    "SWAT Unit - Warrant Division",
    "SWAT Unit - Bomb Disposal",
    "SWAT Unit - Riot Division",
    "SWAT Unit - Counter-Terror",
    "SWAT Unit - Tactical Operations",
  ],

  CIU_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "Criminal Investigations Unit",
    "CIU Lead Command",
    "CIU Command",
    "CIU Supervisor",
    "CIU Detective",
    "CIU Detective Trainee",
    "CIU Unit - Criminal Intelligence",
    "CIU Unit - Gang and Narcotics",
    "CIU Unit - Counter Terror",
    "CIU Unit - Major Crimes",
    "CIU Unit - Bureau Of Investigations",
  ],

  K9_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "Canine Unit (K9)",
    "K9 Lead Handler",
    "K9 Command",
    "K9 Supervisor",
    "K9 Handler",
    "K9 Trainee Handler",
    "K9 Dog",
  ],

  TEU_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "Traffic Enforcement Unit",
    "TEU Lead",
    "TEU Command",
    "TEU Supervisor",
    "TEU Member",
    "TEU Trainee",
    "TEU Unit - Super Sports",
    "TEU Unit - Speed Enforcement",
    "TEU Unit - Motor Bike Patrol",
    "TEU Unit - Bicycle Patrol",
    "TEU Unit - Offroad Division",
  ],

  AMD_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "Aerial and Maritime Division",
    "AMD Lead",
    "MU Lead",
    "AMD Deputy",
    "Air Support Unit",
    "Marine Unit",
  ],

  SERVER_STAFF_ACCESS: [
    "Sheriff",
    "Assistant Sheriff",
    "Undersheriff",
    "Chief Deputy",
    "Assistant Chief Deputy",
    "Colonel",
    "Major",
    "Captain",
    "Server Staff Member",
    "Local Deputies (Bots)",
  ],
};

/* =========================================================
   CSATORNA STRUKTÚRA
========================================================= */
const STRUCTURE = [
  {
    category: "🌐 NYILVÁNOS ÜGYEK - INFORMÁCIÓ",
    visible: ["EVERYONE"],
    channels: [
      { type: "text", name: "🎉・betoppanó", visible: ["EVERYONE"], send: ["EVERYONE"] },
      { type: "text", name: "📣・hivatalos-közlemények", visible: ["EVERYONE"], send: ["COMMAND_ACCESS", "BOT_ACCESS"] },
      { type: "text", name: "⚖️・penal-code", visible: ["EVERYONE"], send: ["COMMAND_ACCESS"] },
      { type: "text", name: "🌐・weboldal", visible: ["EVERYONE"], send: ["OFFICE_ACCESS", "BOT_ACCESS"] },
      { type: "text", name: "🏆・parancsnoki-állomány", visible: ["EVERYONE"], send: ["COMMAND_ACCESS"] },
      { type: "text", name: "💬・nyilvános-csevegő", visible: ["EVERYONE"], send: ["EVERYONE"] },
      { type: "voice", name: "🔊｜public-lobby", visible: ["EVERYONE"], connect: ["EVERYONE"], speak: ["EVERYONE"] },
    ],
  },

  {
    category: "📩 BCSO | EMAILEK",
    visible: ["PATROL_ACCESS", "BOT_ACCESS", "COMMAND_ACCESS"],
    channels: [
      { type: "text", name: "📨・alkalmazott-email", visible: ["PATROL_ACCESS", "COMMAND_ACCESS"], send: ["PATROL_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "📬・publikus-email", visible: ["EVERYONE", "COMMAND_ACCESS", "BOT_ACCESS"], send: ["EVERYONE", "BOT_ACCESS"] },
      { type: "text", name: "📁・archivált-email", visible: ["COMMAND_ACCESS", "OFFICE_ACCESS"], send: ["COMMAND_ACCESS", "OFFICE_ACCESS"] },
    ],
  },

  {
    category: "🧑‍💼 BCSO | ÁLLOMÁNYI ÜGYEK",
    visible: ["CADET_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "📝・osztályűrlapok", visible: ["PATROL_ACCESS", "COMMAND_ACCESS"], send: ["PATROL_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "📚・dokumentumok", visible: ["CADET_ACCESS"], send: ["SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "📬・visszajelzés", visible: ["PATROL_ACCESS", "SUPERVISOR_ACCESS", "COMMAND_ACCESS"], send: ["PATROL_ACCESS", "SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "🗂️・jelentések", visible: ["PATROL_ACCESS", "SUPERVISOR_ACCESS", "COMMAND_ACCESS"], send: ["PATROL_ACCESS", "SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "🗣️・állományi-kommunikáció", visible: ["CADET_ACCESS"], send: ["CADET_ACCESS"] },
      { type: "text", name: "👑・vezetőségi-kommunikáció", visible: ["COMMAND_ACCESS"], send: ["COMMAND_ACCESS"] },
      { type: "voice", name: "🎙️｜állományi-briefing", visible: ["PATROL_ACCESS"], connect: ["PATROL_ACCESS"], speak: ["PATROL_ACCESS"] },
    ],
  },

  {
    category: "🎓 BCSO | AKADÉMIA ÉS KIKÉPZÉS",
    visible: ["TRAINING_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "🎓・akadémia-közlemények", visible: ["TRAINING_ACCESS"], send: ["TRAINING_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "🚓・cadet-kommunikáció", visible: ["TRAINING_ACCESS"], send: ["TRAINING_ACCESS"] },
      { type: "text", name: "👨‍🏫・fto-program", visible: ["TRAINING_ACCESS"], send: ["TRAINING_ACCESS", "SUPERVISOR_ACCESS"] },
      { type: "text", name: "📋・vizsgák-értékelések", visible: ["SUPERVISOR_ACCESS", "COMMAND_ACCESS", "TRAINING_ACCESS"], send: ["SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "voice", name: "🎧｜akadémia-1", visible: ["TRAINING_ACCESS"], connect: ["TRAINING_ACCESS"], speak: ["TRAINING_ACCESS"] },
      { type: "voice", name: "🎧｜akadémia-2", visible: ["TRAINING_ACCESS"], connect: ["TRAINING_ACCESS"], speak: ["TRAINING_ACCESS"] },
    ],
  },

  {
    category: "🛡️ BCSO | PATROL OPERATIONS",
    visible: ["PATROL_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "🚔・járőr-közlemények", visible: ["PATROL_ACCESS"], send: ["SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "📍・szolgálatba-állás", visible: ["PATROL_ACCESS"], send: ["PATROL_ACCESS"] },
      { type: "text", name: "📡・egység-kommunikáció", visible: ["PATROL_ACCESS"], send: ["PATROL_ACCESS"] },
      { type: "text", name: "🧾・járőr-jelentések", visible: ["PATROL_ACCESS"], send: ["PATROL_ACCESS"] },
      { type: "text", name: "🚨・bolo-apb", visible: ["PATROL_ACCESS", "GOV_ACCESS"], send: ["SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "voice", name: "🔊｜dispatch-main", visible: ["PATROL_ACCESS"], connect: ["PATROL_ACCESS"], speak: ["PATROL_ACCESS"] },
      { type: "voice", name: "🔊｜patrol-1", visible: ["PATROL_ACCESS"], connect: ["PATROL_ACCESS"], speak: ["PATROL_ACCESS"] },
      { type: "voice", name: "🔊｜patrol-2", visible: ["PATROL_ACCESS"], connect: ["PATROL_ACCESS"], speak: ["PATROL_ACCESS"] },
      { type: "voice", name: "🔊｜supervisor-net", visible: ["SUPERVISOR_ACCESS"], connect: ["SUPERVISOR_ACCESS"], speak: ["SUPERVISOR_ACCESS"] },
    ],
  },

  {
    category: "📁 BCSO | EGYÉB INFORMÁCIÓK",
    visible: ["CADET_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "💤・távolléti-kérelem", visible: ["PATROL_ACCESS", "SUPERVISOR_ACCESS", "COMMAND_ACCESS"], send: ["PATROL_ACCESS", "SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "🎒・felszerelés", visible: ["CADET_ACCESS"], send: ["SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "📸・bcso-képek", visible: ["CADET_ACCESS"], send: ["CADET_ACCESS"] },
      { type: "text", name: "📌・körözési-plakátok", visible: ["EVERYONE", "PATROL_ACCESS"], send: ["SUPERVISOR_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "📉・leszerelés", visible: ["PATROL_ACCESS", "COMMAND_ACCESS"], send: ["PATROL_ACCESS", "COMMAND_ACCESS"] },
    ],
  },

  {
    category: "👑 BCSO | COMMAND DIVISION",
    visible: ["COMMAND_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "👑・parancsnoki-chat", visible: ["COMMAND_ACCESS"], send: ["COMMAND_ACCESS"] },
      { type: "text", name: "📊・vezetői-jelentések", visible: ["COMMAND_ACCESS"], send: ["COMMAND_ACCESS"] },
      { type: "text", name: "🧾・vezetői-dokumentumok", visible: ["COMMAND_ACCESS"], send: ["COMMAND_ACCESS"] },
      { type: "text", name: "🤝・government-liaison", visible: ["COMMAND_ACCESS", "GOV_ACCESS"], send: ["COMMAND_ACCESS", "GOV_ACCESS"] },
      { type: "voice", name: "🎙️｜command-briefing", visible: ["COMMAND_ACCESS"], connect: ["COMMAND_ACCESS"], speak: ["COMMAND_ACCESS"] },
    ],
  },

  {
    category: "🕵️ INTERNAL AFFAIRS",
    visible: ["IA_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "⚠️・ia-bejelentések", visible: ["IA_ACCESS"], send: ["IA_ACCESS"] },
      { type: "text", name: "🕵️・ia-akták", visible: ["IA_ACCESS"], send: ["IA_ACCESS"] },
      { type: "text", name: "🔒・ia-vezetőség", visible: ["IA_ACCESS"], send: ["IA_ACCESS"] },
      { type: "voice", name: "🎙️｜ia-private", visible: ["IA_ACCESS"], connect: ["IA_ACCESS"], speak: ["IA_ACCESS"] },
    ],
  },

  {
    category: "🚓 BCSO | SWAT DIVISION",
    visible: ["SWAT_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "🚨・swat-közlemények", visible: ["SWAT_ACCESS"], send: ["SWAT_ACCESS"] },
      { type: "text", name: "🛡️・swat-kommunikáció", visible: ["SWAT_ACCESS"], send: ["SWAT_ACCESS"] },
      { type: "text", name: "🧾・swat-jelentések", visible: ["SWAT_ACCESS"], send: ["SWAT_ACCESS"] },
      { type: "text", name: "📂・swat-dokumentumok", visible: ["SWAT_ACCESS"], send: ["SWAT_ACCESS"] },
      { type: "voice", name: "🎙️｜swat-comms", visible: ["SWAT_ACCESS"], connect: ["SWAT_ACCESS"], speak: ["SWAT_ACCESS"] },
    ],
  },

  {
    category: "🔎 BCSO | CIU DIVISION",
    visible: ["CIU_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "🔎・ciu-közlemények", visible: ["CIU_ACCESS"], send: ["CIU_ACCESS"] },
      { type: "text", name: "🕵️・ciu-nyomozások", visible: ["CIU_ACCESS"], send: ["CIU_ACCESS"] },
      { type: "text", name: "📁・ciu-akták", visible: ["CIU_ACCESS"], send: ["CIU_ACCESS"] },
      { type: "text", name: "📂・ciu-dokumentumok", visible: ["CIU_ACCESS"], send: ["CIU_ACCESS"] },
      { type: "voice", name: "🎙️｜ciu-net", visible: ["CIU_ACCESS"], connect: ["CIU_ACCESS"], speak: ["CIU_ACCESS"] },
    ],
  },

  {
    category: "🐕 BCSO | K9 DIVISION",
    visible: ["K9_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "🐕・k9-közlemények", visible: ["K9_ACCESS"], send: ["K9_ACCESS"] },
      { type: "text", name: "🦴・k9-kommunikáció", visible: ["K9_ACCESS"], send: ["K9_ACCESS"] },
      { type: "text", name: "📂・k9-dokumentumok", visible: ["K9_ACCESS"], send: ["K9_ACCESS"] },
      { type: "voice", name: "🎙️｜k9-comms", visible: ["K9_ACCESS"], connect: ["K9_ACCESS"], speak: ["K9_ACCESS"] },
    ],
  },

  {
    category: "🚦 BCSO | TEU DIVISION",
    visible: ["TEU_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "🚦・teu-közlemények", visible: ["TEU_ACCESS"], send: ["TEU_ACCESS"] },
      { type: "text", name: "🏎️・teu-operációk", visible: ["TEU_ACCESS"], send: ["TEU_ACCESS"] },
      { type: "text", name: "📂・teu-dokumentumok", visible: ["TEU_ACCESS"], send: ["TEU_ACCESS"] },
      { type: "voice", name: "🎙️｜teu-net", visible: ["TEU_ACCESS"], connect: ["TEU_ACCESS"], speak: ["TEU_ACCESS"] },
    ],
  },

  {
    category: "🛩️ BCSO | AMD DIVISION",
    visible: ["AMD_ACCESS", "BOT_ACCESS"],
    channels: [
      { type: "text", name: "🛩️・amd-közlemények", visible: ["AMD_ACCESS"], send: ["AMD_ACCESS"] },
      { type: "text", name: "🚁・air-support", visible: ["AMD_ACCESS"], send: ["AMD_ACCESS"] },
      { type: "text", name: "🌊・marine-unit", visible: ["AMD_ACCESS"], send: ["AMD_ACCESS"] },
      { type: "voice", name: "🎙️｜air-net", visible: ["AMD_ACCESS"], connect: ["AMD_ACCESS"], speak: ["AMD_ACCESS"] },
      { type: "voice", name: "🎙️｜marine-net", visible: ["AMD_ACCESS"], connect: ["AMD_ACCESS"], speak: ["AMD_ACCESS"] },
    ],
  },

  {
    category: "🤖 SYSTEM | LOGS & BOTS",
    visible: ["SERVER_STAFF_ACCESS", "BOT_ACCESS", "COMMAND_ACCESS"],
    channels: [
      { type: "text", name: "🧾・bot-log", visible: ["SERVER_STAFF_ACCESS", "BOT_ACCESS", "COMMAND_ACCESS"], send: ["BOT_ACCESS", "SERVER_STAFF_ACCESS"] },
      { type: "text", name: "🛠️・staff-tools", visible: ["SERVER_STAFF_ACCESS", "COMMAND_ACCESS"], send: ["SERVER_STAFF_ACCESS", "COMMAND_ACCESS"] },
      { type: "text", name: "📊・audit-feed", visible: ["COMMAND_ACCESS", "SERVER_STAFF_ACCESS"], send: ["BOT_ACCESS"] },
      { type: "voice", name: "🎙️｜staff-support", visible: ["SERVER_STAFF_ACCESS", "COMMAND_ACCESS"], connect: ["SERVER_STAFF_ACCESS", "COMMAND_ACCESS"], speak: ["SERVER_STAFF_ACCESS", "COMMAND_ACCESS"] },
    ],
  },
];

/* =========================================================
   SEGÉDEK
========================================================= */
function unique(arr) {
  return [...new Set(arr)];
}

function getRoleByName(guild, name) {
  return guild.roles.cache.find((r) => r.name === name) || null;
}

function getCategoryByName(guild, name) {
  return guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name === name
  ) || null;
}

function getChannelByName(guild, name, parentId = null) {
  return (
    guild.channels.cache.find((c) => c.name === name && (!parentId || c.parentId === parentId)) ||
    null
  );
}

function resolveAccessRoleNames(groups) {
  const names = [];

  for (const group of groups || []) {
    if (group === "EVERYONE") continue;

    if (ACCESS[group]) {
      names.push(...ACCESS[group]);
    } else {
      names.push(group);
    }
  }

  return unique(names);
}

function makeCategoryOverwrites(guild, visibleGroups) {
  const overwrites = [];
  const everyoneId = guild.roles.everyone.id;

  if ((visibleGroups || []).includes("EVERYONE")) {
    overwrites.push({
      id: everyoneId,
      allow: [P.ViewChannel, P.ReadMessageHistory],
    });
  } else {
    overwrites.push({
      id: everyoneId,
      deny: [P.ViewChannel],
    });
  }

  const roleNames = resolveAccessRoleNames(visibleGroups);
  for (const roleName of roleNames) {
    const role = getRoleByName(guild, roleName);
    if (!role) continue;

    overwrites.push({
      id: role.id,
      allow: [P.ViewChannel, P.ReadMessageHistory],
    });
  }

  return overwrites;
}

function makeTextOverwrites(guild, channelConfig) {
  const overwrites = [];
  const everyoneId = guild.roles.everyone.id;

  if ((channelConfig.visible || []).includes("EVERYONE")) {
    overwrites.push({
      id: everyoneId,
      allow: [P.ViewChannel, P.ReadMessageHistory],
      deny: channelConfig.send?.includes("EVERYONE")
        ? []
        : [P.SendMessages, P.AddReactions, P.CreatePublicThreads, P.CreatePrivateThreads],
    });
  } else {
    overwrites.push({
      id: everyoneId,
      deny: [P.ViewChannel],
    });
  }

  const visibleRoles = resolveAccessRoleNames(channelConfig.visible || []);
  const sendRoles = resolveAccessRoleNames(channelConfig.send || []);

  for (const roleName of visibleRoles) {
    const role = getRoleByName(guild, roleName);
    if (!role) continue;

    const canSend = sendRoles.includes(roleName);

    overwrites.push({
      id: role.id,
      allow: [
        P.ViewChannel,
        P.ReadMessageHistory,
        ...(canSend
          ? [
              P.SendMessages,
              P.AddReactions,
              P.AttachFiles,
              P.EmbedLinks,
              P.UseApplicationCommands,
              P.CreatePublicThreads,
              P.CreatePrivateThreads,
            ]
          : []),
      ],
      deny: canSend
        ? []
        : [P.SendMessages, P.AddReactions, P.CreatePublicThreads, P.CreatePrivateThreads],
    });
  }

  for (const roleName of sendRoles) {
    const role = getRoleByName(guild, roleName);
    if (!role) continue;

    if (!visibleRoles.includes(roleName)) {
      overwrites.push({
        id: role.id,
        allow: [
          P.ViewChannel,
          P.ReadMessageHistory,
          P.SendMessages,
          P.AddReactions,
          P.AttachFiles,
          P.EmbedLinks,
          P.UseApplicationCommands,
          P.CreatePublicThreads,
          P.CreatePrivateThreads,
        ],
      });
    }
  }

  return overwrites;
}

function makeVoiceOverwrites(guild, channelConfig) {
  const overwrites = [];
  const everyoneId = guild.roles.everyone.id;

  if ((channelConfig.visible || []).includes("EVERYONE")) {
    const canConnectEveryone = (channelConfig.connect || []).includes("EVERYONE");
    const canSpeakEveryone = (channelConfig.speak || []).includes("EVERYONE");

    overwrites.push({
      id: everyoneId,
      allow: [
        P.ViewChannel,
        ...(canConnectEveryone ? [P.Connect] : []),
        ...(canSpeakEveryone ? [P.Speak, P.Stream, P.UseVAD] : []),
      ],
      deny: [
        ...(canConnectEveryone ? [] : [P.Connect]),
        ...(canSpeakEveryone ? [] : [P.Speak, P.Stream, P.UseVAD]),
      ],
    });
  } else {
    overwrites.push({
      id: everyoneId,
      deny: [P.ViewChannel, P.Connect, P.Speak],
    });
  }

  const visibleRoles = resolveAccessRoleNames(channelConfig.visible || []);
  const connectRoles = resolveAccessRoleNames(channelConfig.connect || []);
  const speakRoles = resolveAccessRoleNames(channelConfig.speak || []);

  for (const roleName of unique([...visibleRoles, ...connectRoles, ...speakRoles])) {
    const role = getRoleByName(guild, roleName);
    if (!role) continue;

    overwrites.push({
      id: role.id,
      allow: [
        P.ViewChannel,
        ...(connectRoles.includes(roleName) ? [P.Connect] : []),
        ...(speakRoles.includes(roleName) ? [P.Speak, P.Stream, P.UseVAD] : []),
      ],
      deny: [
        ...(connectRoles.includes(roleName) ? [] : [P.Connect]),
        ...(speakRoles.includes(roleName) ? [] : [P.Speak, P.Stream, P.UseVAD]),
      ],
    });
  }

  return overwrites;
}

async function ensureRole(guild, def) {
  let role = getRoleByName(guild, def.name);

  const payload = {
    name: def.name,
    color: def.color,
    hoist: def.hoist,
    mentionable: false,
    permissions: def.permissions || [],
    reason: "BCSO setup sync",
  };

  if (!role) {
    role = await guild.roles.create(payload);
    console.log(`+ Role létrehozva: ${def.name}`);
  } else {
    await role.edit(payload).catch(() => null);
    console.log(`= Role frissítve: ${def.name}`);
  }

  return role;
}

async function setRoleOrder(guild) {
  const created = [];
  for (const def of ROLE_DEFINITIONS) {
    const role = getRoleByName(guild, def.name);
    if (role) created.push(role);
  }

  const botHighest = guild.members.me.roles.highest.position;
  const desired = created.reverse();

  let pos = botHighest - 1;
  const positions = [];

  for (const role of desired) {
    if (pos <= 1) break;
    positions.push({ role: role.id, position: pos });
    pos--;
  }

  await guild.roles.setPositions(positions).catch((err) => {
    console.log("! Role sorrend beállítás részben sikertelen:", err.message);
  });
}

async function ensureCategory(guild, name, visibleGroups) {
  const overwrites = makeCategoryOverwrites(guild, visibleGroups);
  let category = getCategoryByName(guild, name);

  if (!category) {
    category = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: overwrites,
      reason: "BCSO setup sync",
    });
    console.log(`+ Kategória létrehozva: ${name}`);
  } else {
    await category.edit({
      permissionOverwrites: overwrites,
    }).catch(() => null);
    console.log(`= Kategória frissítve: ${name}`);
  }

  return category;
}

async function ensureTextChannel(guild, parent, cfg) {
  let channel = getChannelByName(guild, cfg.name, parent.id);
  const overwrites = makeTextOverwrites(guild, cfg);

  if (!channel) {
    channel = await guild.channels.create({
      name: cfg.name,
      type: ChannelType.GuildText,
      parent: parent.id,
      permissionOverwrites: overwrites,
      topic: `BCSO setup | ${cfg.name}`,
      reason: "BCSO setup sync",
    });
    console.log(`+ Text csatorna létrehozva: ${cfg.name}`);
  } else {
    await channel.edit({
      parent: parent.id,
      permissionOverwrites: overwrites,
      topic: `BCSO setup | ${cfg.name}`,
    }).catch(() => null);
    console.log(`= Text csatorna frissítve: ${cfg.name}`);
  }
}

async function ensureVoiceChannel(guild, parent, cfg) {
  let channel = getChannelByName(guild, cfg.name, parent.id);
  const overwrites = makeVoiceOverwrites(guild, cfg);

  if (!channel) {
    channel = await guild.channels.create({
      name: cfg.name,
      type: ChannelType.GuildVoice,
      parent: parent.id,
      permissionOverwrites: overwrites,
      bitrate: 64000,
      userLimit: 0,
      reason: "BCSO setup sync",
    });
    console.log(`+ Voice csatorna létrehozva: ${cfg.name}`);
  } else {
    await channel.edit({
      parent: parent.id,
      permissionOverwrites: overwrites,
      bitrate: 64000,
      userLimit: 0,
    }).catch(() => null);
    console.log(`= Voice csatorna frissítve: ${cfg.name}`);
  }
}

/* =========================================================
   FUTTATÁS
========================================================= */
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`Bejelentkezve: ${client.user.tag}`);

  const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
  if (!guild) {
    console.error("Nem található a szerver a megadott GUILD_ID alapján.");
    process.exit(1);
  }

  await guild.roles.fetch();
  await guild.channels.fetch();

  console.log("=== RANGOK SZINKRONIZÁLÁSA ===");
  for (const roleDef of ROLE_DEFINITIONS) {
    await ensureRole(guild, roleDef);
  }

  console.log("=== RANGSORREND BEÁLLÍTÁSA ===");
  await setRoleOrder(guild);

  console.log("=== KATEGÓRIÁK ÉS CSATORNÁK ===");
  for (const block of STRUCTURE) {
    const category = await ensureCategory(guild, block.category, block.visible);

    for (const ch of block.channels) {
      if (ch.type === "text") {
        await ensureTextChannel(guild, category, ch);
      } else if (ch.type === "voice") {
        await ensureVoiceChannel(guild, category, ch);
      }
    }
  }

  console.log("=== KÉSZ ===");
  console.log("A BCSO setup lefutott.");
  process.exit(0);
});