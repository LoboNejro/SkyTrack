import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import {
  BookOpen,
  CheckSquare,
  FileText,
  Users,
  Calendar,
  Plus,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { classes, tasks, notes, contacts, events } = useData();

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const upcomingTasks = tasks
    .filter(task => task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentNotes = notes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getTaskPriority = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'high';
    return 'normal';
  };

  const stats = [
    {
      title: 'Classes',
      value: classes.length,
      description: 'Active classes',
      icon: BookOpen,
      href: '/dashboard/classes',
      color: 'text-blue-600'
    },
    {
      title: 'Tasks',
      value: tasks.length,
      description: `${completedTasks} completed`,
      icon: CheckSquare,
      href: '/dashboard/tasks',
      color: 'text-green-600'
    },
    {
      title: 'Notes',
      value: notes.length,
      description: 'Total notes',
      icon: FileText,
      href: '/dashboard/notes',
      color: 'text-purple-600'
    },
    {
      title: 'Contacts',
      value: contacts.length,
      description: 'Saved contacts',
      icon: Users,
      href: '/dashboard/contacts',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your studies today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/dashboard/tasks">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/classes">
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
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
              <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto" asChild>
                <Link to={stat.href}>View all →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Overview
            </CardTitle>
            <CardDescription>
              You've completed {completedTasks} out of {totalTasks} tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Task Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>
              {upcomingTasks.length === 0 ? 'No upcoming tasks' : `${upcomingTasks.length} pending tasks`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks due soon</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/dashboard/tasks">
                    <Plus className="mr-2 h-4 w-4" />
                    Add your first task
                  </Link>
                </Button>
              </div>
            ) : (
              upcomingTasks.map((task) => {
                const priority = getTaskPriority(task.dueDate);
                const className = classes.find(c => c.id === task.classID);
                
                return (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {className && (
                          <Badge variant="secondary" className="text-xs">
                            {className.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Due {getDateLabel(task.dueDate)}
                        </span>
                        {priority === 'overdue' && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {upcomingTasks.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/dashboard/tasks">View all tasks →</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              {upcomingEvents.length === 0 ? 'No upcoming events' : `${upcomingEvents.length} upcoming events`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming events</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/dashboard/calendar">
                    <Plus className="mr-2 h-4 w-4" />
                    Add an event
                  </Link>
                </Button>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getDateLabel(event.date)}
                    </p>
                  </div>
                </div>
              ))
            )}
            {upcomingEvents.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/dashboard/calendar">View calendar →</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Notes
            </CardTitle>
            <CardDescription>
              {recentNotes.length === 0 ? 'No notes yet' : `${recentNotes.length} recent notes`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotes.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No notes yet</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/dashboard/notes">
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first note
                  </Link>
                </Button>
              </div>
            ) : (
              recentNotes.map((note) => {
                const className = classes.find(c => c.id === note.classID);
                
                return (
                  <div key={note.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{note.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {className && (
                          <Badge variant="secondary" className="text-xs">
                            {className.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(note.createdAt, 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {recentNotes.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/dashboard/notes">View all notes →</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
