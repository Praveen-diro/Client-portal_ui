import { motion } from "framer-motion";

interface DocumentsSectionProps {
  boxVariants: any;
  onOpenDocumentsModal: () => void;
  onOpenHmacModal: () => void;
}

export default function DocumentsSection({ 
  boxVariants, 
  onOpenDocumentsModal, 
  onOpenHmacModal 
}: DocumentsSectionProps) {
  return (
    <motion.div
      variants={boxVariants}
      className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
    >
      <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-blue-600"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
          Documents
        </h3>
      </div>
      <div className="col-span-4 p-4">
        <motion.div
          variants={boxVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group cursor-pointer"
          onClick={onOpenDocumentsModal}
        >
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <motion.li variants={boxVariants} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              Interaction flow overview
            </motion.li>
            <motion.li variants={boxVariants} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              Sample certified pdf
            </motion.li>
            <motion.li variants={boxVariants} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              Sample uncertified original
            </motion.li>
            <motion.li variants={boxVariants} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              Data dictionary
            </motion.li>
            <motion.li variants={boxVariants} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              Iframe Integration guide
            </motion.li>
          </ul>
        </motion.div>
      </div>

      <div className="col-span-5 p-4">
        <motion.div
          variants={boxVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
        >
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <motion.li 
              variants={boxVariants} 
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              onClick={onOpenHmacModal}
            >
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">HMAC for Secure Communication</p>
                <p>Authenticate and secure data using HMAC</p>
              </div>
            </motion.li>
            <motion.li variants={boxVariants} className="flex items-center gap-3"></motion.li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
} 