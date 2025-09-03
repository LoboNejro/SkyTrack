import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft, Palette, Monitor,
  Sun, Moon, Smartphone, Eye, RefreshCw, Save, User
} from 'lucide-react';
import { Switch } from '../components/ui/switch';
import LanguageSelect from '../components/LanguageSelect';
import { toast } from '../hooks/use-toast';

const themeColors = [
  { name: 'Azul', value: 'blue', color: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Rojo', value: 'red', color: '#ef4444', class: 'bg-red-500' },
  { name: 'Verde', value: 'green', color: '#22c55e', class: 'bg-green-500' },
  { name: 'Púrpura', value: 'purple', color: '#a855f7', class: 'bg-purple-500' },
  { name: 'Naranja', value: 'orange', color: '#f97316', class: 'bg-orange-500' },
  { name: 'Rosa', value: 'pink', color: '#ec4899', class: 'bg-pink-500' },
  { name: 'Esmeralda', value: 'emerald', color: '#10b981', class: 'bg-emerald-500' },
  { name: 'Índigo', value: 'indigo', color: '#6366f1', class: 'bg-indigo-500' }
];

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, actualTheme, themeColor, setThemeColor } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student'
  });
  const [previewMode, setPreviewMode] = useState(false);

  if (!user) {
    return null;
  }


  const handleSaveTheme = () => {
    toast({
      title: "Tema actualizado",
      description: `Color ${themeColors.find(c => c.value === themeColor)?.name} aplicado exitosamente.`,
    });
  };

  const handlePreviewColor = (colorValue: string) => {
    if (previewMode) {
      setThemeColor(colorValue);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: "Modo de tema actualizado",
      description: `Cambiado a modo ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'oscuro' : 'sistema'}.`,
    });
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
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Preferencias Generales
              </CardTitle>
              <CardDescription>Idioma, notificaciones y personalización.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div className="space-y-2">
                <Label>Idioma</Label>
                <LanguageSelect />
                <p className="text-xs text-muted-foreground">El idioma se aplicará en toda la app.</p>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">Notificaciones por Email</p>
                    <p className="text-xs text-muted-foreground">Recordatorios y actualizaciones importantes.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">Notificaciones Push</p>
                    <p className="text-xs text-muted-foreground">Alertas en tiempo real en tu dispositivo.</p>
                  </div>
                  <Switch />
                </div>
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
              {/* Theme Mode */}
              <div className="space-y-3">
                <Label>Modo de Tema</Label>
                <div className="flex gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleThemeChange('system')}
                  >
                    <Monitor className="h-4 w-4" />
                    Sistema
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Modo actual: <strong>{actualTheme === 'dark' ? 'Oscuro' : 'Claro'}</strong>
                </p>
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
                        setThemeColor(color.value);
                        if (previewMode) {
                          handlePreviewColor(color.value);
                        }
                      }}
                      className={`
                        group relative h-10 w-10 rounded-lg transition-all hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                        ${color.class}
                        ${themeColor === color.value ? 'ring-2 ring-foreground ring-offset-2 scale-110' : ''}
                      `}
                      title={color.name}
                    >
                      {themeColor === color.value && (
                        <div className="absolute inset-0 rounded-lg bg-white/20 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-white" />
                        </div>
                      )}
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  Color seleccionado: <strong>{themeColors.find(c => c.value === themeColor)?.name}</strong>
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
                <Button variant="outline" onClick={() => setThemeColor('blue')}>
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
                      style={{ backgroundColor: themeColors.find(c => c.value === themeColor)?.color }}
                    />
                    <span className="font-medium text-xs">
                      {themeColors.find(c => c.value === themeColor)?.name}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modo:</span>
                  <span className="font-medium text-xs capitalize">
                    {theme === 'system' ? `Sistema (${actualTheme})` : theme === 'light' ? 'Claro' : 'Oscuro'}
                  </span>
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
