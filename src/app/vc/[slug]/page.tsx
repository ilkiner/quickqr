import { createClient } from "src/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type LinkItem = { platform: string; url: string };

const platformConfig: Record<string, { label: string; icon: string; color: string }> = {
  instagram: { label: "Instagram", icon: "ri-instagram-line", color: "bg-pink-500" },
  linkedin: { label: "LinkedIn", icon: "ri-linkedin-box-fill", color: "bg-blue-600" },
  twitter: { label: "Twitter / X", icon: "ri-twitter-x-line", color: "bg-gray-900" },
  youtube: { label: "YouTube", icon: "ri-youtube-line", color: "bg-red-600" },
  tiktok: { label: "TikTok", icon: "ri-tiktok-line", color: "bg-black" },
  github: { label: "GitHub", icon: "ri-github-line", color: "bg-gray-800" },
  facebook: { label: "Facebook", icon: "ri-facebook-circle-line", color: "bg-blue-700" },
  website: { label: "Website", icon: "ri-global-line", color: "bg-gray-600" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("vcard_profiles")
    .select("full_name, title")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return { title: "Profile Not Found" };
  return {
    title: `${data.full_name ?? slug} — Digital Business Card`,
    description: data.title ?? "Digital business card powered by QuickQR",
  };
}

export default async function VCardPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("vcard_profiles")
    .select("slug, full_name, title, bio, email, phone, website, avatar_url, links")
    .eq("slug", slug)
    .maybeSingle();

  if (!profile) notFound();

  const links: LinkItem[] = Array.isArray(profile.links) ? profile.links : [];
  const avatarLetter = ((profile.full_name as string | null) ?? slug)
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Green header strip */}
        <div className="h-24 bg-gradient-to-r from-green-700 to-green-500" />

        <div className="flex flex-col items-center -mt-12 pb-8 px-6">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url as string}
              alt={(profile.full_name as string | null) ?? slug}
              className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-gray-900 bg-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {avatarLetter}
            </div>
          )}

          {/* Name & title */}
          <h1 className="mt-4 text-2xl font-bold text-white text-center">
            {(profile.full_name as string | null) ?? slug}
          </h1>
          {profile.title && (
            <p className="text-green-400 text-sm font-medium mt-1 text-center">
              {profile.title as string}
            </p>
          )}
          {profile.bio && (
            <p className="text-gray-400 text-sm mt-3 text-center leading-relaxed">
              {profile.bio as string}
            </p>
          )}

          {/* Contact rows */}
          {(profile.phone || profile.email || profile.website) && (
            <div className="mt-5 w-full space-y-2">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white text-sm px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition"
                >
                  <i className="ri-phone-line text-green-400 text-base flex-shrink-0" />
                  {profile.phone as string}
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white text-sm px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition"
                >
                  <i className="ri-mail-line text-green-400 text-base flex-shrink-0" />
                  {profile.email as string}
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white text-sm px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition"
                >
                  <i className="ri-global-line text-green-400 text-base flex-shrink-0" />
                  {(profile.website as string).replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          )}

          {/* Social links */}
          {links.length > 0 && (
            <div className="mt-4 w-full space-y-2">
              {links
                .filter((l) => l.url?.trim())
                .map((link, idx) => {
                  const cfg = platformConfig[link.platform] ?? {
                    label: link.platform,
                    icon: "ri-link",
                    color: "bg-gray-600",
                  };
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white text-sm px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition"
                    >
                      <span
                        className={`w-7 h-7 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <i className={`${cfg.icon} text-white text-sm`} />
                      </span>
                      <span className="font-medium">{cfg.label}</span>
                      <i className="ri-arrow-right-up-line ml-auto text-gray-500 text-xs" />
                    </a>
                  );
                })}
            </div>
          )}

          {/* Save to Contacts */}
          <a
            href={`/api/vcard/${slug}`}
            download
            className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
          >
            <i className="ri-contact-book-2-line text-lg" />
            Save to Contacts
          </a>
        </div>
      </div>

      <p className="mt-6 text-gray-600 text-xs">
        Powered by{" "}
        <a href="/" className="text-green-500 hover:text-green-400 transition">
          QuickQR
        </a>
      </p>
    </div>
  );
}
