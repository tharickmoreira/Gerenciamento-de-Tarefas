import { motion, Reorder } from 'motion/react';
import { MoreVertical, Plus, Clock, MessageSquare, Paperclip, ChevronDown } from 'lucide-react';
import { Task, Priority, Status } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';

interface BoardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (status: Status) => void;
}

const statusConfig: Record<Status, { label: string, color: string, border: string }> = {
  'todo': { label: 'To Do', color: 'bg-slate-500', border: 'border-slate-500' },
  'in-progress': { label: 'In Progress', color: 'bg-indigo-500', border: 'border-indigo-500' },
  'done': { label: 'Complete', color: 'bg-emerald-500', border: 'border-emerald-500' }
};

const priorityConfig: Record<Priority, { label: string, color: string, iconColor: string }> = {
  'urgent': { label: 'Urgent', color: 'bg-red-100 text-red-700', iconColor: 'text-red-500' },
  'high': { label: 'High', color: 'bg-orange-100 text-orange-700', iconColor: 'text-orange-500' },
  'medium': { label: 'Medium', color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500' },
  'low': { label: 'Low', color: 'bg-slate-100 text-slate-700', iconColor: 'text-slate-400' }
};

export function Board({ tasks, onUpdateTask, onAddTask }: BoardProps) {
  const columns: Status[] = ['todo', 'in-progress', 'done'];

  return (
    <div className="flex-1 flex gap-6 p-6 overflow-x-auto custom-scrollbar h-full">
      {columns.map((status) => {
        const columnTasks = tasks.filter(t => t.status === status);
        const config = statusConfig[status];

        return (
          <div key={status} className="flex flex-col w-80 shrink-0">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ring-1",
                  status === 'done' ? "bg-emerald-100 text-emerald-700 ring-emerald-200" : 
                  status === 'in-progress' ? "bg-blue-100 text-blue-700 ring-blue-200" : 
                  "bg-slate-100 text-slate-600 ring-slate-200"
                )}>
                  {config.label}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onAddTask(status)}
                  className="p-1.5 hover:bg-slate-200/50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pb-6 pr-1">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              <button 
                onClick={() => onAddTask(status)}
                className="w-full py-3 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 rounded-xl border border-dashed border-slate-300 transition-all bg-white/30"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const pConfig = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 hover:border-indigo-400 hover:shadow-[0_4px_12px_rgba(99,102,241,0.12)] transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        pConfig.iconColor.replace('text-', 'bg-')
      )} />
      
      <div className="flex items-start justify-between mb-3 pl-1">
        <span className={cn(
          "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
          pConfig.color
        )}>
          {pConfig.label}
        </span>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-lg transition-all">
          <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-2 pl-1 group-hover:text-indigo-600 transition-colors">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed pl-1">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-50 pl-1">
        <div className="flex -space-x-2 items-center">
          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.creatorId}`} alt="Avatar" />
          </div>
          {task.assigneeId && (
            <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-50 overflow-hidden shadow-sm ring-1 ring-slate-100">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId}`} alt="Assignee" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
              <Clock className="w-3 h-3" />
              {format(task.dueDate, 'MMM d')}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
            <MessageSquare className="w-3 h-3" />
            2
          </div>
        </div>
      </div>
    </motion.div>
  );
}
