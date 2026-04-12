"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { createClient } from "src/lib/supabase/client";

type LinkItem = { platform: string; url: string };

type VCardProfile = {
  slug: string;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  avatar_url: string;
  links: LinkItem[];
};

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "github", label: "GitHub" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
];

const empty: VCardProfile = {
  slug: "",
  full_name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  website: "",
  avatar_url: "",
  links: [],
};

export default function DashboardVCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<"free" | "pro" | "business" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<VCardProfile>(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [slugError, setSlugError] = useState("");

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? "";

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/");
      return;
    }

    const [{ data: profileData }, { data: vcardData }] = await Promise.all([
      supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
      supabase.from("vcard_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    const userPlan = (profileData?.plan as "free" | "pro" | "business" | null) ?? "free";
    setPlan(userPlan);
    setUserId(user.id);

    if (userPlan !== "free" && vcardData) {
      setProfile({
        slug: vcardData.slug ?? "",
        full_name: vcardData.full_name ?? "",
        title: vcardData.title ?? "",
        bio: vcardData.bio ?? "",
        email: vcardData.email ?? "",
        phone: vcardData.phone ?? "",
        website: vcardData.website ?? "",
        avatar_url: vcardData.avatar_url ?? "",
        links: Array.isArray(vcardData.links) ? (vcardData.links as LinkItem[]) : [],
      });
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const setField = (key: keyof Omit<VCardProfile, "links">, value: string) => {
    if (key === "slug") {
      const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      setProfile((p) => ({ ...p, slug: clean }));
      setSlugError("");
      return;
    }
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const addLink = () => {
    setProfile((p) => ({
      ...p,
      links: [...p.links, { platform: "instagram", url: "" }],
    }));
  };

  const updateLink = (idx: number, key: "platform" | "url", value: string) => {
    setProfile((p) => {
      const links = [...p.links];
      links[idx] = { ...links[idx], [key]: value };
      return { ...p, links };
    });
  };

  const removeLink = (idx: number) => {
    setProfile((p) => ({ ...p, links: p.links.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!profile.slug.trim()) {
      setSlugError("Slug is required");
      return;
    }
    if (!userId) return;
    setSaving(true);

    const supabase = createClient();
    const payload = {
      user_id: userId,
      slug: profile.slug.trim(),
      full_name: profile.full_name || null,
      title: profile.title || null,
      bio: profile.bio || null,
      email: profile.email || null,
      phone: profile.phone || null,
      website: profile.website || null,
      avatar_url: profile.avatar_url || null,
      links: profile.links.filter((l) => l.url.trim()),
    };

    const { error: upsertError } = await supabase
      .from("vcard_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (upsertError) {
      if (
        upsertError.message.includes("unique") ||
        upsertError.message.includes("slug")
      ) {
        setSlugError("This slug is already taken. Try another.");
      } else {
        setError(upsertError.message);
      }
    } else {
      setSuccess("Profile saved!");
    }
    setSaving(false);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none";

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  if (plan === "free") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
          <div className="max-w-lg mx-auto text-center space-y-6 py-20">
            <div className="text-5xl">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900">Pro Feature</h1>
            <p className="text-gray-600">
              Advanced vCard profiles are available on Pro and Business plans.
            </p>
            <Link
              href="/pricing"
              className="inline-flex bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">vCard Profile</h1>
              <p className="text-sm text-gray-500 mt-1">
                Your digital business card, shareable via QR code
              </p>
            </div>
            {profile.slug && (
              <Link
                href={`/vc/${profile.slug}`}
                target="_blank"
                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1.5 font-medium"
              >
                <i className="ri-eye-line" />
                Preview
              </Link>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              {success}
            </p>
          )}

          {/* Slug */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Profile URL</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                <span className="bg-gray-50 px-3 py-2 text-sm text-gray-500 border-r border-gray-300 whitespace-nowrap select-none">
                  {baseUrl}/vc/
                </span>
                <input
                  type="text"
                  value={profile.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="yourname"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
              </div>
              {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Lowercase letters, numbers, and hyphens only
              </p>
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Personal Info</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setField("full_name", e.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title / Position
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Software Engineer"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setField("bio", e.target.value)}
                placeholder="A short bio about yourself..."
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <input
                type="url"
                value={profile.avatar_url}
                onChange={(e) => setField("avatar_url", e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className={inputClass}
              />
            </div>
          </div>

          {/* Contact details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Contact Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+1 555 000 0000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setField("website", e.target.value)}
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* Social links */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Social Links</h2>
              <button
                type="button"
                onClick={addLink}
                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
              >
                <i className="ri-add-line" />
                Add Link
              </button>
            </div>
            {profile.links.length === 0 && (
              <p className="text-sm text-gray-400">
                No links yet — click &quot;Add Link&quot; to add social profiles.
              </p>
            )}
            {profile.links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={link.platform}
                  onChange={(e) => updateLink(idx, "platform", e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(idx, "url", e.target.value)}
                  placeholder="https://..."
                  className={inputClass + " flex-1"}
                />
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="text-red-400 hover:text-red-600 p-1.5 flex-shrink-0"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {profile.slug && (
              <Link
                href={`/generate?type=url&data=${encodeURIComponent(`${baseUrl}/vc/${profile.slug}`)}`}
                className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition text-center flex items-center justify-center gap-1.5"
              >
                <i className="ri-qr-code-line" />
                Generate QR Code
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
