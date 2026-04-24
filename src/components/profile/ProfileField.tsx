// "use client";
//
// import React from "react";
// import { User } from "@/types";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ProfileField } from "./ProfileField";
// import { apiPost, createBrowserApiClient } from "@/lib/api.helper";
// import { useAuth } from "@/context/AuthContext";
//
// interface ProfileInfoProps {
//     user: User;
// }
//
// export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
//     const { refreshUser } = useAuth();
//     const client = createBrowserApiClient();
//
//     const updateField = async (field: string, value: string) => {
//         await apiPost(client, "/profile/update", { [field]: value });
//         await refreshUser();
//     };
//
//     return (
//         <div className="flex flex-col items-center w-full gap-4">
//             <Avatar className="w-24 h-24 mb-2">
//                 {user.avatar ? <AvatarImage src={user.avatar} /> : <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>}
//             </Avatar>
//
//             <div className="w-full space-y-2">
//                 <ProfileField label="First Name" value={user.firstName} onSave={v => updateField("first_name", v)} />
//                 <ProfileField label="Last Name" value={user.lastName} onSave={v => updateField("last_name", v)} />
//                 <ProfileField label="Full Name" value={`${user.firstName} ${user.lastName}`} readOnly />
//                 <ProfileField label="Email" value={user.email} readOnly />
//                 <ProfileField label="Phone" value={user.phone} onSave={v => updateField("phone", v)} />
//                 <ProfileField label="Role" value={user.role} readOnly />
//                 <ProfileField label="Verified" value={user.is_verified ? "✅ Verified" : "❌ Not Verified"} readOnly />
//             </div>
//         </div>
//     );
// };