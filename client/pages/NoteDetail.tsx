import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ArrowLeft, FileText, Edit, Trash2, Clock, BookOpen, 
  Paperclip, Share, Copy, Download, Eye, Calendar,
  MessageSquare, Star, Archive
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Note } from '../contexts/DataContext';

export default function NoteDetail() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { notes, classes, updateNote, removeNote } = useData();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    classID: ''
  });
  
  const note = notes.find(n => n.id === noteId);
  const classItem = note ? classes.find(c => c.id === note.classID) : null;
  
  if (!note) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/notes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Notas
          </Button>
        </div>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Nota no encontrada</h3>
          <p className="text-muted-foreground mb-4">
            La nota que buscas no existe o ha sido eliminada.
          </p>
          <Button asChild>
            <Link to="/dashboard/notes">Volver a Notas</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      title: note.title,
      content: note.content,
      classID: note.classID
    });
    setShowEditDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    updateNote(note.id, {
      title: formData.title,
      content: formData.content,
      classID: formData.classID
    });
    
    setShowEditDialog(false);
    // Update the local note reference would happen via context
  };

  const handleDelete = () => {
    removeNote(note.id);
    navigate('/dashboard/notes');
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(note.content);
    // You could add a toast notification here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: note.content
      });
    } else {
      handleCopyContent();
    }
  };

  const wordCount = note.content.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = note.content.length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/notes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Notas
        </Button>
      </div>

      {/* Note Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{note.title}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Creada {format(note.createdAt, 'MMM d, yyyy \'a las\' HH:mm', { locale: es })}</span>
                  {classItem && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: classItem.color }}
                        />
                        <span>{classItem.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{wordCount} palabras</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{charCount} caracteres</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>~{readingTime} min lectura</span>
              </div>
              {note.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-4 w-4" />
                  <span>{note.attachments.length} archivos</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyContent}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Tags/Badges */}
        <div className="flex items-center gap-2">
          {classItem && (
            <Badge variant="secondary">
              <BookOpen className="h-3 w-3 mr-1" />
              {classItem.name}
            </Badge>
          )}
          <Badge variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            {format(note.createdAt, 'MMM yyyy', { locale: es })}
          </Badge>
          {note.attachments.length > 0 && (
            <Badge variant="outline">
              <Paperclip className="h-3 w-3 mr-1" />
              {note.attachments.length} archivos
            </Badge>
          )}
        </div>
      </div>

      {/* Note Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contenido de la Nota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[70vh] w-full">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {note.content}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Attachments */}
      {note.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Archivos Adjuntos ({note.attachments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {note.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{attachment}</p>
                    <p className="text-xs text-muted-foreground">Archivo adjunto</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Content */}
      {classItem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Clase Relacionada
            </CardTitle>
            <CardDescription>
              Esta nota pertenece a la clase {classItem.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              to={`/dashboard/classes/${classItem.id}`}
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: classItem.color }}
              >
                {classItem.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{classItem.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Creada {format(classItem.createdAt, 'MMM d, yyyy', { locale: es })}
                </p>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Editar Nota</DialogTitle>
              <DialogDescription>
                Actualiza el contenido de tu nota.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
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
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="resize-none"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
