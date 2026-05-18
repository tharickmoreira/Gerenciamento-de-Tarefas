import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, Flag, User, Clock, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Task, Priority, Status } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  defaultStatus?: Status;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit, defaultStatus = 'todo' }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title,
      description,
      status,
      priority,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[60] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-bottom border-slate-100">
              <h2 className="font-bold text-lg">Create Task</h2>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Task name or type '/' for commands"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl font-bold border-none placeholder:text-slate-300 focus:ring-0 outline-none"
                />

                <textarea
                  placeholder="Task description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[120px] text-sm text-slate-600 border-none placeholder:text-slate-400 focus:ring-0 outline-none resize-none"
                />

                <div className="flex flex-wrap gap-2 pt-4 border-top border-slate-100">
                   <button 
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-xs font-semibold text-slate-600 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    Assignee
                  </button>
                  <div className="flex items-center gap-2">
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="bg-slate-100 hover:bg-slate-200 border-none rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none appearance-none"
                    >
                      <option value="low">Priority: Low</option>
                      <option value="medium">Priority: Medium</option>
                      <option value="high">Priority: High</option>
                      <option value="urgent">Priority: Urgent</option>
                    </select>
                  </div>
                  <button 
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-xs font-semibold text-slate-600 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Due Date
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-top border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Status:</span>
                   <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Status)}
                      className="bg-transparent border-none py-1 text-xs font-bold text-indigo-600 outline-none cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
