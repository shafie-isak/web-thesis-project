import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  FiUsers, FiLogOut,
} from 'react-icons/fi';
import {
  MdOutlineDashboard, MdOutlineBookmarks, MdOutlineQuiz
} from 'react-icons/md';
import {
  LuPanelLeftClose, LuPanelRightClose,
} from 'react-icons/lu';
import {
  IoBookOutline, IoBookmark
} from 'react-icons/io5';

import {
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';
import {
  TbCertificate,
} from 'react-icons/tb';
import {
  GiSwordman,
} from 'react-icons/gi';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard', icon: <MdOutlineDashboard size={20} />, path: '/dashboard' },
    { label: 'Users', icon: <FiUsers size={20} />, path: '/dashboard/users' },
    { label: 'Subjects', icon: <IoBookOutline size={20} />, path: '/dashboard/subjects' },
    { label: 'chapters', icon: <MdOutlineBookmarks size={20} />, path: '/dashboard/chapters' },
    { label: 'questions', icon: <MdOutlineQuiz size={20} />, path: '/dashboard/questions' },
    { label: 'Past Federal Exams', icon: <HiOutlineClipboardDocumentList size={20} />, path: '/dashboard/past-exams' },
    { label: 'Mock Exams', icon: <TbCertificate size={20} />, path: '/dashboard/mock-exams' },
    { label: 'Challenges', icon: <GiSwordman size={20} />, path: '/dashboard/challenges' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7A4DDF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  };

  return (
    <div className={`h-[97.5vh] rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 text-white ${expanded ? 'w-64' : 'w-20'} duration-300 p-4 flex flex-col`}>
      <div className="flex justify-between items-center mb-8">
        {expanded && <div className="text-xl font-bold">LOGO HERE</div>}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white hover:bg-white/15 p-2 rounded-lg"
        >
          {expanded ? <LuPanelLeftClose size={20} /> : <LuPanelRightClose size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              location.pathname === link.path ? 'bg-white/20' : 'hover:bg-white/15'
            }`}
          >
            {link.icon}
            {expanded && link.label}
          </Link>
        ))}
      </nav>

      <button
        className="flex items-center justify-center bg-white gap-3 p-3 rounded-lg mt-auto text-[#7A4DDF]"
        onClick={handleLogout}
      >
        <FiLogOut size={20} />
        {expanded && 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;











// import { useState } from 'react';
// import { FiUsers, FiLogOut } from 'react-icons/fi';
// import { MdOutlineDashboard } from "react-icons/md";
// import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";
// import { IoBookOutline } from "react-icons/io5";
// import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
// import { TbCertificate } from "react-icons/tb";
// import { GiSwordman } from "react-icons/gi";
// import Swal from 'sweetalert2';
// import { Link, useLocation } from 'react-router-dom';


// const Sidebar = () => {
//     const [expanded, setExpanded] = useState(true);
//     const [activeItem, setActiveItem] = useState('Dashboard');
// const location = useLocation();



//     const handleLogout = () => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "You will be logged out.",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#7A4DDF',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Yes, log me out'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 window.location.href = '/login';
//             }
//         });
//     };

//     return (
//         <div className={`h-[97.5vh] rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 text-white ${expanded ? 'w-64' : 'w-20'} duration-300 p-4 flex flex-col`}>
//             <>
//                 <div className="flex justify-between items-center mb-8">
//                     {expanded && (
//                         <div className="text-xl font-bold">
//                             LOGO HERE
//                         </div>
//                     )}
//                     <button
//                         onClick={() => setExpanded(!expanded)}
//                         className="text-white hover:bg-white/15 p-2 rounded-lg"
//                     >
//                         {expanded ? <LuPanelLeftClose size={20} /> : <LuPanelRightClose size={20} />}
//                     </button>
//                 </div>

//                 <nav className="flex flex-col gap-1 flex-grow">
//   <Link
//     to="/dashboard"
//     className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/' ? 'bg-white/20' : 'hover:bg-white/15'}`}
//   >
//     <MdOutlineDashboard size={20} />
//     {expanded && 'Dashboard'}
//   </Link>

//   <Link
//     to="users"
//     className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/users' ? 'bg-white/20' : 'hover:bg-white/15'}`}
//   >
//     <FiUsers size={20} />
//     {expanded && 'Users'}
//   </Link>

//   <Link
//     to="/subjects"
//     className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/subjects' ? 'bg-white/20' : 'hover:bg-white/15'}`}
//   >
//     <IoBookOutline size={20} />
//     {expanded && 'Subjects'}
//   </Link>

//   <Link
//     to="/past-exams"
//     className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/past-exams' ? 'bg-white/20' : 'hover:bg-white/15'}`}
//   >
//     <HiOutlineClipboardDocumentList size={20} />
//     {expanded && 'Past Federal Exams'}
//   </Link>

//   <Link
//     to="/mock-exams"
//     className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/mock-exams' ? 'bg-white/20' : 'hover:bg-white/15'}`}
//   >
//     <TbCertificate size={20} />
//     {expanded && 'Mock Exams'}
//   </Link>

//   <Link
//     to="/challenges"
//     className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/challenges' ? 'bg-white/20' : 'hover:bg-white/15'}`}
//   >
//     <GiSwordman size={20} />
//     {expanded && 'Challenges'}
//   </Link>
// </nav>
//             </>

//             <button
//                 className={`flex items-center justify-center bg-white gap-3 p-3 rounded-lg mt-auto text-[#7A4DDF] `}
//                 onClick={handleLogout}
//             >
//                 <FiLogOut size={20} />
//                 {expanded && 'Logout'}
//             </button>
//         </div>
//     );
// };

// export default Sidebar;