import { useState } from 'react';
import { FiUsers, FiLogOut } from 'react-icons/fi';
import { MdOutlineDashboard } from "react-icons/md";
import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { TbCertificate } from "react-icons/tb";
import { GiSwordman } from "react-icons/gi";

const Sidebar = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeItem, setActiveItem] = useState('Dashboard');

    return (
        <div className={`h-[97.5vh] rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 text-white ${expanded ? 'w-64' : 'w-20'} duration-300 p-4 flex flex-col`}>
            <>
                <div className="flex justify-between items-center mb-8">
                    {expanded && (
                        <div className="text-xl font-bold">
                            LOGO HERE
                        </div>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-white hover:bg-white/15 p-2 rounded-lg"
                    >
                        {expanded ? <LuPanelLeftClose size={20} /> : <LuPanelRightClose size={20} />}
                    </button>
                </div>

                <nav className="flex flex-col gap-1 flex-grow">
                    <button
                        className={`flex items-center gap-3 p-3 rounded-lg ${activeItem === 'Dashboard' ? 'bg-white/20' : 'hover:bg-white/15'}`}
                        onClick={() => setActiveItem('Dashboard')}
                    >
                        <MdOutlineDashboard size={20} />
                        {expanded && 'Dashboard'}
                    </button>

                    <button
                        className={`flex items-center gap-3 p-3 rounded-lg ${activeItem === 'Users' ? 'bg-white/20' : 'hover:bg-white/15'}`}
                        onClick={() => setActiveItem('Users')}
                    >
                        <FiUsers size={20} />
                        {expanded && 'Users'}
                    </button>

                    <button
                        className={`flex items-center gap-3 p-3 rounded-lg ${activeItem === 'Subjects' ? 'bg-white/20' : 'hover:bg-white/15'}`}
                        onClick={() => setActiveItem('Subjects')}
                    >
                        <IoBookOutline size={20} />
                        {expanded && 'Subjects'}
                    </button>

                    <button
                        className={`flex items-center gap-3 p-3 rounded-lg ${activeItem === 'Past Federal Exams' ? 'bg-white/20' : 'hover:bg-white/15'}`}
                        onClick={() => setActiveItem('Past Federal Exams')}
                    >
                        <HiOutlineClipboardDocumentList size={20} />
                        {expanded && 'Past Federal Exams'}
                    </button>

                    <button
                        className={`flex items-center gap-3 p-3 rounded-lg ${activeItem === 'Mock Exams' ? 'bg-white/20' : 'hover:bg-white/15'}`}
                        onClick={() => setActiveItem('Mock Exams')}
                    >
                        <TbCertificate size={20} />
                        {expanded && 'Mock Exams'}
                    </button>

                    <button
                        className={`flex items-center gap-3 p-3 rounded-lg ${activeItem === 'Challenges' ? 'bg-white/20' : 'hover:bg-white/15'}`}
                        onClick={() => setActiveItem('Challenges')}
                    >
                        <GiSwordman size={20} />
                        {expanded && 'Challenges'}
                    </button>
                </nav>
            </>

            <button
                className={`flex items-center justify-center bg-white gap-3 p-3 rounded-lg mt-auto text-[#7A4DDF] `}
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }}
            >
                <FiLogOut size={20} />
                {expanded && 'Logout'}
            </button>
        </div>
    );
};

export default Sidebar;