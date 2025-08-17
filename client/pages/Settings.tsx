import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  User, Mail, Briefcase, ArrowLeft, Palette, Monitor, 
  Sun, Moon, Smartphone, Save, Eye, RefreshCw
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const themeColors = [
  { name: 'Azul', value: 'blue', color: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Slate', value: 'slate', color: '#64748b', class: 'bg-slate-500' },
  { name: 'Gris', value: 'gray', color: '#6b7280', class: 'bg-gray-500' },
  { name: 'Zinc', value: 'zinc', color: '#71717a', class: 'bg-zinc-500' },
  { name: 'Neutral', value: 'neutral', color: '#737373', class: 'bg-neutral-500' },
  { name: 'Stone', value: 'stone', color: '#78716c', class: 'bg-stone-500' },
  { name: 'Rojo', value: 'red', color: '#ef4444', class: 'bg-red-500' },
  { name: 'Orange', value: 'orange', color: '#f97316', class: 'bg-orange-500' },
  { name: 'Amber', value: 'amber', color: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Amarillo', value: 'yellow', color: '#eab308', class: 'bg-yellow-500' },
  { name: 'Lima', value: 'lime', color: '#84cc16', class: 'bg-lime-500' },
  { name: 'Verde', value: 'green', color: '#22c55e', class: 'bg-green-500' },
  { name: 'Emerald', value: 'emerald', color: '#10b981', class: 'bg-emerald-500' },
  { name: 'Teal', value: 'teal', color: '#14b8a6', class: 'bg-teal-500' },
  { name: 'Cyan', value: 'cyan', color: '#06b6d4', class: 'bg-cyan-500' },
  { name: 'Sky', value: 'sky', color: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Índigo', value: 'indigo', color: '#6366f1', class: 'bg-indigo-500' },
  { name: 'Violeta', value: 'violet', color: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Púrpura', value: 'purple', color: '#a855f7', class: 'bg-purple-500' },
  { name: 'Fucsia', value: 'fuchsia', color: '#d946ef', class: 'bg-fuchsia-500' },
  { name: 'Rosa', value: 'pink', color: '#ec4899', class: 'bg-pink-500' },
  { name: 'Rose', value: 'rose', color: '#f43f5e', class: 'bg-rose-500' }
];

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student'
  });
  const [selectedThemeColor, setSelectedThemeColor] = useState('blue');
  const [previewMode, setPreviewMode] = useState(false);

  if (!user) {
    return null;
  }

  const handleSaveProfile = () => {
    // Here you would update the user profile
    // For now, we'll just show a toast
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  const handleSaveTheme = () => {
    // Here you would apply the theme color
    // For now, we'll just show a toast
    toast({
      title: "Tema actualizado",
      description: `Color ${themeColors.find(c => c.value === selectedThemeColor)?.name} aplicado.`,
    });
  };

  const handlePreviewColor = (colorValue: string) => {
    if (previewMode) {
      setSelectedThemeColor(colorValue);
      // Here you could temporarily apply the color to see preview
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Button>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">
          Personaliza tu perfil y la apariencia de la aplicación.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Perfil
              </CardTitle>
              <CardDescription>
                Actualiza tu información personal y datos de la cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Foto de Perfil</h3>
                  <p className="text-sm text-muted-foreground">
                    Actualiza tu foto de perfil desde tu cuenta de Google o sube una nueva imagen.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar Foto
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as any })}>
                      <SelectTrigger className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Estudiante</SelectItem>
                        <SelectItem value="teacher">Profesor</SelectItem>
                        <SelectItem value="tutor">Tutor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Estado de la Cuenta</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">
                      Activa
                    </Badge>
                    <Badge variant="outline">
                      Verificada
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setFormData({
                  name: user.name,
                  email: user.email,
                  role: user.role
                })}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalización de Tema
              </CardTitle>
              <CardDescription>
                Elige el color principal de la aplicación que mejor se adapte a tu estilo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode (Future Enhancement) */}
              <div className="space-y-3">
                <Label>Modo de Tema</Label>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Sistema
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Color del Tema</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {previewMode ? 'Desactivar' : 'Activar'} Vista Previa
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setSelectedThemeColor(color.value);
                        if (previewMode) {
                          handlePreviewColor(color.value);
                        }
                      }}
                      className={`
                        group relative h-10 w-10 rounded-lg transition-all hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                        ${color.class}
                        ${selectedThemeColor === color.value ? 'ring-2 ring-foreground ring-offset-2 scale-110' : ''}
                      `}
                      title={color.name}
                    >
                      {selectedThemeColor === color.value && (
                        <div className="absolute inset-0 rounded-lg bg-white/20 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-white" />
                        </div>
                      )}
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  Color seleccionado: <strong>{themeColors.find(c => c.value === selectedThemeColor)?.name}</strong>
                  {previewMode && (
                    <span className="ml-2 text-primary">• Vista previa activada</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveTheme}>
                  <Palette className="h-4 w-4 mr-2" />
                  Aplicar Tema
                </Button>
                <Button variant="outline" onClick={() => setSelectedThemeColor('blue')}>
                  Restaurar por Defecto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Resumen de la Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium truncate ml-2">{formData.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rol:</span>
                  <Badge variant="secondary" className="text-xs">
                    {formData.role === 'student' ? 'Estudiante' : formData.role === 'teacher' ? 'Profesor' : 'Tutor'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tema:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: themeColors.find(c => c.value === selectedThemeColor)?.color }}
                    />
                    <span className="font-medium text-xs">
                      {themeColors.find(c => c.value === selectedThemeColor)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar Datos
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Save className="h-4 w-4 mr-2" />
                Exportar Configuración
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Ver Perfil Público
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
