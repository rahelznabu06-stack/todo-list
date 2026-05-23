import { motion, AnimatePresence } from 'motion/react';
import { Check, Trash2, Circle } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      id={`todo-${todo.id}`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
          todo.completed
            ? 'bg-black border-black text-white'
            : 'border-gray-300 hover:border-black'
        }`}
        id={`toggle-${todo.id}`}
      >
        <AnimatePresence mode="wait">
          {todo.completed ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={14} strokeWidth={3} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </button>

      <span
        className={`flex-1 text-lg transition-all duration-300 ${
          todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
        }`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        id={`delete-${todo.id}`}
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
