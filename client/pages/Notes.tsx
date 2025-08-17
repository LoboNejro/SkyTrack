import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  FileText, Plus, Edit, Trash2, Search, Filter, Eye, 
  BookOpen, Calendar, Paperclip, MoreHorizontal 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Note } from '../contexts/DataContext';

export default function Notes() {
  const { classes, notes, addNote, updateNote, removeNote } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    classID: '',
    attachments: [] as string[]
  });
  
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === 'all' || note.classID === selectedClass;
      
      return matchesSearch && matchesClass;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes, searchQuery, selectedClass]);
  
  const notesByClass = useMemo(() => {
    const grouped: { [key: string]: Note[] } = {};
    classes.forEach(cls => {
      grouped[cls.id] = filteredNotes.filter(note => note.classID === cls.id);
    });
    grouped['unassigned'] = filteredNotes.filter(note => !note.classID);
    return grouped;
  }, [filteredNotes, classes]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    if (editingNote) {
      updateNote(editingNote, {
        title: formData.title,
        content: formData.content,
        classID: formData.classID,
        attachments: formData.attachments
      });
      setEditingNote(null);
    } else {
      addNote({
        title: formData.title,
        content: formData.content,
        classID: formData.classID,
        attachments: formData.attachments
      });
    }
    
    resetForm();
    setShowAddDialog(false);
  };
  
  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      classID: note.classID,
      attachments: note.attachments
    });
    setEditingNote(note.id);
    setShowAddDialog(true);
  };
  
  const handleView = (note: Note) => {
    setViewingNote(note);
    setShowDetailDialog(true);
  };
  
  const handleDelete = (noteId: string) => {
    removeNote(noteId);
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      classID: '',
      attachments: []
    });
    setEditingNote(null);
  };
  
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };
  
  const NoteCard = ({ note }: { note: Note }) => {
    const classItem = classes.find(c => c.id === note.classID);
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0" onClick={() => handleView(note)}>
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {note.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {classItem && (
                  <Badge variant="secondary" className="text-xs">
                    <div 
                      className="h-2 w-2 rounded-full mr-1" 
                      style={{ backgroundColor: classItem.color }}
                    />
                    {classItem.name}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {format(note.createdAt, 'MMM d, yyyy', { locale: es })}
                </span>
                {note.attachments.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Paperclip className="h-3 w-3 mr-1" />
                    {note.attachments.length}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(note);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(note);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Nota</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que quieres eliminar "{note.title}"? Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(note.id)}>
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent onClick={() => handleView(note)}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncateContent(note.content)}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notas</h1>
          <p className="text-muted-foreground">
            Crea y organiza tus notas de estudio.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Nota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Editar Nota' : 'Nueva Nota'}</DialogTitle>
                <DialogDescription>
                  {editingNote ? 'Actualiza el contenido de tu nota.' : 'Crea una nueva nota para tus estudios.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="ej. Apuntes de Matemáticas - Capítulo 5"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Clase (Opcional)</Label>
                  <Select 
                    value={formData.classID} 
                    onValueChange={(value) => setFormData({ ...formData, classID: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar clase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin clase asociada</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: classItem.color }}
                            />
                            {classItem.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    placeholder="Escribe el contenido de tu nota aquí..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="resize-none"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingNote ? 'Actualizar Nota' : 'Guardar Nota'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Note Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          {viewingNote && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <DialogTitle className="text-xl">{viewingNote.title}</DialogTitle>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const classItem = classes.find(c => c.id === viewingNote.classID);
                        return classItem ? (
                          <Badge variant="secondary" className="text-xs">
                            <div 
                              className="h-2 w-2 rounded-full mr-1" 
                              style={{ backgroundColor: classItem.color }}
                            />
                            {classItem.name}
                          </Badge>
                        ) : null;
                      })()}
                      <span className="text-sm text-muted-foreground">
                        Creado {format(viewingNote.createdAt, 'MMM d, yyyy \'a las\' HH:mm', { locale: es })}
                      </span>
                      {viewingNote.attachments.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {viewingNote.attachments.length} archivos
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowDetailDialog(false);
                        handleEdit(viewingNote);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[50vh] pr-4">
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {viewingNote.content}
                    </div>
                  </div>
                  {viewingNote.attachments.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Archivos adjuntos</h4>
                      <div className="space-y-2">
                        {viewingNote.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="text-primary hover:underline cursor-pointer">
                              {attachment}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
      
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
                  placeholder="Buscar notas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classFilter">Clase</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Notas</SelectItem>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: classItem.color }}
                        />
                        {classItem.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No hay notas</h3>
          <p className="text-muted-foreground mb-4">
            Crea tu primera nota para comenzar a organizar tus estudios.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Primera Nota
          </Button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No se encontraron notas</h3>
          <p className="text-muted-foreground mb-4">
            Intenta ajustar tus filtros o términos de búsqueda.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              Todas
              <Badge variant="secondary" className="text-xs">
                {filteredNotes.length}
              </Badge>
            </TabsTrigger>
            {classes.slice(0, 4).map((classItem) => (
              <TabsTrigger key={classItem.id} value={classItem.id} className="flex items-center gap-2">
                <div 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: classItem.color }}
                />
                <span className="truncate">{classItem.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {notesByClass[classItem.id]?.length || 0}
                </Badge>
              </TabsTrigger>
            ))}
            {classes.length > 4 && (
              <TabsTrigger value="more" className="flex items-center gap-2">
                <MoreHorizontal className="h-4 w-4" />
                Más
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </TabsContent>
          
          {classes.map((classItem) => (
            <TabsContent key={classItem.id} value={classItem.id} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notesByClass[classItem.id]?.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
              {notesByClass[classItem.id]?.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay notas para {classItem.name}</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
