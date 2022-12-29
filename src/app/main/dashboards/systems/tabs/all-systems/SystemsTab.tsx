import { motion } from 'framer-motion';
import SystemsTable from './widgets/SystemsTable';

function SystemsTab() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="sm:col-span-6">
        <SystemsTable />
      </motion.div>
    </motion.div>
  );
}

export default SystemsTab;
