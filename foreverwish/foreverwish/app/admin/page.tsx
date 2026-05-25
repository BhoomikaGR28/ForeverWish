'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WishProject, User } from '@/types';
import Navbar from '@/components/layout/Navbar';
import {
  Users,
  FileHeart,
  Eye,
  TrendingUp,
  Shield,
  Loader2,
  Crown,
  Globe,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ADMIN_UIDS = ['YOUR_ADMIN_UID_HERE'];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<WishProject[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !ADMIN_UIDS.includes(user.uid)) {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !db) return;
    const fetchData = async () => {
      try {
        const [usersSnap, projectsSnap] = await Promise.all([
          getDocs(query(collection(db, 'users'), limit(50))),
          getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(50))),
        ]);
        setUsers(usersSnap.docs.map((d) => ({ uid: d.id, ...d.data() } as User)));
        setProjects(projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as WishProject)));
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalViews = projects.reduce((a, p) => a + (p.viewCount || 0), 0);
  const publishedCount = projects.filter((p) => p.isPublic).length;
  const premiumUsers = users.filter((u) => u.isPremium).length;

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-playfair text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/40 text-sm">ForeverWish Management Dashboard</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'from-rose-400 to-pink-400' },
            { label: 'Total Wishes', value: projects.length, icon: FileHeart, color: 'from-violet-400 to-purple-400' },
            { label: 'Total Views', value: totalViews, icon: Eye, color: 'from-amber-400 to-orange-400' },
            { label: 'Premium Users', value: premiumUsers, icon: Crown, color: 'from-emerald-400 to-teal-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex items-center gap-2">
              <FileHeart size={18} className="text-rose-400" />
              <h2 className="font-semibold text-white">Recent Wishes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Recipient', 'Category', 'Status', 'Views'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 8).map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-white font-medium">{p.recipientName}</td>
                      <td className="px-4 py-3 text-xs text-white/50 capitalize">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                          {p.isPublic ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{p.viewCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm">No projects yet</div>
              )}
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex items-center gap-2">
              <Users size={18} className="text-violet-400" />
              <h2 className="font-semibold text-white">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Name', 'Email', 'Plan', 'Wishes'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 8).map((u) => (
                    <tr key={u.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-white font-medium truncate max-w-[100px]">
                        {u.displayName || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-white/50 truncate max-w-[120px]">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.isPremium ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/40'}`}>
                          {u.isPremium ? '👑 Premium' : 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{u.wishCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm">No users yet</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Analytics summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-emerald-400" />
            <h2 className="font-semibold text-white">Analytics Overview</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Published Wishes', value: publishedCount, sub: `${Math.round((publishedCount / Math.max(projects.length, 1)) * 100)}% of total` },
              { label: 'Avg Views/Wish', value: projects.length ? Math.round(totalViews / projects.length) : 0, sub: 'per published wish' },
              { label: 'Conversion Rate', value: `${Math.round((premiumUsers / Math.max(users.length, 1)) * 100)}%`, sub: 'free → premium' },
              { label: 'Top Category', value: '🎂 Birthday', sub: 'most popular' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-xs font-semibold uppercase tracking-wide">{stat.label}</div>
                <div className="text-white/30 text-xs mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
