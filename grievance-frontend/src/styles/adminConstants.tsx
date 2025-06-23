import { LayoutDashboard, FilePlus, Clock, CheckCircle, Eye, XCircle, LogOut } from 'lucide-react';

export const AdminNavItems = [
    {
        title: 'Dashboard',
        href: '/admin/grievance/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        position: 'top',
    },
    {
        title: 'New Grievance',
        href: '/admin/grievance/new',
        icon: <FilePlus className="w-5 h-5" />,
        position: 'top',
    },
    {
        title: 'Pending Grievance',
        href: '/admin/grievance/pending',
        icon: <Clock className="w-5 h-5" />,
        position: 'top',
    },
    {
        title: 'Resolve Grievance',
        href: '/admin/grievance/resolve',
        icon: <CheckCircle className="w-5 h-5" />,
        position: 'top',
    },
    {
        title: 'Review Grievance',
        href: '/admin/grievance/review',
        icon: <Eye className="w-5 h-5" />,
        position: 'top',
    },
    {
        title: 'Reject Grievance',
        href: '/admin/grievance/reject',
        icon: <XCircle className="w-5 h-5" />,
        position: 'top',
    },
    {
        title: 'Logout',
        href: '/logout',
        icon: <LogOut className="w-5 h-5" />,
        position: 'top',
    },
];
