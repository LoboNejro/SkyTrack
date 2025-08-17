import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { 
  ArrowLeft, BookOpen, CheckSquare, FileText, Users, Calendar,
  Plus, Eye, Edit, Trash2, Clock, AlertCircle, Mail, Phone,
  TrendingUp, Target, Activity
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { es } from 'date-fns/locale';

const contactTypeConfig = {
  friend: { label: 'Amigo', icon: Users, color: 'bg-pink-500' },
  teacher: { label: 'Profesor', icon: Users, color: 'bg-blue-500' },
  other: { label: 'Otro', icon: Users, color: 'bg-gray-500' }
};

export default function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { classes, tasks, notes, events, contacts } = useData();
  
  const classItem = classes.find(c => c.id === classId);
  
  if (!classItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/classes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clases
          </Button>
        </div>
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Clase no encontrada</h3>
          <p className="text-muted-foreground mb-4">
            La clase que buscas no existe o ha sido eliminada.
          </p>
          <Button asChild>
            <Link to="/dashboard/classes">Volver a Clases</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get related data
  const classTasks = tasks.filter(task => task.classID === classId);
  const classNotes = notes.filter(note => note.classID === classId);
  const classEvents = events.filter(event => event.classID === classId);
  const relatedContacts = contacts.filter(contact => contact.type === 'teacher'); // Teachers are likely related to classes
  
  // Task statistics
  const completedTasks = classTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = classTasks.filter(task => task.status === 'pending').length;
  const overdueTasks = classTasks.filter(task => 
    task.status === 'pending' && isPast(new Date(task.dueDate))
  ).length;
  const completionPercentage = classTasks.length > 0 
    ? Math.round((completedTasks / classTasks.length) * 100) 
    : 0;

  // Upcoming items
  const upcomingTasks = classTasks
    .filter(task => task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const upcomingEvents = classEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentNotes = classNotes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    if (isPast(date)) return 'Vencido';
    return format(date, 'MMM d', { locale: es });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = [
    {
      title: 'Tareas Totales',
      value: classTasks.length,
      description: `${completedTasks} completadas`,
      icon: CheckSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Notas',
      value: classNotes.length,
      description: 'Notas guardadas',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'Eventos',
      value: classEvents.length,
      description: 'En calendario',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Progreso',
      value: `${completionPercentage}%`,
      description: 'Completado',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/classes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Clases
        </Button>
      </div>

      {/* Class Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: classItem.color }}
          >
            {getInitials(classItem.name)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{classItem.name}</h1>
            <p className="text-muted-foreground">
              Creada {format(classItem.createdAt, 'MMM d, yyyy', { locale: es })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/dashboard/tasks?class=${classId}`}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/dashboard/notes?class=${classId}`}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Nota
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      {classTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progreso de Tareas
            </CardTitle>
            <CardDescription>
              {completedTasks} de {classTasks.length} tareas completadas
              {overdueTasks > 0 && (
                <span className="text-destructive ml-2">
                  · {overdueTasks} vencidas
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completado</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">Completadas</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{pendingTasks}</div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                <p className="text-xs text-muted-foreground">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            Tareas
            <Badge variant="secondary" className="text-xs">
              {classTasks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            Notas
            <Badge variant="secondary" className="text-xs">
              {classNotes.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            Eventos
            <Badge variant="secondary" className="text-xs">
              {classEvents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            Contactos
            <Badge variant="secondary" className="text-xs">
              {relatedContacts.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Próximas Tareas
                </CardTitle>
                <CardDescription>
                  {upcomingTasks.length === 0 ? 'No hay tareas pendientes' : `${upcomingTasks.length} tareas próximas`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay tareas pendientes</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link to="/dashboard/tasks">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar tarea
                      </Link>
                    </Button>
                  </div>
                ) : (
                  upcomingTasks.map((task) => {
                    const isOverdue = isPast(new Date(task.dueDate));
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={isOverdue ? "destructive" : "outline"} 
                              className="text-xs"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              {getDateLabel(task.dueDate)}
                              {isOverdue && <AlertCircle className="h-3 w-3 ml-1" />}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {upcomingTasks.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link to="/dashboard/tasks">Ver todas las tareas →</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas Recientes
                </CardTitle>
                <CardDescription>
                  {recentNotes.length === 0 ? 'No hay notas' : `${recentNotes.length} notas guardadas`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentNotes.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay notas para esta clase</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link to="/dashboard/notes">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear nota
                      </Link>
                    </Button>
                  </div>
                ) : (
                  recentNotes.map((note) => (
                    <div key={note.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{note.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {note.content.slice(0, 100)}...
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {format(note.createdAt, 'MMM d', { locale: es })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {recentNotes.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link to="/dashboard/notes">Ver todas las notas →</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
                <CardDescription>
                  {upcomingEvents.length} eventos programados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(event.date, 'MMM d, HH:mm', { locale: es })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                  <Link to="/dashboard/calendar">Ver calendario →</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {classTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay tareas para esta clase</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primera tarea para empezar a organizar tu trabajo.
              </p>
              <Button asChild>
                <Link to="/dashboard/tasks">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Tarea
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {classTasks.map((task) => {
                const isOverdue = task.status === 'pending' && isPast(new Date(task.dueDate));
                return (
                  <Card key={task.id} className={isOverdue ? 'border-red-200 bg-red-50/50' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className={`text-lg ${task.status === 'completed' ? 'line-through' : ''}`}>
                            {task.title}
                          </CardTitle>
                          {task.description && (
                            <CardDescription>{task.description}</CardDescription>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={task.status === 'completed' ? 'default' : isOverdue ? 'destructive' : 'outline'} 
                              className="text-xs"
                            >
                              {task.status === 'completed' ? 'Completada' : getDateLabel(task.dueDate)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          {classNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay notas para esta clase</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primera nota para empezar a guardar información importante.
              </p>
              <Button asChild>
                <Link to="/dashboard/notes">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Nota
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
                    <CardDescription>
                      {format(note.createdAt, 'MMM d, yyyy', { locale: es })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {note.content.slice(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {classEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay eventos para esta clase</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primer evento para empezar a organizar tu horario.
              </p>
              <Button asChild>
                <Link to="/dashboard/calendar">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Evento
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {classEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(event.date, 'MMM d, yyyy \'a las\' HH:mm', { locale: es })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          {relatedContacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay contactos</h3>
              <p className="text-muted-foreground mb-4">
                Agrega contactos de profesores o compañeros relacionados con esta clase.
              </p>
              <Button asChild>
                <Link to="/dashboard/contacts">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Contacto
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedContacts.map((contact) => {
                const typeConfig = contactTypeConfig[contact.type];
                return (
                  <Card key={contact.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.photoURL} alt={contact.name} />
                          <AvatarFallback className={`${typeConfig.color} text-white`}>
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {typeConfig.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
