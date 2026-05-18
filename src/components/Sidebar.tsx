import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Settings, 
  Search,
  ChevronRight,
  Hash,
  Filter,
  MoreVertical,
  Calendar,
  Grid,
  List as ListIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Project, Task, Priority, Status } from '@/src/types';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
}

export function Sidebar({ projects, activeProjectId, onSelectProject, onCreateProject }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-[#1E293B] flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="text-white font-bold text-lg tracking-tight">ClickFlow</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
        <div className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-slate-800 border-none rounded-md py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <nav className="px-3 space-y-1">
          <div className="text-slate-400 text-[10px] font-bold uppercase px-3 py-2 tracking-widest">General</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Everything
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 transition-colors">
            <CheckCircle2 className="w-4 h-4" />
            My Tasks
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 transition-colors">
            <Clock className="w-4 h-4" />
            Recent
          </button>
        </nav>

        <div className="mt-8 px-6 flex items-center justify-between group">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Spaces</span>
          <button 
            onClick={onCreateProject}
            className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-slate-800 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="mt-2 px-3 space-y-1 mb-8">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={cn(
                "w-full flex flex-col gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                activeProjectId === project.id 
                  ? "bg-slate-800 text-white shadow-sm ring-1 ring-white/5" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              )}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  activeProjectId === project.id ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "bg-slate-600"
                )} />
                <span className="flex-1 text-left truncate">{project.name}</span>
              </div>
              {activeProjectId === project.id && (
                 <div className="ml-5 mt-1 w-full flex flex-col gap-1">
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" 
                       />
                    </div>
                 </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-[#1e293b]/50">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-slate-600 border border-slate-500 overflow-hidden shrink-0 shadow-inner">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tharick" alt="User" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">Tharick Moreira</span>
            <span className="text-xs text-slate-500 font-medium truncate">Workspace Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
