import { Task, Priority, Status } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical, 
  Filter, 
  ArrowUpDown,
  Tag,
  User,
  AlertCircle
} from 'lucide-react';

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (status: Status) => void;
}

const statusIcons: Record<Status, React.ReactNode> = {
  'todo': <Circle className="w-4 h-4 text-slate-400" />,
  'in-progress': <Clock className="w-4 h-4 text-indigo-500" />,
  'done': <CheckCircle2 className="w-4 h-4 text-emerald-500" />
};

const priorityConfig: Record<Priority, { label: string, color: string }> = {
  'urgent': { label: 'Urgent', color: 'text-red-500 bg-red-50' },
  'high': { label: 'High', color: 'text-orange-500 bg-orange-50' },
  'medium': { label: 'Medium', color: 'text-blue-500 bg-blue-50' },
  'low': { label: 'Low', color: 'text-slate-400 bg-slate-50' }
};

export function ListView({ tasks, onUpdateTask, onAddTask }: ListViewProps) {
  return (
    <div className="flex-1 bg-white overflow-hidden flex flex-col">
      <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ring-1 ring-blue-700/10">Active</span>
        <span className="text-slate-400 text-xs font-bold">{tasks.length} Tasks</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Task Name</th>
                <th className="px-6 py-4 text-center">Assignee</th>
                <th className="px-6 py-4 text-center">Due Date</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const pConfig = priorityConfig[task.priority];
                const isDone = task.status === 'done';
                
                return (
                  <tr key={task.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onUpdateTask({ ...task, status: isDone ? 'todo' : 'done' })}
                          className="shrink-0 transition-transform active:scale-95"
                        >
                          {statusIcons[task.status]}
                        </button>
                        <div className="flex flex-col min-w-0">
                          <span className={cn(
                            "font-bold text-slate-700 truncate",
                            isDone && "text-slate-400 line-through font-medium"
                          )}>
                            {task.title}
                          </span>
                          {task.description && (
                            <span className="text-xs text-slate-400 truncate max-w-md">
                              {task.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white overflow-hidden shadow-sm ring-1 ring-slate-200">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId || 'guest'}`} alt="Assignee" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center text-xs font-semibold text-slate-500">
                        {task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-tight",
                          pConfig.color
                        )}>
                          {task.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
                         <div className={cn(
                           "w-2 h-2 rounded-full",
                           task.status === 'done' ? "bg-emerald-500" : task.status === 'in-progress' ? "bg-indigo-500" : "bg-slate-400"
                         )} />
                         {task.status.replace('-', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg transition-all text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                    No tasks found in this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <button 
            onClick={() => onAddTask('todo')}
            className="w-full flex items-center justify-center gap-2 py-4 text-xs font-bold text-indigo-600 bg-slate-50/50 hover:bg-indigo-50 transition-colors border-t border-slate-100"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
  );
}
