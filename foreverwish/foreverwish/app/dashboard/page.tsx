'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { getUserProjects, deleteProject, publishProject } from '@/lib/db';
import { WishProject } from '@/types';
import { getTheme, getShareUrl, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  Share2,
  Globe,
  Lock,
  Sparkles,
  Crown,
  BarChart3,
  Copy,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function DashboardPage() {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<WishProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getUserProjects(user.uid)
        .then(setProjects)
        .finally(() => setLoadingProjects(false));
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wish? This cannot be undone.')) return;
    await deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
    toast.success('Wish deleted');
  };

  const handlePublish = async (id: string) => {
    await publishProject(id);
    setProjects((p) =>
      p.map((x) => (x.id === id ? { ...x, isPublic: true } : x))
    );
    toast.success('Wish published! 🎉');
  };

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(getShareUrl(slug));
    toast.success('Link copied! 🔗');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-playfair text-3xl font-bold text-gray-900">
              Hello, {user?.displayName?.split(' ')[0] || 'Friend'} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              You have {projects.length} wish{projects.length !== 1 ? 'es' : ''} created
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-rose-200 hover:scale-105 transition-all"
          >
            <Plus size={18} />
            New ForeverWish
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Wishes Created', value: projects.length, emoji: '💝', color: 'rose' },
            { label: 'Published', value: projects.filter((p) => p.isPublic).length, emoji: '🌐', color: 'violet' },
            {
              label: 'Total Views',
              value: projects.reduce((a, p) => a + (p.viewCount || 0), 0),
              emoji: '👀',
              color: 'amber',
            },
            { label: 'Plan', value: userDoc?.isPremium ? 'Premium' : 'Free', emoji: userDoc?.isPremium ? '👑' : '🎁', color: 'emerald' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100"
            >
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Premium banner */}
        {!userDoc?.isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Crown size={24} className="text-yellow-300" />
              <div>
                <div className="font-bold text-lg">Upgrade to Premium</div>
                <div className="text-white/80 text-sm">
                  Unlimited wishes, all themes, AI generator, music & more
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-rose-600 font-bold hover:shadow-lg transition-all flex-shrink-0">
              <Sparkles size={16} />
              Go Premium — ₹299/mo
            </button>
          </motion.div>
        )}

        {/* Projects grid */}
        {loadingProjects ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">💝</div>
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
              No wishes yet
            </h3>
            <p className="text-gray-400 mb-8">
              Create your first ForeverWish and make someone's day magical
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold"
            >
              <Plus size={18} />
              Create Your First Wish
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const theme = getTheme(project.theme);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Theme preview */}
                  <div
                    className={`h-24 bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
                  >
                    <div className="text-center text-white">
                      <div className="text-2xl mb-1">{theme.emoji}</div>
                      <div className="font-playfair font-bold text-sm truncate max-w-[200px] px-4">
                        For {project.recipientName}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 capitalize">
                          {project.category.replace('-', ' ')} wish
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {project.createdAt ? formatDate(project.createdAt) : 'Just now'}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                          project.isPublic
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {project.isPublic ? (
                          <><Globe size={10} /> Published</>
                        ) : (
                          <><Lock size={10} /> Draft</>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                      <Eye size={12} />
                      {project.viewCount || 0} views
                      <span className="mx-1">·</span>
                      <span>{theme.name}</span>
                    </div>

                    <div className="flex gap-2">
                      {project.isPublic ? (
                        <button
                          onClick={() => handleCopyLink(project.slug)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 text-rose-500 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                          <Copy size={12} />
                          Copy Link
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(project.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
                        >
                          <Globe size={12} />
                          Publish
                        </button>
                      )}
                      <Link
                        href={`/create?edit=${project.id}`}
                        className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <Edit3 size={14} />
                      </Link>
                      {project.isPublic && (
                        <Link
                          href={`/wish/${project.slug}`}
                          className="p-2 rounded-xl bg-violet-100 text-violet-500 hover:bg-violet-200 transition-colors"
                          target="_blank"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
