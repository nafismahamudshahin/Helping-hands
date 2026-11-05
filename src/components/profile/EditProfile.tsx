"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { heading, input, label, muted, outlineBtn, primaryBtn } from "@/lib/ui"
import { ProfileFormValues, ProfileUser } from "@/types"


type Props = {
    user: ProfileUser
    saving?: boolean
    onCancel: () => void
    onSubmit: (values: ProfileFormValues) => void | Promise<void>
}

export function EditProfileForm({ user, saving, onCancel, onSubmit }: Props) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const f = new FormData(e.currentTarget)
                onSubmit({
                    name: String(f.get("name")).trim(),
                    username: String(f.get("username")).trim(),
                    avatarUrl: String(f.get("avatarUrl")).trim(),
                })
            }}
            className="mt-6 border-t border-[#c5dfd0] pt-6 dark:border-[#365b4a]"
        >
            <h2 className={cn(heading, "text-lg")}>Edit Profile</h2>
            <p className={cn("mb-5 mt-1 text-[13px]", muted)}>Change your photo using an image URL and update your personal details.</p>

            <div className="grid gap-6 md:grid-cols-[160px_1fr]">
                {/* Current profile photo */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative size-32 overflow-hidden rounded-full border-2 border-[#8fbea3] bg-[#f4fbf6] dark:border-[#365b4a] dark:bg-[#081b16]">
                        {user.avatarUrl ? (
                            <Image src={user.avatarUrl} alt={`${user.name}'s current profile photo`} fill sizes="128px" unoptimized className="object-cover" />
                        ) : (
                            <span className="grid size-full place-items-center text-4xl font-bold text-[#075b3c] dark:text-[#a8e4bd]">{user.name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <p className={cn("text-center text-[11px]", muted)}>Current photo</p>
                </div>

                {/* Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className={label}>Full Name</label>
                        <input name="name" required defaultValue={user.name} className={input} placeholder="Your name" />
                    </div>
                    <div>
                        <label className={label}>Username</label>
                        <input name="username" required defaultValue={user.username} className={input} placeholder="username" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={label} htmlFor="avatarUrl">Profile photo URL</label>
                        <input id="avatarUrl" name="avatarUrl" type="url" defaultValue={user.avatarUrl ?? ""} className={input} placeholder="https://example.com/photo.jpg" />
                        <p className={cn("mt-1 text-xs", muted)}>Use a publicly accessible image URL. Leave blank to remove your photo.</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={onCancel} className={outlineBtn}>
                    Cancel
                </Button>
                <Button type="submit" disabled={saving} className={primaryBtn}>
                    {saving ? "Saving…" : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}
