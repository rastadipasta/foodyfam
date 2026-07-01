import type { AuthUser, BabyProfile, FamilyMember, FamilyPreferences } from "@/lib/types";

export type ProfileSnapshot = {
  authUser: AuthUser | null;
  familyMembers: FamilyMember[];
  babyProfiles: BabyProfile[];
  preferences: FamilyPreferences;
};

export type ProfileAdapter = {
  getProfile: () => Promise<ProfileSnapshot>;
  updateAccount: (user: Partial<AuthUser>) => Promise<AuthUser | null>;
  listFamilyMembers: () => Promise<FamilyMember[]>;
  upsertFamilyMember: (member: FamilyMember) => Promise<FamilyMember>;
  deleteFamilyMember: (id: string) => Promise<{ ok: true }>;
  listBabyProfiles: () => Promise<BabyProfile[]>;
  upsertBabyProfile: (profile: BabyProfile) => Promise<BabyProfile>;
  deleteBabyProfile: (id: string) => Promise<{ ok: true }>;
  updatePreferences: (preferences: Partial<FamilyPreferences>) => Promise<FamilyPreferences>;
};

