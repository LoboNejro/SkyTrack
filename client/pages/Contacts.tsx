import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Users, Plus, Edit, Trash2, Search, Filter, Mail, Phone, 
  User, GraduationCap, Heart, MoreHorizontal 
} from 'lucide-react';
import { format } from 'date-fns';
import { Contact } from '../contexts/DataContext';

const contactTypeConfig = {
  friend: { label: 'Amigo', icon: Heart, color: 'bg-pink-500' },
  teacher: { label: 'Profesor', icon: GraduationCap, color: 'bg-blue-500' },
  other: { label: 'Otro', icon: User, color: 'bg-gray-500' }
};

export default function Contacts() {
  const { contacts, addContact, updateContact, removeContact } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photoURL: '',
    type: 'friend' as Contact['type']
  });
  
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.phone.includes(searchQuery);
      const matchesType = selectedType === 'all' || contact.type === selectedType;
      
      return matchesSearch && matchesType;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, searchQuery, selectedType]);
  
  const contactsByType = {
    friend: filteredContacts.filter(contact => contact.type === 'friend'),
    teacher: filteredContacts.filter(contact => contact.type === 'teacher'),
    other: filteredContacts.filter(contact => contact.type === 'other')
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    
    if (editingContact) {
      updateContact(editingContact, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        photoURL: formData.photoURL,
        type: formData.type
      });
      setEditingContact(null);
    } else {
      addContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        photoURL: formData.photoURL,
        type: formData.type
      });
    }
    
    resetForm();
    setShowAddDialog(false);
  };
  
  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      photoURL: contact.photoURL || '',
      type: contact.type
    });
    setEditingContact(contact.id);
    setShowAddDialog(true);
  };
  
  const handleDelete = (contactId: string) => {
    removeContact(contactId);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      photoURL: '',
      type: 'friend'
    });
    setEditingContact(null);
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const ContactCard = ({ contact }: { contact: Contact }) => {
    const typeConfig = contactTypeConfig[contact.type];
    const TypeIcon = typeConfig.icon;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={contact.photoURL} alt={contact.name} />
              <AvatarFallback className={`${typeConfig.color} text-white`}>
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">
                    {contact.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeConfig.label}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar Contacto</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que quieres eliminar a "{contact.name}"? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(contact.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`mailto:${contact.email}`}
                className="text-primary hover:underline truncate"
              >
                {contact.email}
              </a>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-primary hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Agregado {format(contact.createdAt, 'MMM d, yyyy')}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona tus contactos académicos y personales.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Contacto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}</DialogTitle>
                <DialogDescription>
                  {editingContact ? 'Actualiza la información del contacto.' : 'Agrega un nuevo contacto a tu lista.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    placeholder="ej. Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (Opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Contacto</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value as Contact['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friend">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Amigo
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Profesor
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Otro
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingContact ? 'Actualizar Contacto' : 'Agregar Contacto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar contactos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeFilter">Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Contactos</SelectItem>
                  <SelectItem value="friend">Amigos</SelectItem>
                  <SelectItem value="teacher">Profesores</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No hay contactos</h3>
          <p className="text-muted-foreground mb-4">
            Agrega tu primer contacto para comenzar a organizar tu red académica.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Primer Contacto
          </Button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No se encontraron contactos</h3>
          <p className="text-muted-foreground mb-4">
            Intenta ajustar tus filtros o términos de búsqueda.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              Todos
              <Badge variant="secondary" className="text-xs">
                {filteredContacts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="friend" className="flex items-center gap-2">
              Amigos
              <Badge variant="secondary" className="text-xs">
                {contactsByType.friend.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              Profesores
              <Badge variant="secondary" className="text-xs">
                {contactsByType.teacher.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center gap-2">
              Otros
              <Badge variant="secondary" className="text-xs">
                {contactsByType.other.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="friend" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contactsByType.friend.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="teacher" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contactsByType.teacher.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="other" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contactsByType.other.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
