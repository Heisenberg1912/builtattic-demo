
import { fallbackAssociates } from "./marketplace.js";

const associateEnhancements = {
  "assoc-rahul-iyer": {
    "serviceBadges": [
      "Background verified",
      "BIM 360 certified",
      "30-day rework"
    ],
    "booking": {
      "leadTimeHours": 24,
      "rescheduleWindowHours": 6,
      "cancelWindowHours": 12,
      "bufferMinutes": 15,
      "timezones": [
        "Asia/Kolkata",
        "Asia/Dubai"
      ],
      "slots": [
        {
          "date": "2025-03-18",
          "start": "09:00",
          "end": "10:30",
          "type": "virtual"
        },
        {
          "date": "2025-03-18",
          "start": "15:00",
          "end": "17:00",
          "type": "on-site"
        },
        {
          "date": "2025-03-19",
          "start": "11:00",
          "end": "13:00",
          "type": "virtual"
        }
      ],
      "etaStages": [
        {
          "stage": "assigned",
          "label": "Pro assigned"
        },
        {
          "stage": "en_route",
          "label": "En route"
        },
        {
          "stage": "started",
          "label": "Session started"
        },
        {
          "stage": "completed",
          "label": "Completed"
        }
      ],
      "otpRequired": true,
      "communications": {
        "chat": true,
        "voice": true,
        "video": true
      }
    },
    "warranty": {
      "durationDays": 30,
      "coverage": "One follow-up coordination sprint",
      "contact": "success@builtattic.com"
    },
    "addons": [
      {
        "id": "addon-extra-hours",
        "name": "Additional 2 hours",
        "price": 90,
        "currency": "INR"
      },
      {
        "id": "addon-night",
        "name": "Night shift coverage",
        "price": 140,
        "currency": "INR"
      }
    ],
    "prepChecklist": [
      "Upload latest federated model",
      "Provide clash matrix if available",
      "Invite to coordination Teams channel"
    ]
  },
  "assoc-laia-fernandez": {
    "serviceBadges": [
      "Grasshopper specialist",
      "AR asset ready",
      "30-day support"
    ],
    "booking": {
      "leadTimeHours": 48,
      "rescheduleWindowHours": 12,
      "cancelWindowHours": 24,
      "bufferMinutes": 20,
      "timezones": [
        "Europe/Madrid",
        "UTC"
      ],
      "slots": [
        {
          "date": "2025-03-19",
          "start": "10:00",
          "end": "13:00",
          "type": "virtual"
        },
        {
          "date": "2025-03-20",
          "start": "16:00",
          "end": "18:00",
          "type": "virtual"
        },
        {
          "date": "2025-03-21",
          "start": "11:00",
          "end": "14:00",
          "type": "virtual"
        }
      ],
      "etaStages": [
        {
          "stage": "assigned",
          "label": "Designer assigned"
        },
        {
          "stage": "in_discovery",
          "label": "Discovery workshop"
        },
        {
          "stage": "asset_build",
          "label": "Asset build"
        },
        {
          "stage": "handoff",
          "label": "Handoff"
        }
      ],
      "otpRequired": false,
      "communications": {
        "chat": true,
        "voice": true,
        "video": true
      }
    },
    "warranty": {
      "durationDays": 30,
      "coverage": "Design iteration support",
      "contact": "studio@builtattic.com"
    },
    "addons": [
      {
        "id": "addon-vr",
        "name": "VR walkthrough",
        "price": 320,
        "currency": "INR"
      },
      {
        "id": "addon-branding",
        "name": "Brand guidelines sync",
        "price": 180,
        "currency": "INR"
      }
    ],
    "prepChecklist": [
      "Share Rhino base file or DWG",
      "Upload mood board references",
      "Confirm render engine preference"
    ]
  },
  "assoc-lin-zhang": {
    "serviceBadges": [
      "LEED AP",
      "IES VE certified",
      "30-day rework"
    ],
    "booking": {
      "leadTimeHours": 36,
      "rescheduleWindowHours": 12,
      "cancelWindowHours": 18,
      "bufferMinutes": 30,
      "timezones": [
        "Asia/Singapore",
        "Australia/Perth"
      ],
      "slots": [
        {
          "date": "2025-03-18",
          "start": "14:00",
          "end": "16:00",
          "type": "virtual"
        },
        {
          "date": "2025-03-19",
          "start": "09:00",
          "end": "11:00",
          "type": "virtual"
        },
        {
          "date": "2025-03-20",
          "start": "15:00",
          "end": "17:30",
          "type": "virtual"
        }
      ],
      "etaStages": [
        {
          "stage": "assigned",
          "label": "Analyst assigned"
        },
        {
          "stage": "preprocessing",
          "label": "Model preprocessing"
        },
        {
          "stage": "simulation",
          "label": "Simulation running"
        },
        {
          "stage": "report",
          "label": "Report ready"
        }
      ],
      "otpRequired": false,
      "communications": {
        "chat": true,
        "voice": true,
        "video": true
      }
    },
    "warranty": {
      "durationDays": 30,
      "coverage": "Follow-up simulation recalibration",
      "contact": "energy@builtattic.com"
    },
    "addons": [
      {
        "id": "addon-on-site",
        "name": "On-site audit",
        "price": 680,
        "currency": "SGD"
      },
      {
        "id": "addon-report",
        "name": "Regulatory submission pack",
        "price": 420,
        "currency": "SGD"
      }
    ],
    "prepChecklist": [
      "Upload BIM model or gbXML",
      "List envelope specifications",
      "Provide climate file"
    ]
  }
};

export const associateCatalog = fallbackAssociates.map((associate) => {
  const extras = associateEnhancements[associate._id] || {};
  return {
    ...associate,
    serviceBadges: extras.serviceBadges || [],
    booking: extras.booking || null,
    warranty: extras.warranty || null,
    addons: extras.addons || [],
    prepChecklist: extras.prepChecklist || [],
  };
});

export const associateById = (id) => {
  return associateCatalog.find((associate) => associate._id === id) || null;
};
