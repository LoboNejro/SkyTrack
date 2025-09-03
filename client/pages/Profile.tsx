import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ID } from "appwrite";
import { appwriteReady, storage } from "../lib/appwrite";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, User as UserIcon, Mail } from "lucide-react";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [photoURL, setPhotoURL] = useState<string | undefined>(user?.photoURL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID as string | undefined;

    if (appwriteReady && bucketId) {
      const created = await storage.createFile(bucketId, ID.unique(), file);
      const url = storage.getFilePreview(bucketId, created.$id).href;
      setPhotoURL(url);
      await updateProfile({ photoURL: url });
    } else {
      const url = URL.createObjectURL(file);
      setPhotoURL(url);
      await updateProfile({ photoURL: url });
    }
  };

  const handleSave = async () => {
    await updateProfile({ name });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y avatar.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5"/>Información Personal</CardTitle>
          <CardDescription>Actualiza tu nombre y foto de perfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={photoURL} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <Button variant="outline" size="sm" onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                Subir nueva foto
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" value={user.email} readOnly className="pl-10 opacity-80" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2"/>Guardar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
