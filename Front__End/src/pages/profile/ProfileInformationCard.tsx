import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, Edit, Lock, Mail, Save, User, UserRound, Wallet, X, } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserData } from "@/types/userForm";
import { changeUser, getUser } from "@/api/userApi";
import { useNavigate } from "react-router";

export const ProfileInformationCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserData>(
    {
      fullName: "",
      email: "",
      role: "",
      companyName: "",
      walletAddress: "",
      imageUrl: null,
    }
  );
  const [editedData, setEditedData] = useState<UserData>(
    {
      fullName: "",
      email: "",
      role: "",
      companyName: "",
      walletAddress: "",
      imageUrl: null,
    }
  );

  const navigate = useNavigate();

  useEffect(() => {
    const bringedUser = async () => {
      try {
        const data = await getUser();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    }

    bringedUser();
  }, [])

  const hasChanges = useMemo(() => {
    return (
      editedData.fullName !== userData.fullName ||
      editedData.walletAddress !== userData.walletAddress
    );
  }, [editedData, userData]);

  const handleEdit = () => {
    setEditedData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        fullName: editedData.fullName,
        walletAddress: editedData.walletAddress,
      };

      await changeUser(payload);

      setUserData((previous) => {
        return {
          ...previous,
          fullName: payload.fullName,
          walletAddress: payload.walletAddress,
        };
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user information:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="min-h-screen w-full rounded-none border-0 bg-white shadow-none">
      {/* Header */}
      <CardHeader className="border-b border-gray-100 px-4 pb-4 pt-4">
        <CardTitle className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
          {/* Back */}
          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Retour" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </button>

          {/* Title */}
          <div className="min-w-0 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Informations personnelles
            </h2>

            <p className="mt-1 text-xs font-normal text-gray-400">
              Gérez les informations de votre profil
            </p>
          </div>

          {/* Edit / Cancel */}
          {!isEditing ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-11 w-11 justify-self-end rounded-xl bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
              aria-label="Modifier les informations"
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-11 w-11 justify-self-end rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
              aria-label="Annuler"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-8 pt-6">
        {/* Profile */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              {/* Green halo */}
              <div className="absolute -inset-1 rounded-full bg-green-100" />

              {!userData ? (
                /* Loading */
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gray-50 shadow-md">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-500" />
                </div>
              ) : userData.imageUrl ? (
                /* Avatar */
                <img
                  src={userData.imageUrl}
                  alt="Profile"
                  className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                /* Default profile icon */
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-green-50 shadow-md">
                  <UserRound className="h-14 w-14 text-green-600" strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {userData.fullName || "Utilisateur"}
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            {userData.role || "Utilisateur"}
          </p>
        </div>

        {/* Information */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <Label
              htmlFor="fullName"
              className="text-xs font-medium text-gray-500"
            >
              Nom complet
            </Label>

            {isEditing ? (
              <Input
                id="fullName"
                type="text"
                value={editedData.fullName}
                onChange={(e) =>
                  setEditedData((previous) => ({
                    ...previous,
                    fullName: e.target.value,
                  }))
                }
                className="mt-2 h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm focus-visible:border-green-500 focus-visible:ring-green-500"
                placeholder="Votre nom complet"
              />
            ) : (
              <div className="mt-2 flex min-h-12 items-center gap-3 rounded-xl bg-gray-50 px-4">
                <User className="h-5 w-5 shrink-0 text-gray-400" />

                <span className="truncate text-sm font-medium text-gray-800">
                  {userData.fullName || "Non renseigné"}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-xs font-medium text-gray-500"
            >
              Email
            </Label>

            <div
              id="email"
              className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-gray-50 px-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-gray-400" />

                <span className="truncate text-sm font-medium text-gray-800">
                  {userData.email || "Non renseigné"}
                </span>
              </div>

              <Lock className="ml-3 h-4 w-4 shrink-0 text-gray-300" />
            </div>
          </div>

          {/* Role */}
          <div>
            <Label
              htmlFor="role"
              className="text-xs font-medium text-gray-500"
            >
              Rôle
            </Label>

            <div
              id="role"
              className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-gray-50 px-4"
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 shrink-0 text-gray-400" />

                <span className="text-sm font-medium text-gray-800">
                  {userData.role || "Non renseigné"}
                </span>
              </div>

              <Lock className="h-4 w-4 shrink-0 text-gray-300" />
            </div>
          </div>

          {/* Company */}
          <div>
            <Label
              htmlFor="companyName"
              className="text-xs font-medium text-gray-500"
            >
              Entreprise
            </Label>

            <div
              id="companyName"
              className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-gray-50 px-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Building2 className="h-5 w-5 shrink-0 text-gray-400" />

                <span className="truncate text-sm font-medium text-gray-800">
                  {userData.companyName || "Non renseigné"}
                </span>
              </div>

              <Lock className="ml-3 h-4 w-4 shrink-0 text-gray-300" />
            </div>
          </div>

          {/* Wallet */}
          <div>
            <Label
              htmlFor="walletAddress"
              className="text-xs font-medium text-gray-500"
            >
              Adresse du wallet
            </Label>

            {isEditing ? (
              <Input
                id="walletAddress"
                type="text"
                value={editedData.walletAddress}
                onChange={(e) =>
                  setEditedData((previous) => ({
                    ...previous,
                    walletAddress: e.target.value,
                  }))
                }
                className="mt-2 h-12 rounded-xl border-gray-200 bg-gray-50 px-4 font-mono text-xs focus-visible:border-green-500 focus-visible:ring-green-500"
                placeholder="Adresse de votre wallet"
              />
            ) : (
              <div className="mt-2 flex min-h-12 items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                <span className="break-all font-mono text-xs font-medium leading-relaxed text-gray-800">
                  {userData.walletAddress || "Non renseignée"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="mt-8 flex flex-col gap-3">
            <Button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="h-12 w-full rounded-xl bg-green-600 text-white shadow-sm hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-12 w-full rounded-xl border-gray-200 text-gray-600"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        )}

        {/* Read-only explanation */}
        {!isEditing && (
          <div className="mt-8 rounded-xl bg-green-50 px-4 py-3">
            <p className="text-center text-[11px] leading-relaxed text-green-700">
              L'adresse email, le rôle et l'entreprise sont gérés par votre
              compte et ne peuvent pas être modifiés ici.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
};