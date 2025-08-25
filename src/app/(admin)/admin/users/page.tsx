"use client";
import React from "react";

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pagination, setPagination] = React.useState<any>(null);
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  const fetchUsers = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users-paginate?page=${pageNum}&per_page=${perPage}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const result = await res.json();
      setUsers(result.data.data);
      setPagination(result.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={user.profile_image || "/file.svg"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {pagination && (
              <div className="flex justify-center items-center gap-2 py-4">
                <button
                  className="px-3 py-1 rounded border text-xs font-medium"
                  disabled={pagination.current_page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                {pagination.links.filter((l: any) => l.label.match(/^\d+$/)).map((link: any) => (
                  <button
                    key={link.label}
                    className={`px-3 py-1 rounded text-xs font-medium ${link.active ? 'bg-blue-600 text-white' : 'border'}`}
                    onClick={() => setPage(Number(link.label))}
                    disabled={link.active}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded border text-xs font-medium"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
