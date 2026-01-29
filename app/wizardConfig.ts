import type {
  FeatureKey,
  FormData,
  IntegrationId,
  SecurityLevel,
  TeamSize,
  WorkspaceType
} from "./wizardTypes";

export const steps = [
  "Workspace Basics",
  "Team Configuration",
  "Features & Integrations",
  "Security Settings",
  "Review & Create"
] as const;

export const workspaceTypes: Array<{ value: WorkspaceType; label: string }> = [
  { value: "development", label: "Development Project" },
  { value: "design", label: "Design Team" },
  { value: "marketing", label: "Marketing Campaign" },
  { value: "support", label: "Customer Support" },
  { value: "research", label: "Research & Analysis" }
];

export const teamSizes: Array<{ value: TeamSize; label: string; description: string }> = [
  {
    value: "small",
    label: "1-10 people",
    description: "Perfect for startups and small teams"
  },
  {
    value: "medium",
    label: "11-50 people",
    description: "Ideal for growing departments"
  },
  {
    value: "large",
    label: "51-200 people",
    description: "For larger organizations"
  },
  {
    value: "enterprise",
    label: "200+ people",
    description: "Enterprise-grade setup"
  }
];

export const availableIntegrations: Array<{
  id: IntegrationId;
  name: string;
  icon: string;
}> = [
  { id: "github", name: "GitHub", icon: "🔗" },
  { id: "slack", name: "Slack", icon: "💬" },
  { id: "jira", name: "Jira", icon: "📋" },
  { id: "figma", name: "Figma", icon: "🎨" },
  { id: "notion", name: "Notion", icon: "📝" },
  { id: "zoom", name: "Zoom", icon: "🎥" }
];

export const securityLevels: Array<{ value: SecurityLevel; label: string; description: string }> =
  [
    {
      value: "basic",
      label: "Basic",
      description: "Standard security for internal projects"
    },
    {
      value: "standard",
      label: "Standard",
      description: "Enhanced security with 2FA (Recommended)"
    },
    {
      value: "strict",
      label: "Strict",
      description: "Highest security for sensitive data"
    }
  ];

export const featureDescriptions: Record<FeatureKey, string> = {
  versionControl: "Track changes and collaborate on code",
  ciCd: "Automated testing and deployment pipelines",
  monitoring: "Real-time performance and error monitoring",
  collaboration: "Team chat, file sharing, and task management"
};

export const stepIcons = [
  "business",
  "group",
  "settings",
  "security",
  "check"
] as const;

export const initialFormData: FormData = {
  workspaceName: "",
  description: "",
  workspaceType: "development",
  teamSize: "small",
  features: {
    versionControl: true,
    ciCd: false,
    monitoring: false,
    collaboration: true
  },
  securityLevel: "standard",
  adminEmail: "",
  integrations: [],
  avatar: null,
  avatarPreview: ""
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
