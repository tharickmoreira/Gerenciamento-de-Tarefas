/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/src/components/Sidebar';
import { Board } from '@/src/components/Board';
import { ListView } from '@/src/components/ListView';
import { CreateTaskModal } from '@/src/components/CreateTaskModal';
import { Project, Task, Status, Priority } from '@/src/types';
import { 
  Grid, 
  List as ListIcon, 
  Calendar, 
  Search, 
  Settings, 
  Bell, 
  Plus,
  Sparkles,
  Share2,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Sample Data
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Marketing Launch',
    ownerId: 'tharick',
    members: ['tharick'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'p2',
    name: 'Q3 Product Roadmap',
    ownerId: 'tharick',
    members: ['tharick'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Design Hero Banners',
    description: 'Create 3 variations of hero banners for the home page.',
    status: 'in-progress',
    priority: 'high',
    creatorId: 'tharick',
    assigneeId: 'tharick',
    dueDate: Date.now() + 86400000 * 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Draft Website Copy',
    description: 'Write compelling copy for the landing page.',
    status: 'todo',
    priority: 'medium',
    creatorId: 'tharick',
    dueDate: Date.now() + 86400000 * 5,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 't3',
    projectId: 'p2',
    title: 'Research Competitors',
    description: 'Analyze main competitors features and pricing.',
    status: 'done',
    priority: 'low',
    creatorId: 'tharick',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || '');
  const [view, setView] = useState<'board' | 'list'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<Status>('todo');

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId), 
  [projects, activeProjectId]);

  const filteredTasks = useMemo(() => 
    tasks.filter(t => t.projectId === activeProjectId),
  [tasks, activeProjectId]);

  const handleCreateTask = (data: Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: activeProjectId,
      creatorId: 'tharick',
      ...data
    } as Task;
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleAddTaskClick = (status: Status = 'todo') => {
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleAISuggestions = async () => {
    if (!activeProject) return;
    
    const toast = alert; // Simple alert for now
    try {
      const resp = await fetch('/api/suggest-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectName: activeProject.name,
          projectDescription: activeProject.description
        })
      });
      const data = await resp.json();
      if (data.tasks) {
        const newTasks = data.tasks.map((t: any) => ({
          ...t,
          id: Math.random().toString(36).substr(2, 9),
          projectId: activeProjectId,
          creatorId: 'ai',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }));
        setTasks(prev => [...prev, ...newTasks]);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to get AI suggestions');
    }
  };

  const handleCreateProject = () => {
    const name = prompt('Project Name:');
    if (!name) return;
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      ownerId: 'tharick',
      members: ['tharick'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onCreateProject={handleCreateProject}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
             <nav className="flex items-center text-sm text-slate-500">
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Spaces</span>
                <span className="mx-2 text-slate-300">/</span>
                <span className="font-bold text-slate-900">{activeProject?.name}</span>
             </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tharick" alt="User" />
               </div>
            </div>
          </div>
        </header>

        {/* Sub-header / Tabs */}
        <div className="px-6 pt-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{activeProject?.name}</h1>
            <nav className="flex gap-6 mt-0.5">
              <button 
                onClick={() => setView('list')}
                className={cn(
                  "pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
                  view === 'list' ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <ListIcon className="w-4 h-4" />
                List View
              </button>
              <button 
                onClick={() => setView('board')}
                className={cn(
                  "pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
                  view === 'board' ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <Grid className="w-4 h-4" />
                Board View
              </button>
              <button className="pb-4 text-sm font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition-all flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3 pb-3">
            <button 
              onClick={handleAISuggestions}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Suggest
            </button>
            <button 
              onClick={() => handleAddTaskClick()}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Toolbar / Filters */}
        <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-6">
              <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort
              </button>
              <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
           </div>
           <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
             {filteredTasks.length} Active Tasks
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + activeProjectId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {view === 'board' ? (
                <Board 
                  tasks={filteredTasks} 
                  onUpdateTask={handleUpdateTask} 
                  onAddTask={handleAddTaskClick}
                />
              ) : (
                <ListView 
                  tasks={filteredTasks} 
                  onUpdateTask={handleUpdateTask} 
                  onAddTask={handleAddTaskClick}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
