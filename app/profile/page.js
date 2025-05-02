"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/app/lib/axios"
import { toast, Toaster } from "react-hot-toast"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Textarea } from "@/app/components/ui/textarea"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    bio: "",
  })
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" && localStorage.getItem("accessToken")
    if (!token) return

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile/")
        setProfile(res.data)
        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          position: res.data.position || "",
          bio: res.data.bio || "",
        })
      } catch (err) {
        console.error("Error fetching profile:", err)
        toast.error("Failed to fetch profile")
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put("/auth/profile/update/", formData)
      setProfile(res.data)
      setEditing(false)
      toast.success("Profile updated successfully!")
    } catch (err) {
      console.error("Error updating profile:", err)
      toast.error("Failed to update profile")
    }
  }

  const initials = (profile?.last_name?.[0] || "") + (profile?.first_name?.[0] || "")

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <Toaster />

      <Card className="shadow rounded-2xl">
        <CardContent className="p-6">
          {!profile ? (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                    {initials.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                {profile.role === "instructor" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Position</label>
                      <Input
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Bio</label>
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </>
                )}

                {editing ? (
                  <div className="flex gap-3 mt-4">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          first_name: profile.first_name,
                          last_name: profile.last_name,
                          email: profile.email,
                          position: profile.position || "",
                          bio: profile.bio || "",
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setEditing(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
