import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SPECIAL_USERS = {
  tester: ["kittenbadgetest", "codeb1tz"],
  developer: ["kittenbadgetest", "codeb1tz"],
  owner: ["codeb1tz"],
};

export function useBadges(username: string | undefined, profileId: string | undefined) {
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId || !username) {
      setLoading(false);
      return;
    }

    fetchBadges();
  }, [profileId, username]);

  const fetchBadges = async () => {
    if (!profileId || !username) return;

    try {
      // Fetch earned badges from database
      const { data: earnedBadges } = await supabase
        .from("profile_badges")
        .select("badge_type")
        .eq("profile_id", profileId);

      const badgeTypes = (earnedBadges || []).map((b) => b.badge_type);

      // Add special badges for specific users
      if (SPECIAL_USERS.tester.includes(username.toLowerCase())) {
  if (!badgeTypes.includes("tester")) {
    badgeTypes.push("tester");
  }
}

      if (SPECIAL_USERS.developer.includes(username.toLowerCase())) {
        if (!badgeTypes.includes("developer")) {
          badgeTypes.push("developer");
        }
      }
      if (SPECIAL_USERS.owner.includes(username.toLowerCase())) {
        if (!badgeTypes.includes("owner")) {
          badgeTypes.push("owner");
        }
      }

      setBadges(badgeTypes);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  return { badges, loading, refetch: fetchBadges };
}

export async function checkAndAwardBadges(profileId: string, username: string) {
  const badgesToAward: string[] = [];

  try {
    // Check for "signed_up" badge - everyone who has a profile gets this
    badgesToAward.push("signed_up");

    // Check for "customized_profile" badge - has at least one element
    const { data: elements } = await supabase
      .from("profile_elements")
      .select("id")
      .eq("profile_id", profileId)
      .limit(1);

    if (elements && elements.length > 0) {
      badgesToAward.push("customized_profile");
    }

    // Check for "got_like" and "famous" badges
    const { data: likes } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profileId);

    const likeCount = likes?.length || 0;
    if (likeCount >= 1) {
      badgesToAward.push("got_like");
    }
    if (likeCount >= 10) {
      badgesToAward.push("famous");
    }

    // Get existing badges
    const { data: existingBadges } = await supabase
      .from("profile_badges")
      .select("badge_type")
      .eq("profile_id", profileId);

    const existingTypes = (existingBadges || []).map((b) => b.badge_type);

    // Insert new badges (ignore duplicates via unique constraint)
    const newBadges = badgesToAward.filter((b) => !existingTypes.includes(b));

    if (newBadges.length > 0) {
      await supabase.from("profile_badges").insert(
        newBadges.map((badge_type) => ({
          profile_id: profileId,
          badge_type,
        }))
      );
    }

    return [...existingTypes, ...newBadges];
  } catch (error) {
    console.error("Error awarding badges:", error);
    return [];
  }
}
