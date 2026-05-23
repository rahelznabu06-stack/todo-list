import { useState, useEffect, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Todo, Filter } from './types';
import TodoItem from './components/TodoItem';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('focus-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('focus-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'active' ? !todo.completed :
        todo.completed;
      
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [todos]);

  const today = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-black selection:text-white">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-12" id="app-header">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-2">
                Today's Focus
              </h1>
              <p className="flex items-center gap-2 text-gray-500">
                <Calendar size={16} />
                {today}
              </p>
            </motion.div>
            
            <div className="text-right">
              <div className="text-3xl font-light tracking-tighter" id="progress-percentage">
                {stats.percentage}%
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                Done
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 0.8, ease: "circOut" }}
            />
          </div>
        </header>

        {/* Input & Search */}
        <div className="space-y-4 mb-8">
          <form onSubmit={addTodo} className="relative group" id="todo-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a task..."
              className="w-full bg-white border border-gray-200 p-5 pr-14 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all text-xl placeholder:text-gray-300"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
              disabled={!inputValue.trim()}
              id="add-button"
            >
              <Plus size={24} />
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl" id="filter-controls">
              {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-white shadow-sm text-black' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  id={`filter-${f}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 bg-gray-50 border-none pl-10 pr-4 py-2 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </AnimatePresence>

          {filteredTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
              id="empty-state"
            >
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
                {filter === 'completed' ? <CheckCircle2 className="text-gray-300" size={32} /> : <Circle className="text-gray-300" size={32} />}
              </div>
              <h3 className="text-gray-900 font-medium mb-1">
                {searchQuery ? 'No results found' : 'Nothing to do'}
              </h3>
              <p className="text-gray-400 text-sm">
                {searchQuery ? 'Try adjusted your search query' : 'Enjoy your day!'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-20 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-xs tracking-wide">
          <p className="uppercase">FOCUS TODO &copy; 2026</p>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <span>{stats.completed} COMPLETED</span>
              <span>{stats.total - stats.completed} REMAINING</span>
            </div>
            {stats.completed > 0 && (
              <button
                onClick={() => setTodos(todos.filter(t => !t.completed))}
                className="text-gray-500 hover:text-black transition-colors font-medium border-l border-gray-200 pl-6 uppercase"
                id="clear-completed"
              >
                Clear Completed
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
